import axios from 'axios';

export async function getTransactions(addr) {
    const url = `https://api.blockcypher.com/v1/btc/test3/addrs/${addr}/full`;
    try {
        const response = await axios.get(url);
        return response.data.txs;
    } catch (error) {
        console.error("Error in retrieving transactions: ", error.response.data)
    }
}