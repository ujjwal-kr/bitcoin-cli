import axios from 'axios';
const token = process.env.TOKEN;

export async function postWallet(name, wallet) {
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