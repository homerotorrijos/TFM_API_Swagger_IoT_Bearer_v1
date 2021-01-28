'use strict'

const service = require('../services')

function isAuthNormal(req, res, next){                                                //para que pase a la ruta creda una vez autenticado el usuario 
    if(!req.headers.authorization){
        return res.status(403).send({ Mensaje: 'No tienes autorización' })
    }                                                                          
    const token = req.headers.authorization.split(" ")[1]                       //Convierte la cabecera en un array de tantos elementos como espacios existan, y se accede a la segunda posición, este es enviado por el cliente
    service.decodeTokenNormal(token, res)                                                  //funciones de callback
        .then(response => {                                                     //Si sea resulto correctamente
            req.user = response
            next()
        }) 
        .catch(response =>{
            res.status(response.status)
        })                                                                      // No sea resuelto correctamente o si exitio algun error
}
function isAuthAdmin(req, res, next){                                                //para que pase a la ruta creda una vez autenticado el usuario 
    if(!req.headers.authorization){
        return res.status(403).send({ Mensaje: 'No tienes autorización' })
    }

                                                                               
    const token = req.headers.authorization.split(" ")[1]                       //Convierte la cabecera en un array de tantos elementos como espacios existan, y se accede a la segunda posición, este es enviado por el cliente

    service.decodeTokenAdmin(token, res)                                                  //funciones de callback
        .then(response => {                                                     //Si sea resulto correctamente
            req.user = response
            next()
        }) 
        .catch(response =>{
            res.status(response.status)
        })                                                                      // No sea resuelto correctamente o si exitio algun error
}
function refreshToken(req, res, next){
    const {token} = req.body
    if(!token){
        return res.sendStatus(401)
    }
}

module.exports = {
    isAuthNormal,
    isAuthAdmin,
    refreshToken
}

// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjNlMjFjMmVlYjU0MDc3OGMyZTYzOWEiLCJyb2xlIjoiZ3Vlc3QiLCJpYXQiOjE1OTc5ODE1NTh9.J5WI82XkxbUDpuXOVT-dJsV46VFUNFzxEDXtWNfzdPU