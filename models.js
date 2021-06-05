// Persona
const Persona = function (persona) {
  this.id = persona.id;
  this.nombre = persona.nombre;
  this.apellido = persona.apellido;
  this.email = persona.email;
  this.alias = persona.alias;
  this.activo = persona.activo;
};

const Categoria = function (categoria) {
  this.id = categoria.id;
  this.nombre = categoria.nombre;
}

const Genero = Object.freeze({
  Terror: 'Terror',
  Accion: 'Acción',
  Other: 'other',
});

const Libro = function (libro) {
  this.id = libro.id;
  this.nombre = libro.nombre;
  this.descripcion = libro.descripcion;
  this.categoria_id = libro.categoria_id;
  this.persona_id = libro.persona_id;
}

module.exports.Persona = Persona;
module.exports.Categoria = Categoria;
module.exports.Libro = Libro;

