require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY ?? "0x0000000000000000000000000000000000000000000000000000000000000001";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [PRIVATE_KEY],
      timeout: 60000,
    },
  },
};
