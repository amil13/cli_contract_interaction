'use strict';

const { Command } = require('commander');
const pkg = require('../package.json');
const client = require('./lib/contractClient');

const program = new Command();

program
  .name('storage-cli')
  .description('Interact with the SimpleStorage contract on Sepolia')
  .version(pkg.version);

function handle(commandFn) {
  return async (...args) => {
    try {
      await commandFn(...args);
    } catch (error) {
      const message = error?.message || error;
      console.error('✖ Error:', message);
      if (process.env.DEBUG) {
        console.error(error);
      }
      process.exitCode = 1;
    }
  };
}

program
  .command('status')
  .description('Show contract address, chain, stored value, and owner')
  .action(
    handle(async () => {
      const status = await client.getStatus();
      console.log('Network:', status.networkName, `(chainId: ${status.chainId})`);
      console.log('Contract:', status.contractAddress);
      console.log('Stored value:', status.value);
      console.log('Owner:', status.owner);
    }),
  );

program
  .command('read')
  .description('Read the stored value')
  .action(
    handle(async () => {
      const value = await client.readValue();
      console.log('Stored value:', value);
    }),
  );

program
  .command('write <value>')
  .description('Write a new value (requires PRIVATE_KEY funding)')
  .action(
    handle(async (value) => {
      const receipt = await client.writeValue(value);
      console.log('Transaction sent:', receipt.txHash);
      console.log('Included in block:', receipt.blockNumber);
      console.log('Gas used:', receipt.gasUsed);
    }),
  );

program
  .command('reset')
  .description('Owner-only resetValue call')
  .action(
    handle(async () => {
      const receipt = await client.resetValue();
      console.log('Reset transaction:', receipt.txHash);
      console.log('Included in block:', receipt.blockNumber);
    }),
  );

program.parseAsync(process.argv);

