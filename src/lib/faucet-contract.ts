import { ethers } from 'ethers';

// Base USDC Contract Address (Mainnet)
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Contract ABIs
export const FAUCET_ABI = [
  // View functions
  'function claimAmount() view returns (uint256)',
  'function canClaim(uint256 fid) view returns (bool)',
  'function getNextClaimTime(uint256 fid) view returns (uint256)',
  'function getTimeUntilNextClaim(uint256 fid) view returns (uint256)',
  'function lastClaimTime(uint256 fid) view returns (uint256)',
  'function hasClaimed(uint256 fid) view returns (bool)',
  'function contributions(address user) view returns (uint256)',
  'function getContribution(address user) view returns (uint256)',
  'function isEligibleForOGNFT(address user) view returns (bool)',
  'function hasOGNFT(address user) view returns (bool)',
  'function hasClaimerNFT(uint256 fid) view returns (bool)',
  'function usdcToken() view returns (address)',
  'function signerWallet() view returns (address)',

  // Write functions
  'function claimGasless(uint256 fid, uint256 nonce, bytes signature)',
  'function claim(uint256 fid)',
  'function contribute(uint256 amount)',
  'function mintOGNFT(address to)',
  'function mintClaimerNFT(uint256 fid, address to)',

  // Events
  'event Claimed(uint256 indexed fid, address indexed user, uint256 amount, uint256 timestamp)',
  'event ClaimedGasless(uint256 indexed fid, address indexed user, uint256 amount, uint256 nonce)',
  'event Contributed(address indexed user, uint256 amount, uint256 totalContribution)',
  'event OGNFTMinted(address indexed user, uint256 tokenId)',
  'event ClaimerNFTMinted(uint256 indexed fid, address indexed user, uint256 tokenId)',
];

export const USDC_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
];

// Contract interaction helper functions
export class FaucetContract {
  private contract: ethers.Contract;
  private provider: ethers.Provider;

  constructor(contractAddress: string, providerUrl: string) {
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    this.contract = new ethers.Contract(contractAddress, FAUCET_ABI, this.provider);
  }

  // View functions
  async getClaimAmount(): Promise<bigint> {
    return await this.contract.claimAmount();
  }

  async canClaim(fid: number): Promise<boolean> {
    return await this.contract.canClaim(fid);
  }

  async getNextClaimTime(fid: number): Promise<number> {
    const timestamp = await this.contract.getNextClaimTime(fid);
    return Number(timestamp);
  }

  async getTimeUntilNextClaim(fid: number): Promise<number> {
    const seconds = await this.contract.getTimeUntilNextClaim(fid);
    return Number(seconds);
  }

  async getLastClaimTime(fid: number): Promise<number> {
    const timestamp = await this.contract.lastClaimTime(fid);
    return Number(timestamp);
  }

  async hasClaimed(fid: number): Promise<boolean> {
    return await this.contract.hasClaimed(fid);
  }

  async getContribution(address: string): Promise<bigint> {
    return await this.contract.getContribution(address);
  }

  async isEligibleForOGNFT(address: string): Promise<boolean> {
    return await this.contract.isEligibleForOGNFT(address);
  }

  async hasOGNFT(address: string): Promise<boolean> {
    return await this.contract.hasOGNFT(address);
  }

  async hasClaimerNFT(fid: number): Promise<boolean> {
    return await this.contract.hasClaimerNFT(fid);
  }

  async getSignerWallet(): Promise<string> {
    return await this.contract.signerWallet();
  }

  // Get contract with signer for write operations
  getContractWithSigner(privateKey: string): ethers.Contract {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    return new ethers.Contract(
      this.contract.target as string,
      FAUCET_ABI,
      wallet
    );
  }
}

// USDC Contract helper
export class USDCContract {
  private contract: ethers.Contract;
  private provider: ethers.Provider;

  constructor(providerUrl: string) {
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    this.contract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, this.provider);
  }

  async getBalance(address: string): Promise<bigint> {
    return await this.contract.balanceOf(address);
  }

  async getAllowance(owner: string, spender: string): Promise<bigint> {
    return await this.contract.allowance(owner, spender);
  }

  async getDecimals(): Promise<number> {
    return await this.contract.decimals();
  }

  getContractWithSigner(privateKey: string): ethers.Contract {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    return new ethers.Contract(USDC_ADDRESS, USDC_ABI, wallet);
  }
}

// Signature generation for gasless transactions
export async function generateClaimSignature(
  privateKey: string,
  userAddress: string,
  fid: number,
  nonce: number
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  
  // Create message hash
  const messageHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256', 'uint256'],
    [userAddress, fid, nonce]
  );

  // Sign the message hash
  const signature = await wallet.signMessage(ethers.getBytes(messageHash));
  return signature;
}

// Helper to format USDC amount (6 decimals)
export function parseUSDC(amount: string): bigint {
  return ethers.parseUnits(amount, 6);
}

export function formatUSDC(amount: bigint): string {
  return ethers.formatUnits(amount, 6);
}

// Helper to format ETH amount (18 decimals)
export function formatETH(amount: bigint): string {
  return ethers.formatEther(amount);
}

export function parseETH(amount: string): bigint {
  return ethers.parseEther(amount);
}
