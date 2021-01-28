'use strict'

const jwt = require('jwt-simple')
const jsonjwt = require('jsonwebtoken')
const moment = require('moment')
const config = require('../config')
const refresToken = require('../models/token')

function createToken(user, res){ //El ID de MOngoDB adherido usuario
    const payload = {
        sub: user._id,
        role: user.role,
        iat: moment().unix(), //cuando fue creado el token
        exp: moment().add(7, 'hours').unix(), // cuando expira el token
    }

  console.log(config.PRIVATE_RSA_KEY)

   const accesToken = jwt.encode(payload, config.KEY_TOKEN, 'HS256')  //HS512 , HMAC  || 'RS256' >> Asimeric Key

   const refreshToken = jwt.encode({sub: user._id, role: user.role, iat: moment().unix()}, config.REFRESH_KEY_TOKEN, 'HS256')
   

   const accesToken_private_key = jsonjwt.sign(payload, config.PRIVATE_RSA_KEY, { algorithm: 'RS256'})  //HS512 , HMAC  || 'RS256' >> Asimeric Key

   const refreshToken_private_key = jsonjwt.sign({sub: user._id, role: user.role, iat: moment().unix()}, config.PRIVATE_RSA_KEY,  { algorithm: 'RS256'})


   config.REFRESH_TOKENS.push(refreshToken_private_key)

   console.log(config.REFRESH_TOKENS)


   return [accesToken_private_key, refreshToken_private_key]
}

function decodeTokenAdmin(token, res){
    const decoded = new Promise((resolve, reject) =>{                           
        try
        {                                                                    // si se resulve la promesa tendrá el token decodificado
            const payload = jwt.decode(token, config.KEY_TOKEN)
            const payload_rsa = jsonjwt.verify(token, config.PUBLIC_RSA_KEY) 

            console.log(payload.role)
            console.log(payload_rsa.role)

            if(payload.exp <= moment().unix())
            {
                reject({
                    status: 401,
                    messsage: 'El Token a expirdado'
                })
                res.status(401).send({
                    Mensaje: "El Token a expirdado"
                })
            }else if(payload.role === 'admin'){
                resolve(payload.sub)
            }else if(payload.role === 'guest' || payload.role === 'user'){
                reject({
                    status: 401,
                    messsage: 'Eres un invitado no tienes acceso'
                })
                res.status(401).send({
                    Mensaje: "Eres un invitado no tienes acceso"
                })
            }
        }
        catch(err){                                                             //Si existe un error en el token 
            reject({
                status: 500,
                messsage: 'Token invalido'
            })
            res.status(500).send({
                Mensaje: "Token invalido"
            })
        }
    })
    return decoded
}

function decodeTokenNormal(token, res){
    const decoded = new Promise((resolve, reject) =>{                           //Toma el Token decodificado
        try
        {                                                                    // si se resulve la promesa tendrá el token decodificado
            const payload = jwt.decode(token, config.KEY_TOKEN)
            const payload_rsa = jsonjwt.verify(token, config.PUBLIC_RSA_KEY)
            
            console.log(payload.role)
            console.log(payload_rsa.role)

            if(payload.exp <= moment().unix())
            {
                reject({
                    status: 401,
                    messsage: 'El Token a expirdado'
                })
                res.status(401).send({
                    Mensaje: "El Token a expirdado"
                })
            }else if(payload.role === 'admin' || payload.role === 'user' || payload.role === 'guest'){
                resolve(payload.sub)
            }else{
                reject({
                    status: 401,
                    messsage: 'No pudes ser identificado'
                })
                res.status(401).send({
                    Mensaje: "Eres un Guest no tienes acceso a estos recursos"
                })

            }

            
        }
        catch(err){                                                             //Si existe un error en el token 
            reject({
                status: 500,
                messsage: 'Token invalido'
            })
            res.status(500).send({
                Mensaje: "Token invalido"
            })
        }
    })
    return decoded
}



module.exports = {
    createToken,
    decodeTokenAdmin,
    decodeTokenNormal
}