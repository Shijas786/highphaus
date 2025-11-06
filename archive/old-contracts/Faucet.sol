// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Faucet
 * @dev A simple ETH faucet contract with cooldown mechanism
 * @notice This contract allows users to claim a fixed amount of ETH once per cooldown period
 */
contract Faucet is Ownable, ReentrancyGuard, Pausable {
    // Amount of ETH to distribute per claim (in wei)
    uint256 public claimAmount;
    
    // Cooldown period between claims (in seconds)
    uint256 public cooldownTime;
    
    // Mapping to track last claim time for each address
    mapping(address => uint256) public lastClaimTime;
    
    // Total ETH claimed
    uint256 public totalClaimed;
    
    // Total number of claims
    uint256 public totalClaimants;
    
    // Events
    event Claimed(address indexed recipient, uint256 amount, uint256 timestamp);
    event ClaimAmountUpdated(uint256 newAmount);
    event CooldownTimeUpdated(uint256 newCooldown);
    event Deposit(address indexed sender, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);
    
    /**
     * @dev Constructor
     * @param _claimAmount Amount of ETH to distribute per claim
     * @param _cooldownTime Cooldown period between claims in seconds
     */
    constructor(uint256 _claimAmount, uint256 _cooldownTime) {
        require(_claimAmount > 0, "Claim amount must be greater than 0");
        require(_cooldownTime > 0, "Cooldown time must be greater than 0");
        
        claimAmount = _claimAmount;
        cooldownTime = _cooldownTime;
    }
    
    /**
     * @dev Claim ETH from the faucet
     * @notice Can only claim once per cooldown period
     */
    function claim() external nonReentrant whenNotPaused {
        require(canClaim(msg.sender), "Cannot claim yet");
        require(address(this).balance >= claimAmount, "Insufficient faucet balance");
        
        lastClaimTime[msg.sender] = block.timestamp;
        totalClaimed += claimAmount;
        totalClaimants++;
        
        (bool success, ) = payable(msg.sender).call{value: claimAmount}("");
        require(success, "Transfer failed");
        
        emit Claimed(msg.sender, claimAmount, block.timestamp);
    }
    
    /**
     * @dev Check if an address can claim
     * @param user Address to check
     * @return bool Whether the address can claim
     */
    function canClaim(address user) public view returns (bool) {
        if (lastClaimTime[user] == 0) {
            return true;
        }
        return block.timestamp >= lastClaimTime[user] + cooldownTime;
    }
    
    /**
     * @dev Get time remaining until next claim
     * @param user Address to check
     * @return uint256 Seconds remaining (0 if can claim now)
     */
    function timeUntilNextClaim(address user) public view returns (uint256) {
        if (canClaim(user)) {
            return 0;
        }
        return (lastClaimTime[user] + cooldownTime) - block.timestamp;
    }
    
    /**
     * @dev Update claim amount (owner only)
     * @param _newAmount New claim amount
     */
    function setClaimAmount(uint256 _newAmount) external onlyOwner {
        require(_newAmount > 0, "Amount must be greater than 0");
        claimAmount = _newAmount;
        emit ClaimAmountUpdated(_newAmount);
    }
    
    /**
     * @dev Update cooldown time (owner only)
     * @param _newCooldown New cooldown time in seconds
     */
    function setCooldownTime(uint256 _newCooldown) external onlyOwner {
        require(_newCooldown > 0, "Cooldown must be greater than 0");
        cooldownTime = _newCooldown;
        emit CooldownTimeUpdated(_newCooldown);
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
     * @param amount Amount to withdraw
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


