PersonaTools = {
  // Email mandatory
  checkEmail: (req) => {
    if (!req.body.email) {
      throw new Error('Falta EMAIL');
    }
  },

  // Check ID mandatory
  checkID: (req) => {
    if (!req.body.id) {
      throw new Error('Falta ID');
    }
  },

  // Check ID mandatory
  checkIDParam: (req) => {
    if (!req.params.id) {
      throw new Error('Falta ID');
    }
  },

}

CategoriaTools = {
  // Nombre mandatory
  checkNombre: (req) => {
    if (!req.body.nombre) {
      throw new Error('Falta el nombre de categoría');
    }
  },

  // Check ID mandatory
  checkID: (req) => {
    if (!req.params.id) {
      throw new Error('Falta ID');
    }
  },

}

LibroTools = {
  // Nombre mandatory
  checkNombre: (req) => {
    if (!req.body.nombre) {
      throw new Error('Falta el nombre del libro');
    }
  },

  // Categoria mandatory
  checkCategoria: (req) => {
    if (!req.body.categoria_id) {
      throw new Error('Falta la categoría');
    }
  },

  // Check ID mandatory
  checkID: (req) => {
    if (!req.body.id) {
      throw new Error('Falta ID');
    }
  },

  // Check ID mandatory
  checkIDParam: (req) => {
    if (!req.params.id) {
      throw new Error('Falta ID');
    }
  },

}

module.exports.PersonaTools = PersonaTools;
module.exports.CategoriaTools = CategoriaTools;
module.exports.LibroTools = LibroTools;
