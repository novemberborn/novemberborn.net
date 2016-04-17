import { readFileSync } from 'fs'

import certs from 'files:../../certs/*.p12'
import { CERT_NAME, NODE_ENV } from './env'

export default readFileSync(certs[`${CERT_NAME || NODE_ENV}.p12`].src)
