module.exports = {
  
  // Personas
  Personas: 'SELECT * FROM PERSONA',
  PersonaById: 'SELECT * FROM PERSONA WHERE id = ?',
  PersonaByEmail: 'SELECT * FROM PERSONA WHERE email = ?',
  PersonaADD: 'INSERT INTO PERSONA(nombre, apellido, email, alias) VALUES (?,?,?,?)',
  PersonaUpdate: 'UPDATE PERSONA SET nombre=?,apellido=?,email=?,alias=? WHERE id = ?'
};