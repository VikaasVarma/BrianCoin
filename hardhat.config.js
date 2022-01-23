require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
	solidity: "0.8.4",
	networks: {
		localhost: {
			url: process.env.GANACHE_URL,
			accounts: process.env.TEST_PRIVATE_KEYS.split(","),
		},
	},
};
