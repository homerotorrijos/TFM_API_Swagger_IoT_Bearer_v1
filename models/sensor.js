'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const today = new Date()
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

//today = mm + '/' + dd + '/' + yyyy

const res = mm.concat('/',dd,'/', yyyy)

const SensorTagSchema = Schema ({
    id_user: {type: String, unique: true, select: true, index: true, trim: true},
    sensorTag: String,
    valor:{type: Number, default: 0},
    sensor: {type: String, enum: ['tem','hum','lum','pre']},
    fecha: Date
})

module.exports = mongoose.model('Sensor', SensorTagSchema)