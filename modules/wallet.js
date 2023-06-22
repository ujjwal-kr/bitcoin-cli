import { generateMnemonic as _generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { networks } from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { addAddresses, getTransactions, postWallet } from '../api/index.js';
import { readData, writeData } from "../modules/storage.js";

const bip32 = BIP32Factory(ecc)

function generateMnemonic() {
    return _generateMnemonic();
}

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
    const childNode = masterNode.derivePath(`m/44'/0'/0'/0/${index}`);
    return childNode.address;
}

function getLocalWallet(name) {
    let dbData = readData();
    for (let i in dbData) {
        if (dbData[i].name == name) {
            return dbData[i]
        }
    }
    console.error("Wallet not found by the name: ", name);
}

function updateLocalWallet(name, newWallet) {
    let dbData = readData();
    let found = false;
    for (let i in dbData) {
        if (dbData[i].name == name) {
            dbData.splice(i, 1);
            dbData.push(newWallet);
            found = true;
        }
    }
    if (found) {
        writeData(dbData)
    } else {
        console.error("Wallet not found by the name: ", name);
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
    const wallet = genKeysFromMnemonic(generateMnemonic());
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
    const wallets = JSON.parse(readData());
    return wallets;
}

export async function addAddressesToWallet(name, numAddresses) {
    let wallet = getLocalWallet(name);
    const addresses = [];
    const extendedPublicKey = wallet.extendedPublicKey;
    for (let i = 0; i < numAddresses; i++) {
        const address = deriveBIP44Address(extendedPublicKey, i + wallet.latestIndex);
        addresses.push(address);
    }
    wallet.addresses.push(...addresses);
    await addAddresses(name, addresses);
    updateLocalWallet(name, wallet);
}

export async function getTransactionsFromWallet(name) {
    const wallet = getLocalWallet(name);
    let transactions = [];
    for (let i in wallet.addresses) {
        const txs = await getTransactions(wallet.addresses[i]);
        transactions.push(txs);
    }
    return transactions;
}