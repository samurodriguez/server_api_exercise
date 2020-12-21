'use strict';

const fsPromises = require('fs').promises;

async function getUserByEmail(email) {
  const users = require('../Data/users.json');
  const user = users.usuarios.find((user) => user.email === email); // Checking if an user with "x" email exists
  return user;
}

async function createUser(name, email, password) {
  const users = require('../Data/users.json');
  const newUser = { name, email, password };

  users.usuarios.push(newUser);
  await fsPromises.writeFile('./Data/users.json', JSON.stringify(users));
  return true;
}

module.exports = { getUserByEmail, createUser };
