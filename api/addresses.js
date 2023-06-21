import axios from 'axios';
const token = process.env.TOKEN;

export async function addAddresses(name, addrs) {
    const data = JSON.stringify({"addresses":addrs});
    const url = `https://api.blockcypher.com/v1/btc/main/wallets/${name}/addresses?token=${token}`;
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error("Error in adding addresses to wallet: ", error.response.data)
    }
}

export async function getTransactions(addr) {
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${addr}/full`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error in retrieving transactions: ", error.response.data)
    }
}