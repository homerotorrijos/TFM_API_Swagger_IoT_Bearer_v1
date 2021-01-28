'use strict'

const express = require('express')
const SensorCtrl = require('../controllers/sensor')
const UserCtrl = require('../controllers/user_auth')
const auth = require('../middlewares/auth')
const api = express.Router() // genera la ruta api en el navegador

const passDigest = require('../middlewares/authDigest')



// Apartado Usuario
api.get('/v1/users', auth.isAuthAdmin, UserCtrl.getUsers)                                                    //auth.isAuthAdmin,
api.get('/v1/user/:userId',auth.isAuthAdmin, UserCtrl.getUser)                                                   // 
api.post('/v1/signup', UserCtrl.singUp)                                                             //Crear usuario
api.post('/v1/login', UserCtrl.login)                                                               //Iniciar sesión
api.delete('/v1/logout', UserCtrl.logout)

//Crea un nuevo acessToken
api.get('/v1/refreshTokens', UserCtrl.getrefreshTokens)                                             // auth.isAuthAdmin
api.delete('/v1/refreshTokens/:refreshTokenId', auth.isAuthAdmin, UserCtrl.deleterefreshToken)      //auth.isAuthAdmin
api.post('/v1/token', UserCtrl.createnewTokenbyRefreshToken)


// Apartado Sensor
api.get('/v1/sensortag', auth.isAuthAdmin, SensorCtrl.getSensors)                                                 // auth.isAuthAdmin,
api.get('/v1/sensortag/:sensortagId', auth.isAuthNormal, SensorCtrl.getSensor)
api.post('/v1/sensortag', auth.isAuthAdmin,  SensorCtrl.saveSensor)                              //auth.isAuthAdmin,        //Guardar sensor
api.put('/v1/sensortag/:sensortagId', auth.isAuthNormal, SensorCtrl.updateSensor)                // auth.isAuthNormal       // actualizar sensor
api.delete('/v1/sensortag/:sensortagId', auth.isAuthAdmin, SensorCtrl.deleteSensor)             //auth.isAuthAdmin     // Eliminamos sensor


api.get('/v1/private', auth.isAuthAdmin, (req, res) =>{
    return res.status(200).send({message: 'Tienes acceso'})
})

module.exports = api