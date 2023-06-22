import { randomBytes, scryptSync, createHash } from 'crypto';
import { readFileSync } from "fs"; 

export function generateMnemonic() {
  const wordlist = readFileSync('english.txt', 'utf8').trim().split('\n');
  const entropy = randomBytes(16);
  const entropyArray = Array.from(entropy);
  const checksum = createHash('sha256').update(entropy).digest()[0];
  const combined = [...entropyArray, checksum];
  const binaryString = combined.map(byte => byte.toString(2).padStart(8, '0')).join('');
  const groups = [];
  for (let i = 0; i < binaryString.length; i += 11) {
    groups.push(binaryString.slice(i, i + 11));
  }
  const mnemonic = groups.map(group => {
    const index = parseInt(group, 2);
    return wordlist[index];
  }).join(' ');
  return mnemonic;
}

export function mnemonicToSeedSync(mnemonic) {
  const passphrase = '';
  const salt = 'mnemonic' + passphrase;
  const mnemonicBuffer = Buffer.from(mnemonic, 'hex');
  const saltBuffer = Buffer.from(salt, 'utf8');
  const derivedKey = scryptSync(mnemonicBuffer, saltBuffer, 64);
  return derivedKey;
}

