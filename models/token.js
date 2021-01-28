'use-strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const refreshTokenSchema = new Schema ({
    id_user: {type: String, unique: true, select: true, index: true, trim: true},
    refreshToken: {type: String, unique: true, select: true, index: true, trim: true}
})

module.exports = mongoose.model('refreshToken', refreshTokenSchema)


