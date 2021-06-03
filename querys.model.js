module.exports = {
  
  // Personas
  Personas: 'SELECT * FROM PERSONA WHERE activo=1',
  PersonaById: 'SELECT * FROM PERSONA WHERE id = ?',
  PersonaByEmail: 'SELECT * FROM PERSONA WHERE email = ?',
  PersonaADD: 'INSERT INTO PERSONA(nombre, apellido, email, alias) VALUES (?,?,?,?)',
  PersonaUpdate: 'UPDATE PERSONA SET nombre=?,apellido=?,email=?,alias=?, activo=? WHERE id=?',
  PersonaDelete: 'UPDATE PERSONA SET activo=? WHERE id = ?',

  // libros
  Libros: 'SELECT * FROM LIBRO'
};