const { expect, use } = require("chai");
const { BigNumber } = require('ethers');
const { solidity, loadFixture, deployContract } = require("ethereum-waffle");
const { ethers } = require("hardhat");

use(solidity);




describe("Token Faucet contract", function () {


  it("Add Asset Should Change ERC-20 Contract Ownership", async function () {

    const [tokenOwner, tokenRequester] = await ethers.getSigners();

    const TokenContract = await ethers.getContractFactory("ERC20Token");
    const Contract = await ethers.getContractFactory("TokenFaucet");

    const faucetContract = await Contract.deploy();
    const tokenContract = await TokenContract.deploy("Test USDC", "TUSDC");

    let balance = await tokenContract.balanceOf(tokenOwner.address);

    await expect(faucetContract.addAsset(tokenContract.address))
    .to.emit(faucetContract, "AssetAdded")
      .withArgs(
        tokenContract.address
      );
  });

});