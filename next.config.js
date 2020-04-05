const withOffline = require('next-offline')
const nextEnv = require('next-env')
const dotenvLoad = require('dotenv-load')

dotenvLoad()
const withNextEnv = nextEnv({})

module.exports = withNextEnv(withOffline({}))
