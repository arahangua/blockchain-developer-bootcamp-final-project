const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    local: {
      host: "localhost",
      port: 8545,
      network_id: "*" // match any network
    },
    test: {
      host: "localhost",
      port: 8545,
      network_id: "*" // match any network
    },
    ropsten:{
      timeoutBlocks: 200000,
      networkCheckTimeout: 10000, 
      provider: () => new HDWalletProvider(process.env.SEED_PHRASE, process.env.Ropsten_RPC_URL),
      network_id: 3,
      skipDryRun: true
    }

  },
  compilers: {
    solc: {
      version: "pragma",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};

