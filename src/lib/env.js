import dotenv from 'dotenv'
dotenv.config({ silent: true })

const {
  BUNYAN_LEVEL,
  PFX_BASE64
} = process.env

export {
  BUNYAN_LEVEL,
  PFX_BASE64
}
