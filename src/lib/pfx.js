import { readFileSync } from 'fs'

import { CERT_NAME, NODE_ENV } from './env'
import certs from 'files:../../certs/*.p12'

export default readFileSync(certs[`${CERT_NAME || NODE_ENV}.p12`].src)
