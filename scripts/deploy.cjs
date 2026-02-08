const { ethers } = require("hardhat");

const PLATFORM_WALLET = "0xFA510493D1921407a9893d2f8E72cAF919B4e459";
const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1,000,000 GEC (18 decimals)

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Platform wallet (initial supply + owner):", PLATFORM_WALLET);

  const GreenEarthCredits = await ethers.getContractFactory("GreenEarthCredits");
  const token = await GreenEarthCredits.deploy(INITIAL_SUPPLY, PLATFORM_WALLET);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("GreenEarthCredits (GEC) deployed to:", address);
  console.log("Initial supply:", ethers.formatEther(INITIAL_SUPPLY), "GEC");
  console.log("Owner:", await token.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
