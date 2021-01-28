'use-strict'
const fs = require('fs')
const path = require('path')

const PRI_RSA_KEY = path.join(__dirname, './asymetric/key.pub')
const PUB_RSA_KEY = path.join(__dirname, './asymetric/key.pem')

//console.log(PRI_RSA_KEY)

module.exports = {
    PORT_HTTPS: process.env.PORT || 3005,
    PORT_HTTP: process.env.PORT || 3006,
    db: process.env.MONGODB || 'mongodb://localhost:27017/api-rest-iot',
    //Configuración HMAC
    KEY_TOKEN: 'miC',  // 'miCl@vEToK#9'
    REFRESH_KEY_TOKEN: 'miCro',
    REFRESH_TOKENS: [],
    //Configuración Asimetrica
    PRIVATE_RSA_KEY: fs.readFileSync(PRI_RSA_KEY, 'utf-8'),
    PUBLIC_RSA_KEY: fs.readFileSync(PUB_RSA_KEY, 'utf-8')

}
