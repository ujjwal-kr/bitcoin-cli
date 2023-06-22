import { networks, payments } from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { getTransactions, postWallet } from '../api/index.js';
import { readData, writeData } from "../modules/storage.js";
import getBalance from '../api/getBalance.js';
const bip32 = BIP32Factory(ecc)
import { generateMnemonic, mnemonicToSeedSync } from "./mnemonic.js";

function deriveSeed(mnemonic) {
    return mnemonicToSeedSync(mnemonic);
}

function deriveMasterExtendedKey(seed) {
    const network = networks.bitcoin;
    const root = bip32.fromSeed(seed, network);
    return root.toBase58();
}

function deriveExtendedPublicKey(masterExtendedKey) {
    const masterNode = bip32.fromBase58(masterExtendedKey);
    return masterNode.neutered().toBase58();
}


function deriveBIP44Address(extendedPublicKey, index) {
    const masterNode = bip32.fromBase58(extendedPublicKey);
    const network = networks.testnet;
    const childNode = masterNode.derivePath(`m/44/0/0/0/${index}`);
    const { address } = payments.p2pkh({ pubkey: childNode.publicKey, network });
    return address;
}

function getLocalWallet(name) {
    let dbData = readData();
    for (let i in dbData) {
        if (dbData[i].name == name) {
            return dbData[i]
        }
    }
    throw Error('Wallet not found by name ' + name);
}

function updateLocalWallet(name, newWallet) {
    let dbData = readData();
    let found = false;
    for (let i in dbData) {
        if (dbData[i].name == name) {
            dbData.splice(i, 1, newWallet); 
            found = true;
            break;
        }
    }
    if (found) {
        writeData(dbData);
    } else {
        throw new Error("Wallet not found by name: " + name);
    }
}

function genKeysFromMnemonic(mnemonic) {
    const seed = deriveSeed(mnemonic)
    const masterExtendedKey = deriveMasterExtendedKey(seed);
    const extendedPublicKey = deriveExtendedPublicKey(masterExtendedKey);
    const wallet = {
        latestIndex: 0,
        mnemonic,
        masterExtendedKey,
        extendedPublicKey
    }
    return wallet;
}

export async function createWallet(name) {
    const mnemonic = generateMnemonic();
    console.log("This is your mnemonic. Save it in a safe place to retrieve the wallet later:\n", mnemonic);
    const wallet = genKeysFromMnemonic(mnemonic);
    const bCWallet = await postWallet(name, wallet);
    let dbData = readData()
    dbData.push(bCWallet)
    writeData(dbData)
}

export async function importWalletFromMnemonic(name, mnemonic) {
    const wallet = genKeysFromMnemonic(mnemonic)
    const bCWallet = await postWallet(name, wallet);
    let dbData = readData();
    dbData.push(bCWallet);
    writeData(dbData);
}

export function listLocalWallets() {
    const wallets = readData();
    if (wallets.length == 0) {
        throw Error("No wallets found in storage")
    } else {
        return wallets;
    }
}

export function addAddressesToWallet(name, numAddresses) {
    let wallet = getLocalWallet(name);
    const addresses = [];
    const extendedPublicKey = wallet.extended_public_key;
    if (numAddresses <= 0) throw Error("Number of addresses cannot be negative or 0");
    for (let i = 0 + wallet.latestIndex; i < numAddresses + wallet.latestIndex; i++) {
        const address = deriveBIP44Address(extendedPublicKey, i);
        addresses.push(address);
    }
    wallet.latestIndex += numAddresses;
    wallet.addresses.push(...addresses);
    updateLocalWallet(name, wallet);
}

export async function getTransactionsFromWallet(name) {
    try {
        const wallet = getLocalWallet(name);
        let transactions = [];
        if (wallet.addresses.length < 1) throw Error('No address associated with wallet');
        for (let i in wallet.addresses) {
            const txs = await getTransactions(wallet.addresses[i]);
            transactions.push(txs);
        }
        return transactions;
    } catch (error) {
        throw Error(error.message)
    }
}

export async function getBalanceFromWallet(name) {
    const wallet = getLocalWallet(name);
    if (!wallet) throw Error()
    if (wallet.addresses.length < 1) throw Error("No addresses associated with wallet");
    const balance = await getBalance(wallet.addresses);
    return balance;
}