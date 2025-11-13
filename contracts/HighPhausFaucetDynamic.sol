// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract HighPhausFaucetDynamic is Ownable {
    using ECDSA for bytes32;

    uint256 public constant CLAIM_INTERVAL = 7 days;
    address public trustedAttestor;
    AggregatorV3Interface public ethUsdFeed;

    uint256 public totalContributed;
    mapping(address => uint256) public contributions;

    mapping(bytes32 => uint256) public lastClaimByFarcaster;
    mapping(address => uint256) public lastClaimByWallet;

    event Claimed(address indexed wallet, bytes32 indexed farcasterIdHash, uint256 amount, uint256 timestamp);
    event Contributed(address indexed contributor, uint256 amount, uint256 newTotal);
    event TrustedAttestorUpdated(address indexed oldAttestor, address indexed newAttestor);

    constructor(address _attestor, address _priceFeed) Ownable(msg.sender) {
        require(_attestor != address(0), "invalid attestor");
        trustedAttestor = _attestor;
        ethUsdFeed = AggregatorV3Interface(_priceFeed);
    }

    // ============ Contribute / Fund ============

    /// @notice Deposit funds to support the faucet and builders.
    function contribute() external payable {
        require(msg.value > 0, "zero value");
        totalContributed += msg.value;
        contributions[msg.sender] += msg.value;
        emit Contributed(msg.sender, msg.value, totalContributed);
    }

    /// @notice Fallback for direct sends
    receive() external payable {
        totalContributed += msg.value;
        contributions[msg.sender] += msg.value;
        emit Contributed(msg.sender, msg.value, totalContributed);
    }

    // ============ Oracle / Pricing ============

    function getEthUsdPrice() public view returns (uint256) {
        (, int256 answer, , , ) = ethUsdFeed.latestRoundData();
        require(answer > 0, "invalid price");
        // Chainlink price has 8 decimals
        return uint256(answer);
    }

    function getCurrentClaimAmountWei() public view returns (uint256) {
        // $0.10 * 1e8 (to match feed decimals)
        uint256 usdValue = 10_000_000; // 0.10 * 1e8
        uint256 ethPrice = getEthUsdPrice();
        uint256 ethAmount = (usdValue * 1e18) / ethPrice;
        return ethAmount;
    }

    // ============ Claim ============

    function claim(bytes32 farcasterIdHash, uint256 expiry, bytes calldata signature) external {
        require(block.timestamp <= expiry, "expired");
        uint256 lastF = lastClaimByFarcaster[farcasterIdHash];
        uint256 lastW = lastClaimByWallet[msg.sender];
        require(block.timestamp >= lastF + CLAIM_INTERVAL, "Farcaster claimed");
        require(block.timestamp >= lastW + CLAIM_INTERVAL, "Wallet claimed");

        uint256 chainId;
        assembly { chainId := chainid() }

        bytes32 payloadHash = keccak256(abi.encodePacked(farcasterIdHash, msg.sender, expiry, chainId, address(this)));
        bytes32 ethSigned = payloadHash.toEthSignedMessageHash();
        address signer = ethSigned.recover(signature);
        require(signer == trustedAttestor, "invalid signer");

        uint256 claimAmount = getCurrentClaimAmountWei();
        require(address(this).balance >= claimAmount, "faucet empty");

        lastClaimByFarcaster[farcasterIdHash] = block.timestamp;
        lastClaimByWallet[msg.sender] = block.timestamp;

        (bool sent, ) = payable(msg.sender).call{value: claimAmount}("");
        require(sent, "transfer failed");

        emit Claimed(msg.sender, farcasterIdHash, claimAmount, block.timestamp);
    }

    // ============ View Functions ============

    /// @notice Check if a Farcaster ID hash can claim
    function canClaimByFarcaster(bytes32 farcasterIdHash) external view returns (bool) {
        uint256 lastClaim = lastClaimByFarcaster[farcasterIdHash];
        return block.timestamp >= lastClaim + CLAIM_INTERVAL;
    }

    /// @notice Check if a wallet can claim
    function canClaimByWallet(address wallet) external view returns (bool) {
        uint256 lastClaim = lastClaimByWallet[wallet];
        return block.timestamp >= lastClaim + CLAIM_INTERVAL;
    }

    /// @notice Get time until next claim for Farcaster ID
    function getTimeUntilNextClaimFarcaster(bytes32 farcasterIdHash) external view returns (uint256) {
        uint256 lastClaim = lastClaimByFarcaster[farcasterIdHash];
        if (lastClaim == 0) return 0;
        uint256 nextClaim = lastClaim + CLAIM_INTERVAL;
        if (block.timestamp >= nextClaim) return 0;
        return nextClaim - block.timestamp;
    }

    /// @notice Get time until next claim for wallet
    function getTimeUntilNextClaimWallet(address wallet) external view returns (uint256) {
        uint256 lastClaim = lastClaimByWallet[wallet];
        if (lastClaim == 0) return 0;
        uint256 nextClaim = lastClaim + CLAIM_INTERVAL;
        if (block.timestamp >= nextClaim) return 0;
        return nextClaim - block.timestamp;
    }

    // ============ Admin ============

    function setTrustedAttestor(address _attestor) external onlyOwner {
        require(_attestor != address(0), "invalid attestor");
        emit TrustedAttestorUpdated(trustedAttestor, _attestor);
        trustedAttestor = _attestor;
    }

    /// @notice Owner withdraw of excess funds
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "insufficient");
        to.transfer(amount);
    }

    /// @notice Withdraw all funds
    function withdrawAll(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "no balance");
        to.transfer(balance);
    }
}

