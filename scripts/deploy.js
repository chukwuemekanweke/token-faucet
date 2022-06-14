const { BigNumber } = require("ethers");
const hre = require("hardhat");
const { ethers } = hre;

async function main() {  
  [deployer] = await ethers.getSigners();

  const TokenContract = await ethers.getContractFactory("ERC20Token")
  const TokenFaucetContract = await ethers.getContractFactory("TokenFaucet");

  const busd = await TokenContract.deploy("USD Tether", "BUSD");
  await busd.deployed();

  const usdc = await TokenContract.deploy("USD Tether Coin", "USDC");
  await usdc.deployed();

  const usdt = await TokenContract.deploy("USD Tether", "USDT");
  await usdt.deployed();

  const dai = await TokenContract.deploy("Dai", "DAI");
  await dai.deployed();

  const xend = await TokenContract.deploy("Xend", "Xend");
  await xend.deployed();

  const wnt = await TokenContract.deploy("Wicrypt Network Token", "WNT");
  await wnt.deployed();

  const faucetContract = await TokenFaucetContract.deploy();
  await faucetContract.deployed();

  console.log(`BUSD: ${busd.address}`);
  console.log(`USDC: ${usdc.address}`);
  console.log(`USDT: ${usdt.address}`);
  console.log(`DAI: ${dai.address}`);
  console.log(`XEND: ${xend.address}`);
  console.log(`WNT: ${wnt.address}`);
  console.log(`Faucet Contract: ${faucetContract.address}`);
 

  (await faucetContract.addAsset(busd.address)).wait();
  (await faucetContract.addAsset(usdc.address)).wait();
  (await faucetContract.addAsset(usdt.address)).wait();
  (await faucetContract.addAsset(dai.address)).wait();
  (await faucetContract.addAsset(xend.address)).wait();
  (await faucetContract.addAsset(wnt.address)).wait();
  console.log(`Faucet contract assets added`);

  (await busd.transferOwnership(faucetContract.address)).wait();
  (await usdc.transferOwnership(faucetContract.address)).wait();
  (await usdt.transferOwnership(faucetContract.address)).wait();
  (await dai.transferOwnership(faucetContract.address)).wait();
  (await xend.transferOwnership(faucetContract.address)).wait();
  (await wnt.transferOwnership(faucetContract.address)).wait();
  console.log(`Toke ownership transferred to faucet contract`);

  // if (hre.network.name === "mainnet" || hre.network.name === "testnet") {
    
  //   await hre.run("verify:verify", {
  //     address: faucetContract.address,
  //     constructorArguments: [],
  //   });

  // } else {
  //   console.log("Contracts deployed to", hre.network.name, "network. Please verify them manually.");
  // }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
