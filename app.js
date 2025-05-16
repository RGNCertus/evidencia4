require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const Person = require('./models/Person');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar', err));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Personas',
      version: '1.0.0',
      description: 'API para guardar personas con MongoDB y Node.js',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        url: 'https://evidencia4-production.up.railway.app/',
      },
    ],
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       required:
 *         - nombre
 *         - correo
 *         - telefono
 *       properties:
 *         nombre:
 *           type: string
 *         correo:
 *           type: string
 *         telefono:
 *           type: string
 *       example:
 *         nombre: Rodrigo
 *         correo: rodrigo@mail.com
 *         telefono: "987654321"
 */

/**
 * @swagger
 * /submit:
 *   post:
 *     summary: Guarda una nueva persona
 *     tags: [Person]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Person'
 *     responses:
 *       200:
 *         description: Persona guardada exitosamente
 *       500:
 *         description: Error al guardar
 */
app.post('/submit', async (req, res) => {
  try {
    const person = new Person(req.body);
    await person.save();
    res.status(200).json({ message: 'Se guardó correctamente' });
  } catch (err) {
    console.error('Error al guardar:', err.message);
    res.status(500).json({ message: 'Error al guardar', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Swagger docs en http://localhost:${PORT}/api-docs`);
});
