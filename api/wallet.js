import axios from 'axios';
const token = process.env.TOKEN;

export async function postWalletToBlockCypher(name, wallet) {
    const url = `https://api.blockcypher.com/v1/btc/test3/wallets/hd?token=${token}`;
    const data = {
        name: name,
        extended_public_key: wallet.extendedPublicKey,
        mnemonic: wallet.mnemonic,
    };
    try {
        const response = await axios.post(url, data);
        response.data.mnemonic = wallet.mnemonic
        return response.data;
    } catch (error) {
        console.error('Error importing wallet:', error.response.data);
    }
}

export async function listAllWallets() {
    const url = `https://api.blockcypher.com/v1/btc/test3/wallets?token=${token}`;
    try {
        const response = await axios.get(url);
        return response.data.wallet_names;
    } catch (error) {
        console.error('Error fetching balance: ', error.response.data)
    }
}

export async function addAddressesToBlockCypher(name, addrs) {
    const data = JSON.stringify({"addresses":addrs});
    const url = `https://api.blockcypher.com/v1/btc/main/wallets/${name}/addresses?token=${token}`;
    try {
        const response = await axios.post(url, data);
    } catch (error) {
        console.error("Error in adding addresses to wallet: ", error.response.data)
    }
}