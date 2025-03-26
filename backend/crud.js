const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

// Connect to the local Ethereum node (Ganache)
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

// Read and compile Solidity contract
const sourceCode = fs.readFileSync('./contracts/Cruds.sol', 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Cruds.sol': { content: sourceCode }
  },
  settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
};

const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

// Extract ABI and Bytecode
const contractName = Object.keys(compiledCode.contracts['Cruds.sol'])[0];
const contractABI = compiledCode.contracts['Cruds.sol'][contractName].abi;
const bytecode = compiledCode.contracts['Cruds.sol'][contractName].evm.bytecode.object;

const deployContract = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Deploying from account:", accounts[0]);

  const contract = new web3.eth.Contract(contractABI);
  const deployedContract = await contract.deploy({ data: bytecode })
    .send({ from: accounts[0], gas: 4700000 });

  console.log("Contract deployed at:", deployedContract.options.address);
};

deployContract().catch(console.error);
