const { BigNumber } = require("ethers");
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  
  [deployer] = await ethers.getSigners();
  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(deployer.address);

  console.log(`Treasury contract Deployed: ${treasury.address}`);

  const WicryptDevice = await ethers.getContractFactory("WicryptDevice");
  const wicryptDevice = await WicryptDevice.deploy(treasury.address);

  await mintDevicesInBulk(wicryptDevice);

  console.log(`WicryptDevice contract Deployed: ${wicryptDevice.address}`);

  // if (hre.network.name === "mainnet" || hre.network.name === "testnet") {
  //   await hre.run("verify:verify", {
  //     address: wicryptDevice.address,
  //     constructorArguments: [treasury.address],
  //   });

  //   await hre.run("verify:verify", {
  //     address: treasury.address,
  //     constructorArguments: [],
  //   });


  // } else {
  //   console.log("Contracts deployed to", hre.network.name, "network. Please verify them manually.");
  // }
}


async function mintDevicesInBulk(wicryptDeviceContract)
{
  const TokenContract = await ethers.getContractFactory("ERC20Token");
  let testPaymentToken = await TokenContract.deploy();

  let wntPrice = BigNumber.from("1000000000000000000000");
  let tstPrice = BigNumber.from("1000000000000000000000");

  await wicryptDeviceContract.setMaxWhitelistSize(BigNumber.from("500"));
  await wicryptDeviceContract.unlockMint();
  await wicryptDeviceContract.setBaseURI("https://ipfs.io/ipns/k51qzi5uqu5dmfihpz4ajxcf4ieevx7q8prfxl4hodlu13t7h7xodybd0j8yui/");
  await wicryptDeviceContract.createDevice("Lynx", BigNumber.from("7500"));
  await wicryptDeviceContract.createDevice("Spider", BigNumber.from("7500"));
  await wicryptDeviceContract.setDevicePrice(1, testPaymentToken.addres, wntPrice);
  await wicryptDeviceContract.setDevicePrice(2, testPaymentToken.addres, wntPrice);

  if (hre.network.name === "testnet") {

    const polygonTstTokenAddress="0x2d7882bedcbfddce29ba99965dd3cdf7fcb10a1e";

    await wicryptDeviceContract.setDevicePrice(1, polygonTstTokenAddress.addres, tstPrice);
    await wicryptDeviceContract.setDevicePrice(2, polygonTstTokenAddress.addres, tstPrice);
  
  }

  for (let i = 0; i < 2000; i++) {    
    let {latitude,longitude}  = generateCoordinates();
    let quantity = Math.floor(Math.random() * 5) + 1
    let deviceId = Math.floor(Math.random() * 2) + 1;

    let priceForBulkMint = wntPrice.mul(BigNumber.from(quantity.toString()));
    testPaymentToken.approve(wicryptDeviceContract.address, priceForBulkMint)
    await wicryptDeviceContract.mint(BigNumber.from(deviceId.toString()), BigNumber.from(quantity.toString()),testPaymentToken.address,longitude,latitude  )
  }

}

function generateCoordinates()
{
  const longitude = getRandomInRange(-180,180,3);
  const latitude = getRandomInRange(-90,90,3);
  return {latitude, longitude};

}

function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
