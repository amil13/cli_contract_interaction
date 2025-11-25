'use strict';

const { ethers } = require('ethers');
const config = require('../config');

const CONTRACT_ABI = [
  'function getValue() view returns (uint256)',
  'function setValue(uint256 newValue)',
  'function resetValue()',
  'function owner() view returns (address)',
];

function ensure(value, message) {
  if (!value) {
    throw new Error(message);
  }
  return value;
}

function createProvider() {
  ensure(config.rpcUrl, 'Missing SEPOLIA_RPC_URL in your environment file.');
  return new ethers.JsonRpcProvider(config.rpcUrl);
}

function createWallet(provider) {
  ensure(
    config.privateKey,
    'Missing PRIVATE_KEY in your environment file. Export from MetaMask.',
  );
  return new ethers.Wallet(config.privateKey, provider);
}

function connectContract(providerOrSigner) {
  ensure(
    config.contractAddress,
    'Missing CONTRACT_ADDRESS. Deploy via Remix and paste the address into .env.',
  );
  return new ethers.Contract(
    config.contractAddress,
    CONTRACT_ABI,
    providerOrSigner,
  );
}

async function getStatus() {
  const provider = createProvider();
  const contract = connectContract(provider);
  const [network, value, owner] = await Promise.all([
    provider.getNetwork(),
    contract.getValue(),
    contract.owner(),
  ]);

  return {
    chainId: Number(network.chainId),
    networkName: network.name,
    contractAddress: contract.target,
    value: value.toString(),
    owner,
  };
}

async function readValue() {
  const provider = createProvider();
  const contract = connectContract(provider);
  const value = await contract.getValue();
  return value.toString();
}

async function writeValue(newValue) {
  const provider = createProvider();
  const wallet = createWallet(provider);
  const contract = connectContract(wallet);

  if (newValue === undefined || newValue === null) {
    throw new Error('You must pass a numeric value to write.');
  }

  const parsedValue = ethers.toBigInt(newValue);
  const tx = await contract.setValue(parsedValue);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed?.toString() ?? 'unknown',
  };
}

async function resetValue() {
  const provider = createProvider();
  const wallet = createWallet(provider);
  const contract = connectContract(wallet);

  const tx = await contract.resetValue();
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
}

module.exports = {
  getStatus,
  readValue,
  writeValue,
  resetValue,
};

