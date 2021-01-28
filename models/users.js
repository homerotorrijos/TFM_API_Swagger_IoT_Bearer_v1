'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

let validateLocalStrategyProperty = function(property) {
	return (this.provider !== "local" && !this.updated) || property.length
}

let validateLocalStrategyPassword = function(password) {
	return this.provider !== "local" || (password && password.length >= 8)
}

const userSchema = new Schema ({
    email: {type: String, trim: true, select: true, unique: true, index: true, 
      lowercase: true, "default": "", validate: [validateLocalStrategyProperty, 
      "Ingresa tu email"], match: [/.+\@.+\..+/, "Ingresa un email valido"]},                               //unique:true (Correos que no se repitan)
    name: {type: String, unique: true, select: true, index: true, lowercase: true, 
      required: "Completa tu nombre de usuario", 
      trim: true, match: [/^[\w][\w\-\._\@]*[\w]$/, "Ingresa un nombre de usuario valido"]},
    password: {type: String, "default": "", 
      validate: [validateLocalStrategyPassword, "La contraseña debe ser más grande"]},                   //select: false (Para que no devuelva la contraseña) y evitamos problemas de seguridad
    singupDate: { type: Date, default: Date.now()}, 
    lastLogin: Date,
    role: {type: String, enum: ['admin','user', 'guest']},
    stateAccount: {type: Boolean, default: false},                                                        //Bloqueado 0 , Activado 1
    accessAttempts: {type: Number, default: 0},                                                           //Bloqueado    //Número de intentos
})

userSchema.pre("save", function(next) 
{
    var user = this
  
    if (!this.isModified("password")) 
    {
      return next()
    }
    return bcrypt.genSalt(10, function(err, salt) 
    {
      if (err) {
          return next(err)
        }
  
        return bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) {
          return next(err)
        }
        user.password = hash
        return next()
      })
    })
})


//funciones que se ejecuten antes que se introduzca la contraseña
/* userSchema.pre('save', function(next) { //Para que siga la función y no se detenga
    let user = this
    
    //if(!user.isModified('password')) return next()

    bcrypt.genSalt(10, (err, salt) =>{
        if(err) return next(err)

        bcrypt.hash(userSchema.password, salt, null, (err, hash) => { //encripta la contraseña
            if(err) return next(err)
            user.password = hash //Hash creado, sin la contraseña
            console.log(hash)
            next()
        }) 
    })
}) */

userSchema.methods.comparePassword = function(pwd, cb) {
    bcrypt.compare(pwd, this.password, function(err, isMatch) {
      if (err) {
        return cb(err)
      }
      cb(null, isMatch)
    })
  }

userSchema.methods.gravatar = function (){
    if(!this.email) return 'https://gravatar.com/avatar/?s=200&d=retro' // Si no esta registrado devuelve un avatar

    const md5 = crypto.createHash('md5').update(this.email).digest('hex')  //Crear un HASH MD5 para crear el avatar, del correo electronico y lo devuelve en formato Hexadecimal
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`

}

module.exports = mongoose.model('User', userSchema)  //User: nombre del esquema

//Aplicación escalable (separación del Backend y fronted), autenticación basada en Tokens 
//El usuario o cliente envia un código al servidor y el servidor descifrarlo y ver que usuario, y el acceso que tiene a determinados recursos del servidor// no guarda sesiones en el servidor y hace el servidor más ligero
//mientras la logica cae del lado del cliente 

//JWT = Json Web Token se almacena en el "local stored" del cliente o "session stored",
// y este viajara en las cabeceras del Header
//Header: algoritmo = HS256, type ="JWT"
//Payload: Los datos del cuerpo = "sub" --> id del usuario en el servidor (sub público) y el (_id privado mongodb), se puede agregar la fecha de caducidad del Token
//Verify Signature: verifica que sea un Token valido en el servidor y genera un nuevo número, comprueba que Token no ha sddo modificado





