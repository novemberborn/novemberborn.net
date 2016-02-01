import { table } from '../lib/router'

for (const pathname of Object.keys(table)) {
  console.log(`https://novemberborn.net${pathname}`)
}
