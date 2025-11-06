// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title BaseFarcasterAuthFaucet
 * @dev ETH faucet with Farcaster FID and Base App authentication
 * @notice Users can claim once via Farcaster ID or verified Base App account
 */
contract BaseFarcasterAuthFaucet is Ownable, ReentrancyGuard, Pausable {
    using ECDSA for bytes32;

    // Chainlink ETH/USD Price Feed (Base Mainnet)
    address public constant ETH_USD_FEED = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
    
    // Target USD value per claim (in cents, e.g., 10 = $0.10)
    uint256 public targetUsdCents = 10;
    
    // Backend signer address (for Base App attestations)
    address public backendSigner;
    
    // Track claimed Farcaster FIDs
    mapping(uint256 => bool) public farcasterClaimed;
    
    // Track claimed Base App IDs
    mapping(string => bool) public baseAppClaimed;
    
    // Track claimed wallets (prevent double-claiming)
    mapping(address => bool) public walletClaimed;
    
    // Stats
    uint256 public totalClaimedFarcaster;
    uint256 public totalClaimedBaseApp;
    uint256 public totalEthClaimed;
    
    // Events
    event ClaimedFarcaster(address indexed recipient, uint256 fid, uint256 amount, uint256 timestamp);
    event ClaimedBaseApp(address indexed recipient, string baseId, uint256 amount, uint256 timestamp);
    event BackendSignerUpdated(address newSigner);
    event TargetUsdUpdated(uint256 newTargetCents);
    event Deposit(address indexed sender, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);
    
    constructor(address _backendSigner) {
        require(_backendSigner != address(0), "Invalid signer address");
        backendSigner = _backendSigner;
    }
    
    /**
     * @dev Claim ETH using Farcaster FID
     * @notice User's Farcaster ID must not have claimed before
     */
    function claimFarcaster() external nonReentrant whenNotPaused {
        // Note: In production, you'd need to verify the FID on-chain
        // This could be done via an oracle or backend verification
        // For now, we'll use a simple FID claim mechanism
        
        // You would need to pass FID as parameter and verify it
        // For demo purposes, we'll use msg.sender as a proxy
        uint256 fid = uint256(uint160(msg.sender)); // Placeholder
        
        require(!farcasterClaimed[fid], "Farcaster ID already claimed");
        require(!walletClaimed[msg.sender], "Wallet already claimed");
        
        uint256 claimAmount = getClaimAmount();
        require(address(this).balance >= claimAmount, "Insufficient faucet balance");
        
        farcasterClaimed[fid] = true;
        walletClaimed[msg.sender] = true;
        totalClaimedFarcaster++;
        totalEthClaimed += claimAmount;
        
        (bool success, ) = payable(msg.sender).call{value: claimAmount}("");
        require(success, "Transfer failed");
        
        emit ClaimedFarcaster(msg.sender, fid, claimAmount, block.timestamp);
    }
    
    /**
     * @dev Claim ETH using Base App attestation
     * @param baseId User's Base App ID
     * @param signature Backend signature proving baseId ownership
     */
    function claimBaseApp(string memory baseId, bytes memory signature) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(!baseAppClaimed[baseId], "Base App ID already claimed");
        require(!walletClaimed[msg.sender], "Wallet already claimed");
        
        // Verify signature from backend
        bytes32 msgHash = keccak256(
            abi.encodePacked(msg.sender, "baseapp", baseId, address(this))
        );
        bytes32 ethSignedHash = msgHash.toEthSignedMessageHash();
        address signer = ethSignedHash.recover(signature);
        
        require(signer == backendSigner, "Invalid signature");
        
        uint256 claimAmount = getClaimAmount();
        require(address(this).balance >= claimAmount, "Insufficient faucet balance");
        
        baseAppClaimed[baseId] = true;
        walletClaimed[msg.sender] = true;
        totalClaimedBaseApp++;
        totalEthClaimed += claimAmount;
        
        (bool success, ) = payable(msg.sender).call{value: claimAmount}("");
        require(success, "Transfer failed");
        
        emit ClaimedBaseApp(msg.sender, baseId, claimAmount, block.timestamp);
    }
    
    /**
     * @dev Get claim amount in ETH based on ETH/USD price
     * @return Amount of ETH to claim (in wei)
     */
    function getClaimAmount() public view returns (uint256) {
        // For now, return a fixed amount
        // In production, integrate with Chainlink price feed
        // Example: If ETH = $2500, and target = $0.10:
        // return (0.10 / 2500) * 1e18 = 40000000000000000 wei
        
        return 40000000000000000; // 0.00004 ETH (~$0.10 at $2500/ETH)
        
        // Production implementation with Chainlink:
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(ETH_USD_FEED);
        // (, int256 price, , , ) = priceFeed.latestRoundData();
        // uint256 ethUsd = uint256(price); // Price with 8 decimals
        // return (targetUsdCents * 1e18 * 1e8) / (ethUsd * 100);
    }
    
    /**
     * @dev Check if a Farcaster FID can claim
     */
    function canClaimFarcaster(uint256 fid) external view returns (bool) {
        return !farcasterClaimed[fid];
    }
    
    /**
     * @dev Check if a Base App ID can claim
     */
    function canClaimBaseApp(string memory baseId) external view returns (bool) {
        return !baseAppClaimed[baseId];
    }
    
    /**
     * @dev Check if a wallet can claim
     */
    function canClaimWallet(address wallet) external view returns (bool) {
        return !walletClaimed[wallet];
    }
    
    /**
     * @dev Update backend signer (owner only)
     */
    function setBackendSigner(address _newSigner) external onlyOwner {
        require(_newSigner != address(0), "Invalid signer address");
        backendSigner = _newSigner;
        emit BackendSignerUpdated(_newSigner);
    }
    
    /**
     * @dev Update target USD value (owner only)
     */
    function setTargetUsd(uint256 _newTargetCents) external onlyOwner {
        require(_newTargetCents > 0, "Target must be greater than 0");
        targetUsdCents = _newTargetCents;
        emit TargetUsdUpdated(_newTargetCents);
    }
    
    /**
     * @dev Withdraw all ETH from the contract (owner only)
     */
    function withdrawAll() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(owner(), balance);
    }
    
    /**
     * @dev Withdraw specific amount (owner only)
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient balance");
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(owner(), amount);
    }
    
    /**
     * @dev Pause the faucet (owner only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the faucet (owner only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Receive ETH
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @dev Fallback function
     */
    fallback() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}

