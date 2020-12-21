'use strict';

// Repositories
const { apiRepository } = require('../repositories/index');

// Functions
async function getRoutes(req, res) {
  try {
    const routes = await apiRepository.getRoutes();
    const routesArray = [];

    for (let key in routes) {
      routesArray.push(`/${key}`); // Obtaining an array with available routes
    }

    res.send(`Estas son las rutas disponibles: ${routesArray.join(', ')}`);
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
}

async function getRouteData(req, res) {
  try {
    const apiRoute = req.params.apiroute;
    const { name, url } = req.query;
    const data = await apiRepository.getRouteData(apiRoute);

    // Filtering data with query params
    const dataFiltered = data.filter((e) => {
      if (name && url) {
        return e.name === name && e.url === url;
      } else if (name) {
        return e.name === name;
      } else if (url) {
        return e.url === url;
      } else {
        return true;
      }
    });

    res.send(dataFiltered);
  } catch (err) {
    err.status = 404;
    err.message = 'Ruta no encontrada';
    console.log(err.message);
    res.status(err.status);
    res.send({ error: err.message });
  }
}

module.exports = { getRoutes, getRouteData };
