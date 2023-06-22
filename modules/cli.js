import { addAddressesToWallet, createWallet, getBalanceFromWallet, getTransactionsFromWallet, importWalletFromMnemonic, listLocalWallets } from "./wallet.js";
import { Command } from 'commander'

const program = new Command();

export function initializeCli() {
    program.version('1.0.0');

    program
        .command('create <name>')
        .description('Create a new wallet by name')
        .action(async (name) => {
            await createWallet(name)
        })

    program
        .command('generate <name> <count>')
        .description('Generate new addresses for the given wallet name')
        .action(async (name, count) => {
            await addAddressesToWallet(name, +count)
        })

    program
        .command('import <name> <mnemonic>')
        .description('Import a wallet from menmonic(in double quotes) and assign the given name')
        .action(async (name, mnemonic) => {
            await importWalletFromMnemonic(name, mnemonic);
            console("Wallet imported");
        })

    program
        .command('wallets')
        .description('List wallets from the stogare')
        .action(() => {
            try {
                let wallets = listLocalWallets()
                console.log(wallets);
            } catch (error) {
                console.log(error.message);
            }
        })

    program
        .command('transactions <name>')
        .description('List transactions of given wallet')
        .action(async (name) => {
            try {
                const txs = await getTransactionsFromWallet(name);
                console.log(txs)
            } catch (error) {
                console.log(error.message)
            }
        })

    program
        .command('balance <name>')
        .description('Get balance of a given wallet')
        .action(async (name) => {
            try {
                const balance = await getBalanceFromWallet(name);
                console.log(balance)
            } catch (error) {
                console.log(error.message)
            }
        })

    program.parse()
}