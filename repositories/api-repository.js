'use strict';

const fetch = require('node-fetch');

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

async function getRoutes() {
  const routes = await fetchData('https://pokeapi.co/api/v2/');
  return routes;
}

async function getRouteData(apiRoute) {
  const data = await fetchData(`https://pokeapi.co/api/v2/${apiRoute}`);
  return data.results;
}

module.exports = { getRoutes, getRouteData };
