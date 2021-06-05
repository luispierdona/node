module.exports = {
  
  // Personas
  Personas: 'SELECT * FROM PERSONA',
  PersonaById: 'SELECT * FROM PERSONA WHERE id=?',
  PersonaByEmail: 'SELECT * FROM PERSONA WHERE email=?',
  PersonaADD: 'INSERT INTO PERSONA(nombre, apellido, email, alias) VALUES (?,?,?,?)',
  PersonaUpdate: 'UPDATE PERSONA SET nombre=?,apellido=?,email=?,alias=? WHERE id=?',
  PersonaDelete: 'DELETE FROM PERSONA WHERE id=?',
  PersonaConLibros: 'SELECT * FROM LIBRO WHERE persona_id=?',

  // libros
  Libros: 'SELECT * FROM LIBRO',
  LibroById: 'SELECT * FROM LIBRO WHERE id=?',
  LibroByNombre: 'SELECT * FROM LIBRO WHERE nombre=?',
  LibroADD: 'INSERT INTO LIBRO(nombre, descripcion, categoria_id, persona_id) VALUE (?,?,?,?)',
  LibroUpdate: 'UPDATE LIBRO SET nombre=?,descripcion=?,categoria_id=? WHERE id=?',
  LibroDelete: 'DELETE FROM LIBRO WHERE id=?',

  // Categorias
  Categorias: 'SELECT * FROM CATEGORIA',
  CategoriaById: 'SELECT * FROM CATEGORIA WHERE id=?',
  CategoriaByNombre: 'SELECT * FROM CATEGORIA WHERE nombre=?',
  CategoriaADD: 'INSERT INTO CATEGORIA(nombre) VALUES (?)',
  CategoriaUpdate: 'UPDATE CATEGORIA SET nombre=? WHERE id=?',
  CategoriaDelete: 'DELETE FROM CATEGORIA WHERE id=?',
  CategoriaExistsEnLibro: 'SELECT * FROM LIBRO WHERE categoria_id=?'
};