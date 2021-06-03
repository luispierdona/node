// Persona
const Persona = function (persona) {
  this.id = persona.id;
  this.nombre = persona.nombre;
  this.apellido = persona.apellido;
  this.email = persona.email;
  this.alias = persona.alias;
  this.activo = persona.activo;
};

const GeneroLibro = function (genero) {
  this.id = genero.id;
  // this.accion = 'ACCION';
  // this.terror = 'TERROR';
}

const Libro = function (libro) {
  this.id = libro.id;
  this.nombre = libro.nombre;
  this.description = libro.description;
  this.genero = GeneroLibro;
  this.personaID = libro.personaID;
}

module.exports.Persona = Persona;
module.exports.GeneroLibro = GeneroLibro;
module.exports.Libro = Libro;

