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
const Querys = require('./querys.model');
const Tools = require('./check.common');
const Models = require('./models');

/*
-------------------------------------------
  PERSONAS API
-------------------------------------------
*/
app.get('/personas', async (req, res) => {
  try {
    const respuesta = await qy(Querys.Personas);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/persona/:id', async (req, res) => {
  try {
    const respuesta = await qy(Querys.PersonaById, [req.params.id]);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
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
      "alias": req.body.alias,
      "activo": '1',
    });

    const addPersona = await qy(Querys.PersonaADD, [
      persona.nombre, persona.apellido, (persona.email).toLowerCase(), persona.alias
    ]);
    res.send(persona);

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
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
      "alias": req.body.alias,
    });

    const addPersona = await qy(Querys.PersonaUpdate, [
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
    Tools.PersonaTools.checkIDParam(req);

    // Check if Persona exists
    const existsPersona = await qy(Querys.PersonaById, [req.params.id]);
    if (existsPersona.length <= 0) {
      throw new Error('Persona NO existe');
    }

    // Check si la persona no debe libros
    const constLibroEnPersona = await qy(Querys.PersonaConLibros, [req.params.id]);
    if (constLibroEnPersona.length > 0) {
      throw new Error('Persona debe LIBROS');
    }

    const persona = new Models.Persona({
      "id": req.body.id,
      "activo": '0'
    });

    const deletePersona = await qy(Querys.PersonaDelete, [
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
    const respuesta = await qy(Querys.Categorias);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/categoria/:id', async (req, res) => {
  try {
    const respuesta = await qy(Querys.CategoriaById, [req.params.id]);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.post('/categoria', async (req, res) => {
  try {

    // Nombre mandatory
    Tools.CategoriaTools.checkNombre(req);

    // Check if categoria is already saved
    const exists = await qy(Querys.CategoriaByNombre, [req.body.nombre]);
    if (exists.length > 0) {
      throw new Error('Categoría ya existe');
    }

    const categoria = new Models.Categoria({
      "nombre": req.body.nombre,
    });

    const addCategoria = await qy(Querys.CategoriaADD, [
      categoria.nombre
    ]);
    res.send(categoria);

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.put('/categoria', async (req, res) => {
  try {

    // Check ID & EMAIL
    await Tools.CategoriaTools.checkID(req);
    await Tools.CategoriaTools.checkNombre(req);

    // Check if Categoria exists
    const exists = await qy(Querys.CategoriaById, [req.body.id]);
    if (exists.length === 0) {
      throw new Error('Categoria NO existe');
    }

    const categoria = new Models.Categoria({
      "id": req.body.id,
      "nombre": req.body.nombre
    });

    const addCategoria = await qy(Querys.CategoriaUpdate, [
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
    await Tools.CategoriaTools.checkID(req);

    // Check if Categoria exists
    const exists = await qy(Querys.CategoriaById, [req.params.id]);
    if (exists.length === 0) {
      throw new Error('Categoria NO existe');
    }

    // Check si la categoria esta siendo usada en libros
    // await fn
    const catEnLibro = await qy(Querys.CategoriaExistsEnLibro, [req.params.id]);
    if (catEnLibro.length > 0) {
      let nombres = '';
      catEnLibro.forEach(element => {
        nombres = nombres.concat(element.nombre + ', ');
      });
      throw new Error('Categoria EN USO EN: ' + nombres);
    }

    const deleteCategoria = await qy(Querys.CategoriaDelete, [
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
    const respuesta = await qy(Querys.Libros);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/libro/:id', async (req, res) => {
  try {
    const respuesta = await qy(Querys.LibroById, [req.params.id]);
    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.post('/libro', async (req, res) => {
  try {

    // Nombre mandatory
    Tools.LibroTools.checkNombre(req);
    Tools.LibroTools.checkCategoria(req);

    // Check if Libro is already saved
    const exists = await qy(Querys.LibroByNombre, [req.body.nombre]);
    if (exists.length > 0) {
      throw new Error('Libro ya existe');
    }

    // Check que la categoria exista
    const existsCategoria = await qy(Querys.CategoriaById, [req.body.categoria_id]);
    if (existsCategoria.length <= 0) {
      throw new Error('Categoría NO existe');
    }

    const libro = new Models.Libro({
      "nombre": req.body.nombre,
      "descripcion": req.body.descripcion,
      "categoria_id": req.body.categoria_id,
      "persona_id": req.body.persona_id ? req.body.persona_id : null,
    });

    const addLibro = await qy(Querys.LibroADD, [
      libro.nombre, libro.descripcion, libro.categoria_id, libro.persona_id
    ]);
    res.send(libro);

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.put('/libro', async (req, res) => {
  try {

    // Check ID & EMAIL
    await Tools.LibroTools.checkID(req);
    await Tools.LibroTools.checkNombre(req);
    await Tools.LibroTools.checkCategoria(req);

    // Check if Libro exists
    const exists = await qy(Querys.LibroById, [req.body.id]);
    if (exists.length === 0) {
      throw new Error('Libro NO existe');
    }

    // Check que la categoria exista
    const existsCategoria = await qy(Querys.CategoriaById, [req.body.categoria_id]);
    if (existsCategoria.length === 0) {
      throw new Error('Categoría NO existe');
    }

    const libro = new Models.Libro({
      "id": req.body.id,
      "nombre": req.body.nombre,
      "descripcion": req.body.descripcion,
      "categoria_id": req.body.categoria_id
    });

    const addLibro = await qy(Querys.LibroUpdate, [
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
    await Tools.LibroTools.checkIDParam(req);

    // Check if Categoria exists
    const exists = await qy(Querys.LibroById, [req.params.id]);
    if (exists.length === 0) {
      throw new Error('Libro NO existe');
    }

    // Check if Libro is beeing used
    if (exists[0].persona_id) {
      throw new Error('Libro en uso');
    }

    const deleteLibro = await qy(Querys.LibroDelete, [
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