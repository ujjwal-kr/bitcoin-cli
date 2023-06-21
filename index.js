import 'dotenv/config'
import { createWallet } from './modules/wallet.js'
import { listAllWallets } from './api/wallet.js'

async function main() {
   const wallets = await listAllWallets()
   console.log(wallets) 
}

main()