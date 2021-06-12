const express = require('express');
const mysql = require('mysql');
const util = require('util');

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// var conexion = mysql.createConnection({
//   host: 'wo46.wiroos.host',
//   user: 'randazzo_tp',
//   password: 'UTNgrupo13',
//   database: 'randazzo_biblioteca',
// });

var conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs',
});

conexion.connect((error) => {
  if (error) throw error;
  console.log('Database connected');
});

const qy = util.promisify(conexion.query).bind(conexion);
const querys = require('./querys.model');
const tools = require('./check.common');
const models = require('./models');

/*
-------------------------------------------
  PERSONAS API
-------------------------------------------
*/
app.get('/personas', async (req, res) => {
  try {
    const respuesta = await qy(querys.Personas);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/persona/:id', async (req, res) => {
  try {
    const respuesta = await qy(querys.PersonaById, [req.params.id]);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.post('/persona', async (req, res) => {
  try {

    // Email mandatory
    tools.PersonaTools.checkEmail(req);

    // Check if email is in use
    const exists = await qy(querys.PersonaByEmail, [(req.body.email).toLowerCase()]);
    if (exists.length > 0) {
      throw new Error('Email en uso');
    }

    const persona = new models.Persona({
      "nombre": req.body.nombre,
      "apellido": req.body.apellido,
      "email": req.body.email,
      "alias": req.body.alias
    });

    const addPersona = await qy(querys.PersonaADD, [
      persona.nombre, persona.apellido, (persona.email).toLowerCase(), persona.alias
    ]);

    persona.id = addPersona.insertId;
    res.send(persona);

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.put('/persona', async (req, res) => {
  try {

    // Check ID & EMAIL
    await tools.PersonaTools.checkID(req);
    await tools.PersonaTools.checkEmail(req);

    // Check if email is in use
    const existsEmail = await qy(querys.PersonaByEmail, [(req.body.email).toLowerCase()]);
    if (existsEmail.length > 0) {
      throw new Error('Email en uso');
    }

    // Check if Persona exists
    const existsPersona = await qy(querys.PersonaById, [req.body.id]);
    if (existsPersona.length === 0) {
      throw new Error('Persona NO existe');
    }

    const persona = new models.Persona({
      "id": req.body.id,
      "nombre": req.body.nombre,
      "apellido": req.body.apellido,
      "email": req.body.email,
      "alias": req.body.alias,
    });

    const addPersona = await qy(querys.PersonaUpdate, [
      persona.nombre, persona.apellido, (persona.email).toLowerCase(),
      persona.alias, persona.id
    ]);
    res.send(persona);

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.delete('/persona/:id', async (req, res) => {
  try {

    // Check ID
    tools.PersonaTools.checkIDParam(req);

    // Check if Persona exists
    const existsPersona = await qy(querys.PersonaById, [req.params.id]);
    if (existsPersona.length <= 0) {
      throw new Error('Persona NO existe');
    }

    // Check si la persona no debe libros
    const constLibroEnPersona = await qy(querys.PersonaConLibros, [req.params.id]);
    if (constLibroEnPersona.length > 0) {
      throw new Error('Persona debe LIBROS');
    }

    const persona = new models.Persona({
      "id": req.body.id,
      "activo": '0'
    });

    const deletePersona = await qy(querys.PersonaDelete, [
      req.params.id
    ]);

    res.send({ msg: 'OK' });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

/*
-------------------------------------------
  CATEGORIA API
-------------------------------------------
*/
app.get('/categorias', async (req, res) => {
  try {
    const respuesta = await qy(querys.Categorias);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/categoria/:id', async (req, res) => {
  try {
    const respuesta = await qy(querys.CategoriaById, [req.params.id]);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.post('/categoria', async (req, res) => {
  try {

    // Nombre mandatory
    tools.CategoriaTools.checkNombre(req);

    // Check if categoria is already saved
    const exists = await qy(querys.CategoriaByNombre, [req.body.nombre]);
    if (exists.length > 0) {
      throw new Error('Categoría ya existe');
    }

    const categoria = new models.Categoria({
      "nombre": req.body.nombre,
    });

    const addCategoria = await qy(querys.CategoriaADD, [
      categoria.nombre
    ]);

    categoria.id = addCategoria.insertId;
    res.send(categoria);

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.put('/categoria', async (req, res) => {
  try {

    // Check ID & EMAIL
    await tools.CategoriaTools.checkID(req);
    await tools.CategoriaTools.checkNombre(req);

    // Check if Categoria exists
    const exists = await qy(querys.CategoriaById, [req.body.id]);
    if (exists.length === 0) {
      throw new Error('Categoria NO existe');
    }

    const categoria = new models.Categoria({
      "id": req.body.id,
      "nombre": req.body.nombre
    });

    const addCategoria = await qy(querys.CategoriaUpdate, [
      categoria.nombre, categoria.id
    ]);
    res.send(categoria);

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.delete('/categoria/:id', async (req, res) => {
  try {

    // Check ID
    await tools.CategoriaTools.checkID(req);

    // Check if Categoria exists
    const exists = await qy(querys.CategoriaById, [req.params.id]);
    if (exists.length === 0) {
      throw new Error('Categoria NO existe');
    }

    // Check si la categoria esta siendo usada en libros
    // await fn
    const catEnLibro = await qy(querys.CategoriaExistsEnLibro, [req.params.id]);
    if (catEnLibro.length > 0) {
      let nombres = '';
      catEnLibro.forEach(element => {
        nombres = nombres.concat(element.nombre + ', ');
      });
      throw new Error('Categoria EN USO EN: ' + nombres);
    }

    const deleteCategoria = await qy(querys.CategoriaDelete, [
      req.params.id
    ]);

    res.send({ msg: 'OK' });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

/*
-------------------------------------------
  LIBRO API
-------------------------------------------
*/
app.get('/libros', async (req, res) => {
  try {
    const respuesta = await qy(querys.Libros);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/libro/:id', async (req, res) => {
  try {
    const respuesta = await qy(querys.LibroById, [req.params.id]);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.post('/libro', async (req, res) => {
  try {

    // Nombre mandatory
    tools.LibroTools.checkNombre(req);
    tools.LibroTools.checkCategoria(req);

    // Check if Libro is already saved
    const exists = await qy(querys.LibroByNombre, [req.body.nombre]);
    if (exists.length > 0) {
      throw new Error('Libro ya existe');
    }

    // Check que la categoria exista
    const existsCategoria = await qy(querys.CategoriaById, [req.body.categoria_id]);
    if (existsCategoria.length <= 0) {
      throw new Error('Categoría NO existe');
    }

    const libro = new models.Libro({
      "nombre": req.body.nombre,
      "descripcion": req.body.descripcion,
      "categoria_id": req.body.categoria_id,
      "persona_id": req.body.persona_id ? req.body.persona_id : null,
    });

    const addLibro = await qy(querys.LibroADD, [
      libro.nombre, libro.descripcion, libro.categoria_id, libro.persona_id
    ]);

    libro.id = addLibro.insertId;
    res.send(libro);

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.put('/libro', async (req, res) => {
  try {

    // Check ID & EMAIL
    await tools.LibroTools.checkID(req);
    await tools.LibroTools.checkNombre(req);
    await tools.LibroTools.checkCategoria(req);

    // Check if Libro exists
    const exists = await qy(querys.LibroById, [req.body.id]);
    if (exists.length === 0) {
      throw new Error('Libro NO existe');
    }

    // Check que la categoria exista
    const existsCategoria = await qy(querys.CategoriaById, [req.body.categoria_id]);
    if (existsCategoria.length === 0) {
      throw new Error('Categoría NO existe');
    }

    const libro = new models.Libro({
      "id": req.body.id,
      "nombre": req.body.nombre,
      "descripcion": req.body.descripcion,
      "categoria_id": req.body.categoria_id
    });

    const addLibro = await qy(querys.LibroUpdate, [
      libro.nombre, libro.descripcion, libro.categoria_id, libro.id
    ]);
    res.send(libro);

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.delete('/libro/:id', async (req, res) => {
  try {

    // Check ID
    await tools.LibroTools.checkIDParam(req);

    // Check if Categoria exists
    const exists = await qy(querys.LibroById, [req.params.id]);
    if (exists.length === 0) {
      throw new Error('Libro NO existe');
    }

    // Check if Libro is beeing used
    if (exists[0].persona_id) {
      throw new Error('Libro en uso');
    }

    const deleteLibro = await qy(querys.LibroDelete, [
      req.params.id
    ]);

    res.send({ msg: 'OK' });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});


app.listen(port, () => {
  console.log('running in port:', port);
});