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
		"Estimated Cost of deployment:",
		ethers.utils.formatEther(
			init_balance
				.sub(final_balance)
				.div(gas_price)
				.mul(ethers.utils.parseUnits("143", "gwei"))
		)
	);

	await get_cost(account, brianToken, "add to fam", async (brianToken) => {
		await brianToken.add_to_fam(account.address);
	});

	await get_cost(
		account,
		brianToken,
		"remove from fam",
		async (brianToken) => {
			await brianToken.remove_from_fam(account.address);
		}
	);

	await get_cost(
		account,
		brianToken,
		"getting tokens",
		async (brianToken) => {
			await brianToken.get_tokens(100000, { value: 1 });
		}
	);

	await get_cost(
		account,
		brianToken,
		"withdrawing tokens",
		async (brianToken) => {
			await brianToken.withdraw_tokens(100000);
		}
	);

	console.log("Deployed BrianCoin from address:", account.address);
	console.log("Contract located at:", brianToken.address);
}

async function get_cost(signer, brianToken, purpose, func) {
	const init_balance = await ethers.provider.getBalance(signer.address);
	const gas_price = await ethers.provider.getGasPrice();
	func(brianToken);
	const final_balance = await ethers.provider.getBalance(signer.address);
	console.log(
		"Estimated Cost of %s: %s",
		purpose,
		ethers.utils.formatEther(
			init_balance
				.sub(final_balance)
				.div(gas_price)
				.mul(ethers.utils.parseUnits("143", "gwei"))
		)
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
