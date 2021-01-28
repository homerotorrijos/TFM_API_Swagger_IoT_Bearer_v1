'use-strict'

const Sensor = require('../models/sensor')

function getSensor (req, res){
    let sensortagId = req.params.sensortagId

    Sensor.findById(sensortagId, (err, sensorTag) =>{
        if(err) return res.status(500).send({message: `Error al hacer petición: ${err}`})
        if(!sensorTag) return res.status(404).send({message: `El sensorTag no existe: ${sensorTag}`})

        res.status(200).send({sensorTag}) // sensorTag: sensorTag
    })
}

function getSensors(req, res){
    Sensor.find({}, (err, sensortags) =>{
        if(err) return res.status(500).send({message: `Error al hacer petición: ${err}`})
        if(!sensortags) return res.status(404).send({message: 'Los sensorTags no existen:'})

        res.send(200, { sensortags})
    })
}

function saveSensor(req, res){
    //res.status(200).send(200, { message: 'Datos agregados'})

    console.log('POST /api/v1/sensortag')
    console.log(req.body)

    let data_sensor = new Sensor()

    data_sensor.ensorTag = req.body.sensorTag   
    data_sensor.valor = req.body.valor
    data_sensor.sensor = req.body.sensor
    data_sensor.fecha = req.body.fecha

    data_sensor.save((err, sensorStorage) =>{
        if(err) res.status(500).send({message: `Error al guardar en el servidor: ${err}`}) //Error del servidor
        res.status(200).send({data_sensor: sensorStorage})
    })
}

function updateSensor(req, res){
    let sensortagId = req.params.sensortagId
    let update = req.body

    Sensor.findByIdAndUpdate(req.params.sensortagId, req.body, {new: true},  (err, sensorTag_update) =>{
        if (err) return res.status(500).send({mensaje: `Error al actualizar el sensor: ${err}`})
        res.status(200).send({data_sensor: sensorTag_update});
      })

    
}

function deleteSensor(req, res){
    let sensortagId = req.params.sensortagId

    Sensor.findByIdAndDelete(sensortagId, (err, sensorTag) =>{
        if(err) return res.status(500).send({mensaje: `Error al borrar el sensor: ${err}`})

        if(sensorTag === null)
            return res.status(500).send({mensaje: `Error al borrar el sensor: ${err}`})
        return res.status(200).send({mensaje: 'El sensor ha sido eliminado'})

    })
}

module.exports = {
    getSensor,
    getSensors,
    saveSensor,
    updateSensor,
    deleteSensor
}