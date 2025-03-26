const fs = require("fs");
const Web3 = require("web3");

// Load contract ABI and bytecode
const abi = JSON.parse(fs.readFileSync("./contracts/Cruds.abi", "utf8"));
const bytecode = fs.readFileSync("./contracts/Cruds.bin", "utf8");

// Connect to Ethereum network (Ganache)
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

async function deploy() {
    try {
        // Get available accounts
        const accounts = await web3.eth.getAccounts();
        console.log("Deploying from account:", accounts[0]);

        // Create contract instance
        const contract = new web3.eth.Contract(abi);

        // Deploy contract
        const deployedContract = await contract.deploy({ data: bytecode }).send({
            from: accounts[0],
            gas: "6721975",
        });

        console.log("✅ Contract deployed at:", deployedContract.options.address);
    } catch (error) {
        console.error("❌ Deployment failed:", error);
    }
}

// Run deployment function
deploy();
