'use strict'

const mongoose = require('mongoose')
const fs = require('fs')
const https = require('https')
const http = require ('http')
const app = require('./app')
const config = require('./config')

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},  (err, res) =>{
    if (err) 
        return console.log(`Error al conectar a la BD: ${err}`)
    console.log ('Conexión exitosa a la BD...')
    
    //console.log(config.PORT_HTTPS, config.PORT_HTTP)

    const serverHTTPS = https.createServer(
        {   
            key: fs.readFileSync('private.key'),
            cert: fs.readFileSync('private.csr'),
            passphrase: 'key_api'
        },app).listen(config.PORT_HTTPS, ()=>{ // function
                console.log(`API REST corriendo en https://localhost:${config.PORT_HTTPS}`)
    })

    const serverHTTP =http.createServer(
        app).listen(config.PORT_HTTP, ()=>{ // function
        console.log(`API REST corriendo en http://localhost:${config.PORT_HTTP}`)
    })

})
 

/**
 * 
 * https.createServer({
        key: fs.readFileSync('private.key'),
        cert: fs.readFileSync('private.csr'),
        passphrase: 'key_api'
        },
 * 
 * 
 */