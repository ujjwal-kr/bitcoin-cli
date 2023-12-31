import axios from "axios";

export default async function getBalance(addrs) {
    let balance = 0;
    const baseUrl = "https://api.blockcypher.com/v1/btc/test3/addrs";
    for (let i in addrs) {
        const addressUrl = `${baseUrl}/${addrs[i]}/balance`;
        try {
            const addressBalance = (await axios.get(addressUrl)).data.balance;
            balance += addressBalance;
        } catch (error) {
            console.error("Error in getting the balance: ", error.response.data);
            break;
        }
    }
    return balance;
}