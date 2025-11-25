## Simple contract CLI interactions

A minimal Node.js command-line app  to interact with the `SimpleStorage` contract. The contract is already deployed in sepolia test net.

#### What does the `SimpleStorage` contract do?

- Deploys with an `owner` account that can manage the state.
- Stores the value sent in `storedValue`
- Allows anyone to **read** the value using `getValue()`.
- Allows only the owner to **update** the value with `setValue(uint256 newValue)`.
- Allows the owner to **reset** the value to zero via `resetValue()`.
- Emits a `ValueUpdated(uint256 newValue)` event whenever the value is changed.
- Prevents non-owners from modifying the value (using `onlyOwner` modifier).

### CLI Commands

- `npm start -- status` – show network, contract address, stored value, owner  
- `npm start -- read` – read the stored value  
- `npm start -- write <value>` – write a new value (requires funded wallet)  
- `npm start -- reset` – call `resetValue()` (only works if your contract implements it and the signer is owner)  
- `npm run start:help` – view all options

All write actions require your wallet to have Sepolia ETH for gas.

### Testing Locally

Without configuring `.env`, you can still run:

```bash
npm run start:help /or/ npm start -- help
```

Once `.env` is configured and the contract exists, try:

```bash
npm run start:status /or/ npm start -- status
```