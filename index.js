import 'dotenv/config'
import { createWallet } from './modules/wallet.js'
import { listAllWallets } from './api/wallet.js'
import { createFile } from './modules/storage.js'

async function main() {
   createFile()
}

main()