import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const BACKEND_SIGNER = "0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637";
const NETWORK = process.argv[2] || 'baseSepolia'; // baseSepolia or base

// Network configs
const NETWORKS = {
  baseSepolia: {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
    chainId: 84532,
    explorer: 'https://sepolia.basescan.org',
  },
  base: {
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    chainId: 8453,
    explorer: 'https://basescan.org',
  },
};

async function main() {
  console.log('🚀 Deploying BaseFarcasterAuthFaucet\n');
  
  const networkConfig = NETWORKS[NETWORK];
  if (!networkConfig) {
    console.error('❌ Invalid network. Use: baseSepolia or base');
    process.exit(1);
  }

  console.log('Network:', NETWORK);
  console.log('RPC:', networkConfig.rpcUrl);
  console.log('Backend Signer:', BACKEND_SIGNER);
  console.log('');

  // Setup provider and wallet
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ DEPLOYER_PRIVATE_KEY not set in .env.local');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log('Deploying from:', wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log('Balance:', ethers.formatEther(balance), 'ETH');
  console.log('');

  // Load contract
  const contractPath = join(__dirname, '../artifacts/contracts/BaseFarcasterAuthFaucet.sol/BaseFarcasterAuthFaucet.json');
  let contractJson;
  try {
    contractJson = JSON.parse(readFileSync(contractPath, 'utf8'));
  } catch (error) {
    console.error('❌ Contract not compiled. Run: npx hardhat compile');
    console.error('   Or: cd to project root and run this script');
    process.exit(1);
  }

  // Deploy
  console.log('Deploying contract...');
  const factory = new ethers.ContractFactory(
    contractJson.abi,
    contractJson.bytecode,
    wallet
  );

  const contract = await factory.deploy(BACKEND_SIGNER);
  console.log('Transaction hash:', contract.deploymentTransaction().hash);
  console.log('Waiting for confirmation...');
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log('');
  console.log('✅ Contract deployed!');
  console.log('Address:', address);
  console.log('Explorer:', `${networkConfig.explorer}/address/${address}`);
  console.log('');

  // Verify configuration
  const backendSigner = await contract.backendSigner();
  const targetUsd = await contract.targetUsdCents();
  const owner = await contract.owner();

  console.log('📋 Configuration:');
  console.log('  Backend Signer:', backendSigner);
  console.log('  Target USD: $' + (Number(targetUsd) / 100));
  console.log('  Owner:', owner);
  console.log('');

  console.log('📝 Next steps:');
  console.log('');
  console.log('1. Add to .env.local:');
  console.log(`   NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=${address}`);
  console.log('');
  console.log('2. Fund the contract:');
  console.log(`   cast send ${address} --value 1ether --private-key $DEPLOYER_PRIVATE_KEY --rpc-url ${networkConfig.rpcUrl}`);
  console.log('');
  console.log('3. Verify on BaseScan:');
  console.log(`   npx hardhat verify --network ${NETWORK} ${address} ${BACKEND_SIGNER}`);
  console.log('');
  console.log('🎉 Deployment complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

