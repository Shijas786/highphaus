// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title FarcasterGasFaucetWithNFT
 * @notice Gasless faucet with 48-hour cooldown, USDC contributions, and dual NFT rewards
 */
contract FarcasterGasFaucetWithNFT is ERC721, Ownable, ReentrancyGuard, Pausable {
    using ECDSA for bytes32;

    // ============ Constants ============
    uint256 public constant COOLDOWN_PERIOD = 48 hours; // 172800 seconds
    uint256 public constant MIN_CONTRIBUTION = 1e6; // 1 USDC (6 decimals)
    
    // NFT Token IDs
    uint256 private constant OG_NFT_TYPE = 1;
    uint256 private constant CLAIMER_NFT_TYPE = 2;

    // ============ State Variables ============
    uint256 public claimAmount; // Amount of ETH per claim in wei
    IERC20 public immutable usdcToken; // Base USDC token
    address public signerWallet; // Server wallet for gasless signatures
    string private _baseTokenURI; // Base URI for NFT metadata

    // Mappings
    mapping(uint256 => uint256) public lastClaimTime; // FID => timestamp
    mapping(uint256 => bool) public hasClaimed; // FID => has claimed at least once
    mapping(address => uint256) public contributions; // user => total USDC contributed
    mapping(uint256 => bool) public hasClaimerNFT; // FID => has minted claimer NFT
    mapping(address => bool) public hasOGNFT; // address => has minted OG NFT
    mapping(uint256 => bool) public usedNonces; // nonce => used (for replay protection)

    // NFT token ID counters
    uint256 private _ogNFTCounter;
    uint256 private _claimerNFTCounter;
    uint256 private constant MAX_TOKEN_ID = 10000;

    // ============ Events ============
    event Claimed(uint256 indexed fid, address indexed user, uint256 amount, uint256 timestamp);
    event ClaimedGasless(uint256 indexed fid, address indexed user, uint256 amount, uint256 nonce);
    event Contributed(address indexed user, uint256 amount, uint256 totalContribution);
    event OGNFTMinted(address indexed user, uint256 tokenId);
    event ClaimerNFTMinted(uint256 indexed fid, address indexed user, uint256 tokenId);
    event ClaimAmountUpdated(uint256 oldAmount, uint256 newAmount);
    event SignerWalletUpdated(address indexed oldSigner, address indexed newSigner);
    event BaseURIUpdated(string newBaseURI);

    // ============ Constructor ============
    constructor(
        address _usdcToken,
        address _signerWallet,
        uint256 _claimAmount,
        string memory baseURI
    ) ERC721("Farcaster Gas Faucet NFT", "FGFNFT") Ownable(msg.sender) {
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_signerWallet != address(0), "Invalid signer address");
        require(_claimAmount > 0, "Claim amount must be > 0");
        
        usdcToken = IERC20(_usdcToken);
        signerWallet = _signerWallet;
        claimAmount = _claimAmount;
        _baseTokenURI = baseURI;
    }

    // ============ Claim Functions ============
    
    /**
     * @notice Gasless claim - server pays gas, user gets ETH
     * @param fid Farcaster ID
     * @param nonce Unique nonce for replay protection
     * @param signature Server signature authorizing the claim
     */
    function claimGasless(
        uint256 fid,
        uint256 nonce,
        bytes memory signature
    ) external nonReentrant whenNotPaused {
        require(fid > 0, "Invalid FID");
        require(!usedNonces[nonce], "Nonce already used");
        require(canClaim(fid), "Cannot claim yet");
        require(address(this).balance >= claimAmount, "Insufficient faucet balance");

        // Verify signature
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, fid, nonce));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        require(recoveredSigner == signerWallet, "Invalid signature");

        // Mark nonce as used
        usedNonces[nonce] = true;

        // Update state
        lastClaimTime[fid] = block.timestamp;
        hasClaimed[fid] = true;

        // Transfer ETH
        (bool success, ) = payable(msg.sender).call{value: claimAmount}("");
        require(success, "ETH transfer failed");

        emit ClaimedGasless(fid, msg.sender, claimAmount, nonce);
    }

    /**
     * @notice Direct claim (user pays gas as backup)
     * @param fid Farcaster ID
     */
    function claim(uint256 fid) external nonReentrant whenNotPaused {
        require(fid > 0, "Invalid FID");
        require(canClaim(fid), "Cannot claim yet");
        require(address(this).balance >= claimAmount, "Insufficient faucet balance");

        // Update state
        lastClaimTime[fid] = block.timestamp;
        hasClaimed[fid] = true;

        // Transfer ETH
        (bool success, ) = payable(msg.sender).call{value: claimAmount}("");
        require(success, "ETH transfer failed");

        emit Claimed(fid, msg.sender, claimAmount, block.timestamp);
    }

    /**
     * @notice Check if a FID can claim
     */
    function canClaim(uint256 fid) public view returns (bool) {
        if (lastClaimTime[fid] == 0) return true; // First time claim
        return block.timestamp >= lastClaimTime[fid] + COOLDOWN_PERIOD;
    }

    /**
     * @notice Get next claim time for a FID
     */
    function getNextClaimTime(uint256 fid) public view returns (uint256) {
        if (lastClaimTime[fid] == 0) return block.timestamp; // Can claim now
        return lastClaimTime[fid] + COOLDOWN_PERIOD;
    }

    /**
     * @notice Get seconds until next claim
     */
    function getTimeUntilNextClaim(uint256 fid) public view returns (uint256) {
        if (canClaim(fid)) return 0;
        uint256 nextClaimTime = getNextClaimTime(fid);
        return nextClaimTime > block.timestamp ? nextClaimTime - block.timestamp : 0;
    }

    // ============ Contribution Functions ============

    /**
     * @notice Contribute USDC to support the faucet
     * @param amount Amount of USDC to contribute (in USDC decimals, typically 6)
     */
    function contribute(uint256 amount) external nonReentrant whenNotPaused {
        require(amount >= MIN_CONTRIBUTION, "Contribution too small");
        
        // Transfer USDC from user to contract
        bool success = usdcToken.transferFrom(msg.sender, address(this), amount);
        require(success, "USDC transfer failed");

        // Update contribution tracking
        contributions[msg.sender] += amount;

        emit Contributed(msg.sender, amount, contributions[msg.sender]);
    }

    /**
     * @notice Get user's total contributions
     */
    function getContribution(address user) external view returns (uint256) {
        return contributions[user];
    }

    /**
     * @notice Check if user is eligible for OG NFT
     */
    function isEligibleForOGNFT(address user) public view returns (bool) {
        return contributions[user] >= MIN_CONTRIBUTION && !hasOGNFT[user];
    }

    // ============ NFT Minting Functions ============

    /**
     * @notice Mint OG Contributor NFT (requires >= 1 USDC contribution)
     * @param to Address to mint NFT to
     */
    function mintOGNFT(address to) external nonReentrant whenNotPaused {
        require(to != address(0), "Invalid address");
        require(contributions[to] >= MIN_CONTRIBUTION, "Insufficient contribution");
        require(!hasOGNFT[to], "Already minted OG NFT");
        
        uint256 tokenId = _getNextOGTokenId();
        hasOGNFT[to] = true;
        _safeMint(to, tokenId);

        emit OGNFTMinted(to, tokenId);
    }

    /**
     * @notice Mint Claimer NFT (requires claim history)
     * @param fid Farcaster ID
     * @param to Address to mint NFT to
     */
    function mintClaimerNFT(uint256 fid, address to) external nonReentrant whenNotPaused {
        require(fid > 0, "Invalid FID");
        require(to != address(0), "Invalid address");
        require(hasClaimed[fid], "Must claim gas first");
        require(!hasClaimerNFT[fid], "Already minted Claimer NFT");

        uint256 tokenId = _getNextClaimerTokenId();
        hasClaimerNFT[fid] = true;
        _safeMint(to, tokenId);

        emit ClaimerNFTMinted(fid, to, tokenId);
    }

    /**
     * @dev Get next OG NFT token ID (range: 1-4999)
     */
    function _getNextOGTokenId() private returns (uint256) {
        _ogNFTCounter++;
        require(_ogNFTCounter < MAX_TOKEN_ID / 2, "OG NFT supply exhausted");
        return _ogNFTCounter;
    }

    /**
     * @dev Get next Claimer NFT token ID (range: 5000-9999)
     */
    function _getNextClaimerTokenId() private returns (uint256) {
        _claimerNFTCounter++;
        require(_claimerNFTCounter < MAX_TOKEN_ID / 2, "Claimer NFT supply exhausted");
        return (MAX_TOKEN_ID / 2) + _claimerNFTCounter;
    }

    /**
     * @dev Return token type based on token ID
     */
    function getTokenType(uint256 tokenId) public pure returns (string memory) {
        if (tokenId > 0 && tokenId < MAX_TOKEN_ID / 2) {
            return "OG";
        } else if (tokenId >= MAX_TOKEN_ID / 2 && tokenId < MAX_TOKEN_ID) {
            return "Claimer";
        }
        return "Unknown";
    }

    // ============ NFT Metadata ============

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        
        string memory baseURI = _baseURI();
        if (bytes(baseURI).length == 0) return "";

        // Return appropriate metadata based on token type
        if (tokenId < MAX_TOKEN_ID / 2) {
            return string(abi.encodePacked(baseURI, "/og.json"));
        } else {
            return string(abi.encodePacked(baseURI, "/claimer.json"));
        }
    }

    // ============ Owner Functions ============

    /**
     * @notice Update claim amount
     */
    function setClaimAmount(uint256 _claimAmount) external onlyOwner {
        require(_claimAmount > 0, "Invalid claim amount");
        uint256 oldAmount = claimAmount;
        claimAmount = _claimAmount;
        emit ClaimAmountUpdated(oldAmount, _claimAmount);
    }

    /**
     * @notice Update signer wallet for gasless transactions
     */
    function setSignerWallet(address _signerWallet) external onlyOwner {
        require(_signerWallet != address(0), "Invalid signer address");
        address oldSigner = signerWallet;
        signerWallet = _signerWallet;
        emit SignerWalletUpdated(oldSigner, _signerWallet);
    }

    /**
     * @notice Update base URI for NFT metadata
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    /**
     * @notice Pause contract
     */
    function setPaused(bool paused) external onlyOwner {
        if (paused) {
            _pause();
        } else {
            _unpause();
        }
    }

    /**
     * @notice Withdraw ETH from contract
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Withdraw all ETH from contract
     */
    function withdrawAll() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Withdraw USDC from contract
     */
    function withdrawUSDC(uint256 amount) external onlyOwner {
        require(amount <= usdcToken.balanceOf(address(this)), "Insufficient USDC balance");
        bool success = usdcToken.transfer(owner(), amount);
        require(success, "USDC withdrawal failed");
    }

    /**
     * @notice Withdraw all USDC from contract
     */
    function withdrawUSDCAll() external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        require(balance > 0, "No USDC balance to withdraw");
        bool success = usdcToken.transfer(owner(), balance);
        require(success, "USDC withdrawal failed");
    }

    // ============ Receive ETH ============
    
    receive() external payable {}
    fallback() external payable {}
}

