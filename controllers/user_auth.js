'use strict'

const User = require('../models/users')
const RefreshTokenValue = require('../models/token')


const Service = require('../services/index')
const db = require('../config')
const bcrypt = require('bcrypt-nodejs')

function getUsers (req, res){
    User.find({}, (err, users) =>{
        if(err) return res.status(500).send({mensaje: `Error al hacer petición: ${err}`})
        if(!users) return res.status(404).send({mensaje: 'No existen el recurso'})

        res.send(200, { users})
    })
}
function singUp (req, res){
    const user = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        role: req.body.role        
    })
    user.save((err) => {
        if(err){
            return res.status(500).send({mensaje: `Error al crear el usuario: ${err}`})
        }
        
        return res.status(201).send({user})                                                                           //return res.status(201).send({token: Service.createToken(user)})
        
    })
}
function getUser (req, res)
{   
    let userId = req.params.userId

    User.findById(userId, (err, user) =>{
        if(err) return res.status(500).send({message: `Error al hacer petición: ${err}`})
        if(!user) return res.status(404).send({message: `El usuario no existe: ${user}`})

        res.status(200).send({user}) // 
    })
}
function login (req, res, next){ 
    
    User.findOne({email: req.body.email }, (err, user) =>{  // Busca el usuario
        if(err) return res.status(500).send({Mensaje: err}) // Si existe un error lo devuelve y depues comprueba si existe el usuario
        if(!user) {
            return res.status(404).send({
                Mensaje: 'No existe el usuario',
                Usuario: '0'
            }) 
            //Comprube  que exista el usuario
        }
        if(user.stateAccount != false){

            console.log(user.stateAccount)

            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // var token = jwt.sign(user.toJSON(), config.secret)
                    // res.json({ success: true, token: "JWT " + token })


                    req.user = user

                    console.log(req.body.email)

                    const tokens = Service.createToken(user)

                    const accesToken = tokens[0]
                    const refreshToken = tokens[1]

                    console.log(user._id)
                    console.log(refreshToken)

                    const refreshTokenCreado = new RefreshTokenValue({ 
                        id_user: user._id, 
                        refreshToken: refreshToken
                    })
                    

                    RefreshTokenValue.findOne({id_user: user._id}, (err, user) =>{
                        
                        if(!user){
                            //console.log('Es tú primer Incio de sesión')
        
                            refreshTokenCreado.save(function (err, tokenRefresh) {
                                if (err) return console.error(err);
                                console.log(tokenRefresh.refreshToken + "guardado el refreshToken")
                            }) 
                            res.status(200).send({
                                Mensaje: 'Incio de sesión exitoso',
                                accessToken: accesToken,
                                refreshToken: refreshToken
                            })
                        }else if(user){
                            // console.log('El usuario ya existe')
                            res.status(200).send({
                                Mensaje: 'Usuario esta acutualment logeado',
                                Conectado: "1"
                            })
                        }                         
                    })

                    /* const refreshTokenCreado = new RefreshTokenValue(
                    { 
                        id_user: user._id, 
                        refreshToken: refreshToken
                    })

                    refreshTokenCreado.save(function (err, tokenRefresh) {
                        if (err) return console.error(err);
                        console.log(tokenRefresh.refreshToken + "guardado el refreshToken")
                    }) */

                    


                    

                } else if(user.accessAttempts < 3){
                    console.log(user.accessAttempts)

                    user.accessAttempts = user.accessAttempts+1

                    user.updateOne({ accessAttempts: user.accessAttempts}, function(err, res) {
                        if (err) {
                          res.send(err)
                        } 
                      })

                    console.log(user.accessAttempts)
                    console.log(req.body)
                    res.status(401).send({
                    Mensaje: "Credenciales incorrectas",
                    Credencial: "0"
                    })
                }else if(user.accessAttempts === 3){
                    user.updateOne({ stateAccount: false}, function(err, res) {
                        if (err) {
                            res.send(err)
                        } res.status(403).send({
                            Mensaje: "Usuario bloqueado",
                        })

                    })
                }
            })
        }else{
            console.log('Usuario bloqueado')
            return res.status(403).send({
                Mensaje: 'Usuario bloqueado',
                Usuario: '3'
            }) 
        }

        
        //bcrypt.compareSync(pw, hash)
        //user && user.password === req.body.password

        //console.log('Esta es la constraña '+req.body.password)
        //console.log('Este es el HASH '+user.password)
        
        
        

        /* if (0){
            console.log('email y password son corectos')
            req.user = user
            res.status(200).send({
                message: 'Usuario logeado correctamente',
                token: Service.createToken(user)
            })
          } else {
            console.log("Credenciales incorrectas");
            res.json({data: "Credenciales incorrectas"});
          } */  
         //Usuario logeado correctamente

        
    })
}
function getrefreshTokens(req, res){
    console.log('Se obtienen los refreshTokens')
    RefreshTokenValue.find({}, (err, refreshTokenV) =>{
        if(err) return res.status(500).send({mensaje: `Error al hacer petición: ${err}`})
        if(!refreshTokenV) return res.status(404).send({mensaje: 'No existen el recurso'})

        res.send(200, {refreshTokenV})
    })
}
function deleterefreshToken(req, res)
{
    let refreshTokenId = req.params.refreshTokenId

    console.log(refreshTokenId)

    RefreshTokenValue.findByIdAndDelete(refreshTokenId, (err, refreshToken) =>{
        if(err) return res.status(500).send({mensaje: `Error al borrar el refreshToken: ${err}`})
        
        if(refreshToken === null)
            return res.status(500).send({mensaje: 'No existe el refreshToken'})
        return res.status(200).send({mensaje: 'El refreshToken ha sido eliminado'})

    })
}
function createnewTokenbyRefreshToken (req, res, next){
    
    console.log(req.body.refreshToken)

    RefreshTokenValue.findOne({refreshToken: req.body.refreshToken}, (err, tokenRefreshConsultado) =>{
        if(err) return res.status(500).send({Mensaje: err})
        if(!tokenRefreshConsultado){
            return res.status(404).send({
                Mensaje: 'refreshToken no encontrado',
                refreshToken: '0'
            }) 
        }
        else{
            User.findById(tokenRefreshConsultado.id_user, (err, user) =>{
                if(err) return res.status(500).send({message: `Error al hacer petición: ${err}`})
                if(!user) return res.status(404).send({message: `El usuario no existe: ${user}`})

                const tokens = Service.createToken(user)

                const accessToken = tokens[0]

                console.log(tokenRefreshConsultado.id_user)
     
                res.status(200).send({
                    Mensaje: 'Este es tu accessToken',
                    accessToken: accessToken,
                    refreshToken: '1'
                })
            })
            // console.log('El usuario ya existe')
        }
    })

    
}
function logout (req, res){

    RefreshTokenValue.findOneAndRemove({refreshToken: req.body.refreshToken}, (err, deleterefreshTokenUser) =>{
        if(err) return res.status(500).send({mensaje: `Error al borrar el refreshToken: ${err}`})
        console.log(deleterefreshTokenUser)

        if(deleterefreshTokenUser === null)
            return res.status(500).send({
                mensaje: 'No existe el refreshToken',
                refreshToken: '0'
            })
        return res.status(200).send({
            mensaje: 'El refreshToken ha sido eliminado',
            refreshToken: '1'
        })

    })

}

module.exports = {
    singUp,
    login,
    getUsers,
    getUser,
    getrefreshTokens,
    deleterefreshToken,
    createnewTokenbyRefreshToken,
    logout

}