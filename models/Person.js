const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    edad: String
});

module.exports = mongoose.model('Person', personSchema, 'form_personas');