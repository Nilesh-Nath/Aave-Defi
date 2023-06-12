const { getNamedAccounts, ethers } = require("hardhat");
const { getWeth, AMOUNT } = require("../scripts/getWeth");

async function main() {
  // For ETH TO WETH conversion
  await getWeth();
  const { deployer } = await getNamedAccounts();

  // Getting LendingPool
  const lendingPool = await lendingPoolAcc(deployer);

  console.log(`Lendning Pool Address is ${lendingPool.address}`);

  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  // Approve LendingPool to access and use our WETH Token
  await approveToken(wethTokenAddress, lendingPool.address, AMOUNT, deployer);

  console.log("Depositing....");
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  console.log("Deposited!");

  // Getting User / Borrower Data like How much he/she borrowed , has collateral and how much he/she can now borrow

  let { totalDebtETH, availableBorrowsETH } = await getBorrowData(
    lendingPool,
    deployer
  );

  // Getting Dai price from chainlink Price Feed DAI/ETH

  const daiPrice = await getDaiPrice();

  const amountToBorrowDai =
    availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber());

  console.log(`You can Borrow ${amountToBorrowDai} DAI.`);
  const amountToBorrowDaiWei = ethers.utils.parseEther(
    amountToBorrowDai.toString()
  );

  const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  // Borrow
  await borrow(daiTokenAddress, lendingPool, amountToBorrowDaiWei, deployer);
  await getBorrowData(lendingPool, deployer);

  // Repay
  await repay(amountToBorrowDaiWei, daiTokenAddress, lendingPool, deployer);
  await getBorrowData(lendingPool, deployer);
}

async function lendingPoolAcc(account) {
  // There's a LendingPoolAddressesProvider which actually provides the address of LendingPool
  const lendingPoolAddressProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    account
  );
  const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );

  return lendingPool;
}

// Approving
async function approveToken(
  erc20Address,
  spenderAddress,
  amountToSpend,
  account
) {
  const erc20 = await ethers.getContractAt("IERC20", erc20Address, account);
  const tx = await erc20.approve(spenderAddress, amountToSpend);
  await tx.wait(1);
  console.log("Approved!");
}
// Get Borrower Data
async function getBorrowData(lendingPool, account) {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account);
  console.log(
    `You have ${totalCollateralETH.toString()} amount worth of ETH collateral!`
  );
  console.log(
    `You have ${totalDebtETH.toString()} amount worth of ETH Borrowed!`
  );
  console.log(
    `You still can borrow ${availableBorrowsETH.toString()} amount of ETH!`
  );

  return { totalDebtETH, availableBorrowsETH };
}

async function getDaiPrice() {
  const daiEthPriceFeed = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x773616E4d11A78F511299002da57A0a94577F1f4"
  );
  const daiPrice = (await daiEthPriceFeed.latestRoundData())[1];
  console.log(`DAI/ETH price is ${daiPrice.toString()}`);
  return daiPrice;
}

async function borrow(daiAddress, lendingPool, amountToBorrowDaiWei, account) {
  const borrowTx = await lendingPool.borrow(
    daiAddress,
    amountToBorrowDaiWei,
    1,
    0,
    account
  );
  await borrowTx.wait(1);
  console.log("You've Borrowed !");
}

async function repay(amount, daiAddress, lendingPool, account) {
  await approveToken(daiAddress, lendingPool.address, amount, account);
  const replayTx = await lendingPool.repay(daiAddress, amount, 1, account);
  await replayTx.wait(1);
  console.log("Repayed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
