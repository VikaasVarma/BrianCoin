require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
	solidity: "0.8.4",
	networks: {
		localhost: {
			url: process.env.GANACHE_URL,
			accounts: process.env.TEST_PRIVATE_KEYS.split(","),
		},
		mainnet: {
			url: process.env.MAINNET_URL,
			accounts: [process.env.MY_PRIVATE_KEY],
		},
		rinkeby: {
			url: process.env.RINKEBY_URL,
			accounts: [process.env.TEST_PRIVATE_KEY],
		},
	},
};
