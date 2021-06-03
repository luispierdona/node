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


}

module.exports.PersonaTools = PersonaTools;