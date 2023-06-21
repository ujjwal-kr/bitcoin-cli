import { generateMnemonic as _generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { networks } from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { postWallet } from '../api/index.js';
import { readData, writeData } from "../modules/storage.js";
// TODO: next thing to work on is the address creation while making a wallet

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

export function genKeysFromMnemonic(mnemonic) {
    const seed = deriveSeed(mnemonic)
    const masterExtendedKey = deriveMasterExtendedKey(seed);
    const extendedPublicKey = deriveExtendedPublicKey(masterExtendedKey);
    const wallet = {
        mnemonic,
        masterExtendedKey,
        extendedPublicKey
    }
    return wallet;
}

export async function createWallet(name) {
    const wallet = genKeysFromMnemonic(generateMnemonic());
    const bCWallet = await postWallet(name, wallet);
    dbData = readData()
    dbData.push(bCWallet)
    writeData(dbData)
}

export async function importWalletFromMnemonic(name, mnemonic) {
    const wallet = genKeysFromMnemonic(mnemonic)
    const bCWallet = await postWallet(name, wallet);
    dbData = readData();
    dbData.push(bCWallet);
    writeData(dbData);
}

export function listLocalWallets() {
    const wallets = JSON.parse(readData());
    return wallets;
}