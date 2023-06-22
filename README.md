# Bitcoin CLI

A bitcoin CLI written in nodejs, with the implementation of BIP39 wallets and BIP44 addresses from scratch.

# Usage

- Install all the dependencies: `npm i`
- Make an `.env` file and input your blockcypher token as shown in `.env.example`.
- Now you can run commands like: `node index.js <commands>`

## Commands

```bash
  create <name>             Create a new wallet by name
  generate <name> <count>   Generate new addresses for the given wallet name
  import <name> <mnemonic>  Import a wallet from menmonic(in double quotes) and assign the given name
  wallets                   List wallets from the stogare
  transactions <name>       List transactions of given wallet
  balance <name>            Get balance of a given wallet
  help [command]            display help for command
```
## Examples

### Creating a wallet

```bash
node index.js create alice
```

Creates a wallet with the name alice, outputs the menmonic and stores it in db.json.

### Importing wallet by menmonic

```bash
node index.js import bob "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
```

Creates a wallet with the name bob, this time generating extended master and public keys and storing it in db.json.

### Generating Addresses 

```bash
node index.js generate alice 10
```

This will generate 10 unused addresses for alice and also update the db.json with the addresses.

### Checking balance

```bash
node index.js balance alice
```

Prints the balance of alice, if a wallet by that name exists.
