import { ethers } from 'ethers';

// Chainlink ETH/USD Price Feed on Base Mainnet
export const CHAINLINK_ETH_USD_FEED = '0x694AA1769357215DE4FAC081bf1f309aDC325306';

// Contract ABI for HighPhausFaucetDynamic
export const FAUCET_ABI = [
  // View functions
  'function CLAIM_INTERVAL() view returns (uint256)',
  'function trustedAttestor() view returns (address)',
  'function ethUsdFeed() view returns (address)',
  'function totalContributed() view returns (uint256)',
  'function contributions(address) view returns (uint256)',
  'function lastClaimByFarcaster(bytes32) view returns (uint256)',
  'function lastClaimByWallet(address) view returns (uint256)',
  'function getEthUsdPrice() view returns (uint256)',
  'function getCurrentClaimAmountWei() view returns (uint256)',
  'function canClaimByFarcaster(bytes32 farcasterIdHash) view returns (bool)',
  'function canClaimByWallet(address wallet) view returns (bool)',
  'function getTimeUntilNextClaimFarcaster(bytes32 farcasterIdHash) view returns (uint256)',
  'function getTimeUntilNextClaimWallet(address wallet) view returns (uint256)',

  // Write functions
  'function claim(bytes32 farcasterIdHash, uint256 expiry, bytes signature)',
  'function contribute() payable',

  // Admin functions
  'function setTrustedAttestor(address _attestor)',
  'function withdraw(address payable to, uint256 amount)',
  'function withdrawAll(address payable to)',

  // Events
  'event Claimed(address indexed wallet, bytes32 indexed farcasterIdHash, uint256 amount, uint256 timestamp)',
  'event Contributed(address indexed contributor, uint256 amount, uint256 newTotal)',
  'event TrustedAttestorUpdated(address indexed oldAttestor, address indexed newAttestor)',
];

// Contract interaction helper class
export class FaucetContract {
  private contract: ethers.Contract;
  private provider: ethers.Provider;

  constructor(contractAddress: string, providerUrl: string) {
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    this.contract = new ethers.Contract(contractAddress, FAUCET_ABI, this.provider);
  }

  // View functions
  async getClaimInterval(): Promise<number> {
    const interval = await this.contract.CLAIM_INTERVAL();
    return Number(interval);
  }

  async getTrustedAttestor(): Promise<string> {
    return await this.contract.trustedAttestor();
  }

  async getTotalContributed(): Promise<bigint> {
    return await this.contract.totalContributed();
  }

  async getContribution(address: string): Promise<bigint> {
    return await this.contract.contributions(address);
  }

  async getEthUsdPrice(): Promise<number> {
    const price = await this.contract.getEthUsdPrice();
    return Number(price); // Price with 8 decimals
  }

  async getCurrentClaimAmountWei(): Promise<bigint> {
    return await this.contract.getCurrentClaimAmountWei();
  }

  async canClaimByFarcaster(farcasterIdHash: string): Promise<boolean> {
    return await this.contract.canClaimByFarcaster(farcasterIdHash);
  }

  async canClaimByWallet(wallet: string): Promise<boolean> {
    return await this.contract.canClaimByWallet(wallet);
  }

  async getTimeUntilNextClaimFarcaster(farcasterIdHash: string): Promise<number> {
    const seconds = await this.contract.getTimeUntilNextClaimFarcaster(farcasterIdHash);
    return Number(seconds);
  }

  async getTimeUntilNextClaimWallet(wallet: string): Promise<number> {
    const seconds = await this.contract.getTimeUntilNextClaimWallet(wallet);
    return Number(seconds);
  }

  async getLastClaimByFarcaster(farcasterIdHash: string): Promise<number> {
    const timestamp = await this.contract.lastClaimByFarcaster(farcasterIdHash);
    return Number(timestamp);
  }

  async getLastClaimByWallet(wallet: string): Promise<number> {
    const timestamp = await this.contract.lastClaimByWallet(wallet);
    return Number(timestamp);
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

// Generate Farcaster ID hash (keccak256 of FID)
export function generateFarcasterIdHash(fid: number): string {
  return ethers.keccak256(ethers.toBeHex(fid, 32));
}

// Generate Reown attestation signature for claim
export async function generateClaimSignature(
  privateKey: string,
  farcasterIdHash: string,
  walletAddress: string,
  expiry: number,
  chainId: number,
  contractAddress: string
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  
  // Create payload hash matching contract logic
  const payloadHash = ethers.solidityPackedKeccak256(
    ['bytes32', 'address', 'uint256', 'uint256', 'address'],
    [farcasterIdHash, walletAddress, expiry, chainId, contractAddress]
  );

  // Sign the message hash
  const signature = await wallet.signMessage(ethers.getBytes(payloadHash));
  return signature;
}

// Helper to format ETH amount
export function formatETH(amount: bigint): string {
  return ethers.formatEther(amount);
}

export function parseETH(amount: string): bigint {
  return ethers.parseEther(amount);
}

// Format USD price from Chainlink (8 decimals)
export function formatUSDPrice(price: number): string {
  return (price / 1e8).toFixed(2);
}
