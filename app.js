const express = require('express');
const mysql = require('mysql');
const util = require('util');

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

var conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs',
});

conexion.connect((error) => {
  if (error) throw error;

  console.log('Database connected')
})

const qy = util.promisify(conexion.query).bind(conexion);
const Querys = require('./querys.model');
const Tools = require('./check.common');
const Models = require('./models');

/*
  PERSONAS API
*/ 
app.get('/personas', async (req, res) => {
  try {
    const respuesta = await qy(Querys.Personas);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message })
  }
});

app.get('/persona/:id', async (req, res) => {
  try {
    const respuesta = await qy(Querys.PersonaById, [req.params.id]);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message })
  }
});

app.post('/persona', async (req, res) => {
  try {

    // Email mandatory
    Tools.PersonaTools.checkEmail(req);

    // Check if email is in use
    const exists = await qy(Querys.PersonaByEmail, [(req.body.email).toLowerCase()]);
    if (exists.length > 0) {
      throw new Error('Email en uso');
    }

    const persona = new Models.Persona({
      "nombre": req.body.nombre,
      "apellido": req.body.apellido,
      "email": req.body.email,
      "alias": req.body.alias
    });

    const addPersona = await qy(Querys.PersonaADD, [
      persona.nombre, persona.apellido, (persona.email).toLowerCase(), persona.alias
    ]);
    res.send( persona );

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message })
  }
});

app.put('/persona', async (req, res) => {
  try {

    // Check ID & EMAIL
    await Tools.PersonaTools.checkID(req);
    await Tools.PersonaTools.checkEmail(req);
    
    // Check if email is in use
    const existsEmail = await qy(Querys.PersonaByEmail, [(req.body.email).toLowerCase()]);
    if (existsEmail.length > 0) {
      throw new Error('Email en uso');
    }

    // Check if Persona exists
    const existsPersona = await qy(Querys.PersonaById, [req.body.id]);
    if (existsPersona.length === 0) {
      throw new Error('Persona NO existe');
    }

    const persona = new Models.Persona({
      "id": req.body.id,
      "nombre": req.body.nombre,
      "apellido": req.body.apellido,
      "email": req.body.email,
      "alias": req.body.alias
    });

    const addPersona = await qy(Querys.PersonaUpdate, [
      persona.nombre, persona.apellido, (persona.email).toLowerCase(),
      persona.alias, persona.id
    ]);
    res.send( persona );

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message })
  }
});

app.delete('/persona/:id', async (req, res) => {
  try {
    console.log('falta delete');
    res.send({ msg: 'OK' })
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message })
  }
});

app.listen(port, () => {
  console.log('running in port:', port);
});