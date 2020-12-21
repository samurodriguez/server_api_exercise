'use strict';

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

function validateAuth(req, res, next) {
  try {
    const token = req.headers.authorization;
    jwt.verify(token, JWT_SECRET);

    next();
  } catch (error) {
    error.message = 'Error: Usuario no logueado';
    console.log(error.message);
    res.redirect('http://localhost:8080/login');
  }
}

module.exports = validateAuth;
