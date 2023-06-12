# Aave Protocol Usage Example

This project demonstrates how to interact with the Aave Protocol programmatically to perform actions such as depositing collateral, borrowing, and repaying. The example focuses on converting Ethereum (ETH) to Wrapped Ethereum (WETH) using the IWETH interface and utilizing the LendingPoolInterface for depositing, borrowing, and repaying.

## Prerequisites

- Node.js and npm installed
- Ethereum wallet with testnet or mainnet funds
- Aave protocol smart contracts deployed on the Ethereum network

## Usage

Follow these steps to interact with the Aave Protocol:

1. Convert ETH to WETH:

   - Use the IWETH interface to wrap your ETH into WETH.

2. Deposit Collateral:

   - Obtain the LendingPool address from the LendingPoolAddressesProvider.
   - Use the LendingPoolInterface to deposit the desired amount of WETH as collateral.

3. Borrow Funds:

   - Approve the LendingPool to access and use your tokens by calling the `approve` function from the ERC20 interface.
   - Retrieve the borrower data using the `getUserAccountData` function.
   - Convert the desired ETH amount to DAI.
   - Borrow the specified amount of DAI from the LendingPool.

4. Repay Borrowed Funds:

   - Use the `repay` function from the LendingPoolInterface to repay the borrowed amount.

5. (Optional) Configure Mainnet Forking:

   - If you want to test the project on the Ethereum mainnet, configure the mainnet forking environment.


## License

[MIT](LICENSE)
