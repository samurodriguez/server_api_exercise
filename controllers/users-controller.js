'use strict';

// Modules
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Repositories
const { usersRepository } = require('../repositories/index');

// Functions
async function register(req, res) {
  try {
    const registerSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(20).required(),
      repeatPassword: Joi.ref('password'),
    });

    await registerSchema.validateAsync(req.body);

    const { name, email, password } = req.body;
    const user = await usersRepository.getUserByEmail(email);

    if (user) {
      const error = new Error('Ya existe un usuario con ese email');
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await usersRepository.createUser(name, email, passwordHash);

    res.send(`Usuario ${name} añadido correctamente`);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }

    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(20).required(),
    });

    await schema.validateAsync({ email, password });

    const user = await usersRepository.getUserByEmail(email);
    if (!user) {
      const error = new Error('No existe ningún usuario con ese email');
      error.code = 404;
      throw error;
    }

    const isPasswordOk = await bcrypt.compare(password, user.password);

    if (!isPasswordOk) {
      const error = new Error('La contraseña es incorrecta');
      error.code = 401;
      throw error;
    }

    const tokenPayload = { name: user.name, email: user.email };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.send(token);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

module.exports = { register, login };
