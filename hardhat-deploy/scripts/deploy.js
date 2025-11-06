import hre from "hardhat";

async function main() {
  const Faucet = await hre.ethers.getContractFactory("BaseFarcasterFaucet");
  const idRegistry = "0x00000000FcB080bAE665aFAb5e41C7E4CBfD5A61";
  const priceFeed = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
  
  console.log("🚀 Deploying BaseFarcasterFaucet...");
  console.log("   ID Registry:", idRegistry);
  console.log("   Price Feed:", priceFeed);
  console.log("");
  
  const faucet = await Faucet.deploy(idRegistry, priceFeed);
  await faucet.waitForDeployment();
  
  const address = await faucet.getAddress();
  console.log("✅ Faucet deployed at:", address);
  console.log("");
  console.log("📋 Add this to your .env.local:");
  console.log(`NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=${address}`);
  console.log("");
  console.log("🔍 Verify on BaseScan:");
  console.log(`https://sepolia.basescan.org/address/${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

