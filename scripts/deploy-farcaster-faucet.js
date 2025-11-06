const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying BaseFarcasterAuthFaucet to Base...\n");

  // Backend signer address (from your generated key)
  const BACKEND_SIGNER = "0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637";

  console.log("Network:", hre.network.name);
  console.log("Backend Signer Address:", BACKEND_SIGNER);
  console.log("");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("");

  // Deploy contract
  console.log("Deploying BaseFarcasterAuthFaucet...");
  const BaseFarcasterAuthFaucet = await hre.ethers.getContractFactory(
    "BaseFarcasterAuthFaucet"
  );
  
  const faucet = await BaseFarcasterAuthFaucet.deploy(BACKEND_SIGNER);
  await faucet.waitForDeployment();

  const faucetAddress = await faucet.getAddress();
  console.log("✅ BaseFarcasterAuthFaucet deployed to:", faucetAddress);
  console.log("");

  // Verify configuration
  const backendSigner = await faucet.backendSigner();
  const targetUsd = await faucet.targetUsdCents();
  
  console.log("📋 Contract Configuration:");
  console.log("  Backend Signer:", backendSigner);
  console.log("  Target USD:", Number(targetUsd) / 100, "USD");
  console.log("  Owner:", await faucet.owner());
  console.log("");

  // Save deployment info
  console.log("📝 Add this to your .env.local:");
  console.log(`NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=${faucetAddress}`);
  console.log("");

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("🔍 Verify contract on BaseScan:");
    console.log(
      `npx hardhat verify --network ${hre.network.name} ${faucetAddress} ${BACKEND_SIGNER}`
    );
    console.log("");
    
    console.log("⏳ Waiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      await hre.run("verify:verify", {
        address: faucetAddress,
        constructorArguments: [BACKEND_SIGNER],
      });
      console.log("✅ Contract verified!");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
      console.log("You can verify manually later with the command above.");
    }
  }

  console.log("");
  console.log("💰 Don't forget to fund the contract:");
  console.log(
    `cast send ${faucetAddress} --value 1ether --private-key $DEPLOYER_PRIVATE_KEY --rpc-url ${hre.network.config.url}`
  );
  console.log("");
  console.log("🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

