'use strict';

// Modules
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Controllers
const { apiController, usersController } = require('./controllers/index');
const { validateAuth, notFound } = require('./middlewares/index');

// Variables
const port = process.env.SERVER_PORT;

// Declaration
const app = express();

// Logger
const accessLogStream = fs.createWriteStream('./access.txt', { flags: 'a' });

// Middlewares
app.use(morgan('combined', { immediate: true, stream: accessLogStream }));
app.use(bodyParser.json());

// Get requests
app.get('/', validateAuth, async function (req, res) {
  res.send('¡Bienvenido a PokeApi! Para ver las rutas disponibles vete a /pokeapi');
});
app.get('/pokeapi', validateAuth, apiController.getRoutes);
app.get('/pokeapi/:apiroute', validateAuth, apiController.getRouteData);
app.get('/login', async function (req, res) {
  res.send('Estás en /login, porfavor, inicia sesión');
});
app.get('*', notFound);

// Post requests
app.post('/register', usersController.register);
app.post('/login', usersController.login);

// Server listen
app.listen(port, () => console.log(`Escuchando en ${port}`));
