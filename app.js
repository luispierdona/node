'user strict';

var express = require('express');
var mySql = require('mysql');
var app = express();
app.use(express.json());

var conexion = mySql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs',
});

conexion.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + conexion.threadId);
});


app.get('/persona', async function (req, res) {

  // const persona = conexion.query('SELECT * FROM PERSONA');
  // console.log(persona);
  // res.send('OK');
  let persona = [];
  await conexion.query("SELECT * FROM PERSONA", function (err, res) {

    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    else {
      const respuesta = JSON.parse(JSON.stringify(res));
      if (respuesta.lenght !== 0) {
        respuesta.forEach(element => {
          persona.push(element);
        });
      }
      console.log(persona);
    }
  });
  res.send('OK');
});

app.listen(3000, function () {
  console.log('running');
});