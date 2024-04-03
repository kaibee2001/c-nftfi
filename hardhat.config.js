require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

module.exports = {
  defaultNetwork: "ati",
  networks: {
    hardhat: {
      chainId: 1337
    },
    ati: {
      url: "http://103.252.1.159:8545/",
      accounts: ["8a2accb2f80998264a3589749d76b8b8cddeb966d406ee56b5c818faa023bbe5"],
      chainId: 9000
    }
    /*
    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      url: "https://rpc-mumbai.matic.today",
      accounts: [process.env.privateKey]
    },
    matic: {
      // Infura
      // url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [process.env.privateKey]
    }
    */
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

