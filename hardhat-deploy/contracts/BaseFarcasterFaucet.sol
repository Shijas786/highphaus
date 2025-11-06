// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract Ownable {
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    constructor() { _transferOwnership(msg.sender); }
    modifier onlyOwner() { require(msg.sender == _owner, "not owner"); _; }
    function owner() public view returns (address) { return _owner; }
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "zero address");
        _transferOwnership(newOwner);
    }
    function _transferOwnership(address newOwner) internal {
        address old = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(old, newOwner);
    }
}

abstract contract ReentrancyGuard {
    uint256 private _status;
    modifier nonReentrant() { require(_status != 2, "reentrant"); _status = 2; _; _status = 1; }
    constructor() { _status = 1; }
}

interface IIdRegistry {
    function idOf(address fidOwner) external view returns (uint256);
}

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(uint80 _roundId)
        external
        view
        returns (uint80, int256, uint256, uint256, uint80);
    function latestRoundData()
        external
        view
        returns (uint80, int256, uint256, uint256, uint80);
}

contract BaseFarcasterFaucet is Ownable, ReentrancyGuard {
    IIdRegistry public immutable idRegistry;
    AggregatorV3Interface public immutable priceFeed;
    uint256 public constant USD_AMOUNT = 1e17;
    mapping(uint256 => bool) public fidClaimed;

    event ClaimedFarcaster(address indexed user, uint256 fid, uint256 weiAmount);

    modifier onlyEOA() { require(msg.sender == tx.origin, "contracts disallowed"); _; }

    constructor(address _idRegistry, address _priceFeed) Ownable() ReentrancyGuard() {
        require(_idRegistry != address(0), "idRegistry zero");
        require(_priceFeed != address(0), "priceFeed zero");
        idRegistry = IIdRegistry(_idRegistry);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getWeiAmount() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "invalid price");
        return (USD_AMOUNT * 1e8) / uint256(price);
    }

    function claimFarcaster() external nonReentrant onlyEOA {
        uint256 fid = idRegistry.idOf(msg.sender);
        require(fid != 0, "no Farcaster account");
        require(!fidClaimed[fid], "already claimed");

        uint256 weiAmount = getWeiAmount();
        require(address(this).balance >= weiAmount, "faucet empty");

        fidClaimed[fid] = true;
        (bool ok, ) = payable(msg.sender).call{value: weiAmount}("");
        require(ok, "transfer failed");

        emit ClaimedFarcaster(msg.sender, fid, weiAmount);
    }

    receive() external payable {}
    fallback() external payable {}

    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "zero address");
        require(amount <= address(this).balance, "insufficient");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "withdraw failed");
    }
}

