const { ethers } = require("hardhat");

async function main() {
	const [account] = await ethers.getSigners();

	const init_balance = await ethers.provider.getBalance(account.address);
	const gas_price = await ethers.provider.getGasPrice();

	const BrianToken = await ethers.getContractFactory("BrianCoin", account);
	brianToken = await BrianToken.deploy();
	await brianToken.deployed();

	const final_balance = await ethers.provider.getBalance(account.address);

	console.log(
		"Estimated Cost:",
		ethers.utils.formatEther(
			init_balance
				.sub(final_balance)
				.div(gas_price)
				.mul(ethers.utils.parseUnits("143", "gwei"))
		)
	);

	console.log("Deployed BrianCoin from address:", account.address);
	console.log("Contract located at:", brianToken.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
