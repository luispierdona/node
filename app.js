const express = require('express');
const mysql = require('mysql');
const util = require('util');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

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

/*
-------------------------------------------
  Querys Strings
-------------------------------------------
*/
// Personas
const personas = 'SELECT * FROM persona';
const personaById = 'SELECT * FROM persona WHERE id=?';
const personaByEmail = 'SELECT * FROM persona WHERE email=?';
const personaByEmailAndId = 'SELECT * FROM persona WHERE email=? AND id <> ?';
const personaADD = 'INSERT INTO persona(nombre, apellido, email, alias) VALUES (?,?,?,?)';
const personaUpdate = 'UPDATE persona SET nombre=?,apellido=?,alias=? WHERE id=?';
const personaDelete = 'DELETE FROM persona WHERE id=?';
const personaConLibros = 'SELECT * FROM libro WHERE persona_id=?';

// libros
const libros = 'SELECT * FROM libro';
const libroById = 'SELECT * FROM libro WHERE id=?';
const libroByNombre = 'SELECT * FROM libro WHERE nombre=?';
const libroADD = 'INSERT INTO libro(nombre, descripcion, categoria_id, persona_id) VALUE (?,?,?,?)';
const libroADDSinPersona = 'INSERT INTO libro(nombre, descripcion, categoria_id) VALUE (?,?,?)';
const libroUpdate = 'UPDATE libro SET descripcion=? WHERE id=?';
const libroUpdateSetPersona = 'UPDATE libro SET descripcion=?,persona_id=null WHERE id=?';
const libroDelete = 'DELETE FROM libro WHERE id=?';
const libroPrestar = 'UPDATE libro set persona_id=? WHERE id=?';
const libroDevolver = 'UPDATE libro set persona_id=NULL WHERE id=?';
const libroByPersona = 'SELECT * FROM libro where persona_id=?';
const librosByCategoria = 'SELECT * FROM libro where categoria_id=?';

// Categorias
const categorias = 'SELECT * FROM categoria';
const categoriaById = 'SELECT * FROM categoria WHERE id=?';
const categoriaByNombre = 'SELECT * FROM categoria WHERE nombre=?';
const categoriaADD = 'INSERT INTO categoria(nombre) VALUES (?)';
const categoriaDelete = 'DELETE FROM categoria WHERE id=?';
const categoriaExistsEnLibro = 'SELECT * FROM libro WHERE categoria_id=?';

/*
-------------------------------------------
  PERSONAS API
-------------------------------------------
*/
app.get('/personas', async (req, res) => {
  try {
    const respuesta = await qy(personas);
    res.send(respuesta);
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/persona/:id', async (req, res) => {
  try {
    const respuesta = await qy(personaById, [req.params.id]);

    // Check persona existente
    if (respuesta.length === 0) {
      throw new Error('Persona inexistente');
    }

    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.post('/persona', async (req, res) => {
  try {

    // Check de los campos obligatorios
    if (!req.body.nombre || !req.body.apellido || !req.body.alias || !req.body.email) {
      throw new Error('Faltan datos');
    }

    // Check si el email esta en uso
    const exists = await qy(personaByEmail, [(req.body.email).toLowerCase()]);
    if (exists.length > 0) {
      throw new Error('Email en uso');
    }

    const add = await qy(personaADD, [
      req.body.nombre, req.body.apellido, (req.body.email).toLowerCase(), req.body.alias
    ]);

    res.status(200).send({ 'Respuesta': 'Registro agregado: ' + add.insertId });

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send( error.message );
  }
});

app.put('/persona/:id', async (req, res) => {
  try {

    // Check ID
    if (!req.params.id) {
      throw new Error('Falta ID');
    }

    // Check email
    if (!req.body.email) {
      throw new Error('Falta EMAIL');
    }

    // Check si el email esta uso
    const existsEmail = await qy(personaByEmailAndId, [(req.body.email).toLowerCase(), req.params.id]);
    if (existsEmail.length > 0) {
      throw new Error('Email en uso');
    }

    // Check si la persona existe
    const existsPersona = await qy(personaById, [req.params.id]);
    if (existsPersona.length === 0) {
      throw new Error('Persona NO existe');
    }

    // Check que no haya cambiado el email
    const emailExist = existsPersona[0].email.toString();
    if (emailExist !== req.body.email) {
      throw new Error('No se puede modificar el email');
    }

    const modify = await qy(personaUpdate, [
      req.body.nombre, req.body.apellido,
      req.body.alias, req.params.id
    ]);

    res.status(200).send({ 'Respuesta': 'Registro modificado' });

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send( error.message );
  }
});

app.delete('/persona/:id', async (req, res) => {
  try {

    // Check ID
    if (!req.params.id) {
      throw new Error('Falta ID');
    }

    // Check if Persona exists
    const existsPersona = await qy(personaById, [req.params.id]);
    if (existsPersona.length <= 0) {
      throw new Error('Persona NO existe');
    }

    // Check si la persona no debe libros
    const constLibroEnPersona = await qy(personaConLibros, [req.params.id]);
    if (constLibroEnPersona.length > 0) {
      throw new Error('Persona debe LIBROS');
    }

    const deletePersona = await qy(personaDelete, [
      req.params.id
    ]);

    res.send({ msg: 'Registro borrado' });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send(error.message);
  }
});

/*
-------------------------------------------
  CATEGORIA API
-------------------------------------------
*/
app.get('/categorias', async (req, res) => {
  try {
    const respuesta = await qy(categorias);
    res.send(respuesta);
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/categoria/:id', async (req, res) => {
  try {
    const respuesta = await qy(categoriaById, [req.params.id]);

    // Check categoria existente
    if (respuesta.length === 0) {
      throw new Error('Categoria inexistente');
    }

    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.post('/categoria', async (req, res) => {
  try {

    // Nombre obligatorio
    if (!req.body.nombre) {
      throw new Error('Faltan datos');
    }

    // Check if categoria is already saved
    const exists = await qy(categoriaByNombre, [req.body.nombre.toString().toUpperCase()]);
    if (exists.length > 0) {
      throw new Error('Categoría ya existe');
    }

    const addCategoria = await qy(categoriaADD, [
      req.body.nombre.toString().toUpperCase()
    ]);

    res.status(200).send({ 'Respuesta': 'Registro agregado: ' + addCategoria.insertId });

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send(error.message);
  }
});

app.delete('/categoria/:id', async (req, res) => {
  try {

    // Check ID
    if (!req.params.id) {
      throw new Error('Falta ID');
    }

    // Check si categoria existe
    const exists = await qy(categoriaById, [req.params.id]);
    if (exists.length === 0) {
      throw new Error('Categoria NO existe');
    }

    // Check si la categoria esta siendo usada en libros
    const catEnLibro = await qy(categoriaExistsEnLibro, [req.params.id]);
    if (catEnLibro.length > 0) {
      let nombres = '';
      catEnLibro.forEach(element => {
        nombres = nombres.concat(element.nombre + ', ');
      });
      throw new Error('Categoria con libros asociados, no se puede eliminar. En: ' + nombres);
    }

    const deleteCategoria = await qy(categoriaDelete, [
      req.params.id
    ]);

    res.send({ msg: 'Registro borrado' });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send(error.message);
  }
});

/*
-------------------------------------------
  LIBRO API
-------------------------------------------
*/
app.get('/libros', async (req, res) => {
  try {
    const respuesta = await qy(libros);
    res.send(respuesta);
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/librosExtended', async (req, res) => {
  try {
    let respuesta = await qy(libros);

    for (const element of respuesta) {
      // Add categoria
      const categoria = await qy(categoriaById, [element.categoria_id]);
      if (categoria[0]){
        element.categoria = {...categoria[0]};
      }
      // Add persona
      const persona = await qy(personaById, [element.persona_id]);
      if (persona[0]){
        element.persona = {...persona[0]};
      }
    }

    res.send(respuesta);
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/libro/:id', async (req, res) => {
  try {
    // Check id
    if (!req.params.id) {
      throw new Error('Falta ID');
    }

    const respuesta = await qy(libroById, [req.params.id]);
    if (respuesta.length <= 0) {
      throw new Error('Registro inexistente');
    }

    res.send({ data: respuesta });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.post('/libro', async (req, res) => {
  try {

    // Nombre y categoria obligatorio
    if (!req.body.nombre || !req.body.categoria_id) {
      throw new Error('Faltan datos');
    }

    // Check si libro existe
    const exists = await qy(libroByNombre, [req.body.nombre]);
    if (exists.length > 0) {
      throw new Error('Libro ya existe');
    }

    // Check que la categoria exista
    const existsCategoria = await qy(categoriaById, [req.body.categoria_id]);
    if (existsCategoria.length <= 0) {
      throw new Error('Categoría NO existe');
    }

    // en caso de agregar persona, check si existe
    if (req.body.persona_id && req.body.persona_id !== null) {
      const existePersona = await qy(personaById, [req.body.persona_id]);
      if (existePersona.length <= 0) {
        throw new Error('Persona NO existe');
      }
    }

    let addLibro = null;
    if (req.body.persona_id) {
      addLibro = await qy(libroADD, [
        req.body.nombre, req.body.descripcion, req.body.categoria_id, req.body.persona_id
      ]);
    } else {
      addLibro = await qy(libroADDSinPersona, [
        req.body.nombre, req.body.descripcion, req.body.categoria_id
      ]);
    }

    res.status(200).send({ 'Respuesta': 'Registro agregado: ' + addLibro?.insertId });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send(error.message);
  }
});

app.put('/libro/:id', async (req, res) => {
  try {

    let URL = libroUpdate;

    // Check ID
    if (!req.params.id) {
      throw new Error('Falta ID');
    }

    // Check if Libro exists
    const exists = await qy(libroById, [req.params.id]);
    if (exists.length === 0) {
      throw new Error('Libro NO existe');
    }

    // Check que SOLO haya cambiado la descripcion
    const nombre = exists[0].nombre.toString();
    const categoria_id = exists[0].categoria_id;
    if (nombre !== req.body.nombre || categoria_id !== req.body.categoria_id) {
      throw new Error('No se pueden modificar nombre/categoria');
    }

    if (req.body.persona_id === "null") {
      URL = libroUpdateSetPersona;
    }

    const addLibro = await qy(URL, [
      req.body.descripcion, req.params.id
    ]);

    res.status(200).send({ 'Respuesta': 'Registro modificado' });

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send(error.message);
  }
});

app.put('/libro/prestar/:id', async (req, res) => {
  try {
    // Check ID
    if (!req.params.id) {
      throw new Error('Falta ID');
    }

    // Check persona id
    if (!req.body.persona_id) {
      throw new Error('Falta persona id');
    }

    // Check if Libro exists
    const exists = await qy(libroById, [req.params.id]);
    if (exists.length === 0) {
      throw new Error('Libro NO existe');
    }

    // Check exista persona a quien prestar el libro
    const existPersona = await qy(personaById, [req.body.persona_id]);
    if (existPersona.length <= 0) {
      throw new Error('Persona no existe');
    }

    // Check que el libro no este ya prestado
    if (exists[0].persona_id !== null) {
      throw new Error('Libro ya prestado');
    }

    const prestarLibro = await qy(libroPrestar, [
      req.body.persona_id, req.params.id
    ]);

    res.status(200).send({ 'Respuesta': 'Libro prestado' });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send(error.message);
  }
});


app.put('/libro/devolver/:id', async (req, res) => {
  try {
    // Check ID
    if (!req.params.id) {
      throw new Error('Falta ID');
    }

    // Check if Libro exists
    const exists = await qy(libroById, [req.params.id]);
    if (exists.length === 0) {
      throw new Error('Libro NO existe');
    }

    // Check que el libro este prestado
    if (exists[0].persona_id === null) {
      throw new Error('Libro NO prestado');
    }

    const devolverLibro = await qy(libroDevolver, [
      req.params.id
    ]);

    res.status(200).send({ 'Respuesta': 'Libro devuelto' });

  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send(error.message);
  }
});

app.delete('/libro/:id', async (req, res) => {
  try {

    // Check ID
    if (!req.params.id) {
      throw new Error('Falta ID');
    }

    // Check que exista libro
    const exists = await qy(libroById, [req.params.id]);
    if (exists.length === 0) {
      throw new Error('Libro NO existe');
    }

    // Check que el libro NO este prestado
    if (exists[0].persona_id) {
      throw new Error('Ese libro esta prestado no se puede borrar');
    }

    const deleteLibro = await qy(libroDelete, [
      req.params.id
    ]);

    res.send({ msg: 'Registro borrado' });
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send(error.message);
  }
});

app.get('/librosByPersona/:persona_id', async (req, res) => {
  try {
    // Check id
    if (!req.params.persona_id) {
      throw new Error('Falta ID');
    }

    const respuesta = await qy(libroByPersona, [req.params.persona_id]);

    res.send(respuesta);
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});

app.get('/librosByCategoria/:categoria_id', async (req, res) => {
  try {
    // Check id
    if (!req.params.categoria_id) {
      throw new Error('Falta ID');
    }

    const respuesta = await qy(librosByCategoria, [req.params.categoria_id]);

    res.send(respuesta);
  } catch (error) {
    console.log("🚀 ~ error", error.message);
    res.status(500).send({ 'ERROR': error.message });
  }
});


app.listen(port, () => {
  console.log('running in port:', port);
});
