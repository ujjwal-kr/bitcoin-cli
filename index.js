import 'dotenv/config'
import { createFile } from './modules/storage.js'
import { initializeCli } from './modules/cli.js';

createFile()
initializeCli()