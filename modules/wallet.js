import { generateMnemonic as _generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { networks } from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { postWalletToBlockCypher } from '../api/index.js';

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

export async function createWallet(name) {
    const mnemonic = generateMnemonic();
    const seed = deriveSeed(mnemonic)
    const masterExtendedKey = deriveMasterExtendedKey(seed);
    const extendedPublicKey = deriveExtendedPublicKey(masterExtendedKey);
    const wallet = await postWalletToBlockCypher(name, {
        mnemonic,
        masterExtendedKey,
        extendedPublicKey,
    });
    return wallet;
}