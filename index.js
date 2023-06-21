import 'dotenv/config'
import { createWallet } from './modules/wallet.js'

async function main() {
    const wallet =  await createWallet("bruhh")
    console.log(wallet)
}

main()