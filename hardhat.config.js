require("@nomiclabs/hardhat-ethers");
require("@tenderly/hardhat-tenderly");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("@nomiclabs/hardhat-truffle5");

const { utils } = require("ethers");

const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1;
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2;

const PRIVATE_KEY_GANACHE_1 = process.env.PRIVATE_KEY_GANACHE_1;
const PRIVATE_KEY_GANACHE_2 = process.env.PRIVATE_KEY_GANACHE_2;

console.log({PRIVATE_KEY_GANACHE_1,PRIVATE_KEY_GANACHE_2})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "localhost",
  solidity: {
    compilers: [
      {
        version: "0.7.0",
      },
    ],
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [`${PRIVATE_KEY_1}` , `${PRIVATE_KEY_2}`],
    },
    polygon_testnet: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      gasPrice: 20000000000,
      accounts: [`${PRIVATE_KEY_1}` , `${PRIVATE_KEY_2}`],
      allowUnlimitedContractSize:true
    },
    localhost: {
      url: "http://localhost:8545",
      // accounts: [`${PRIVATE_KEY_GANACHE_1}` , `${PRIVATE_KEY_GANACHE_2}`],
      timeout: 150000,
      allowUnlimitedContractSize:true,
      gas: 9992000000,
      blockGasLimit: 0x1fffffffffffff,    
    },
    mainnet: {
      url: "https://matic-mainnet-full-rpc.bwarelabs.com",
      chainId: 137,
      accounts: [`${PRIVATE_KEY_1}`],
    },
    hardhat: {
      
      timeout: 150000,
      allowUnlimitedContractSize:true,
      gas: 9992000000,
      blockGasLimit: 0x1fffffffffffff,    

    },
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
  mocha: {
    timeout: 50000
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT,
    username: process.env.TENDERLY_USERNAME,
  },
};
