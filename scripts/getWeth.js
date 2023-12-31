const { getNamedAccounts, ethers } = require("hardhat");

// Amount of ETH to convert into WETH
const AMOUNT = ethers.utils.parseEther("0.02");

async function getWeth() {
  const { deployer } = await getNamedAccounts();

  // Getting the instance of WETH contract
  const iWeth = await ethers.getContractAt(
    "IWeth",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    deployer
  );
  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  const balance = await iWeth.balanceOf(deployer);
  console.log(`Balance is ${balance.toString()}WETH....`);
}

module.exports = { getWeth, AMOUNT };
