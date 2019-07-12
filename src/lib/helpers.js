
const bcrypt =require('bcryptjs')
const helpers = {};

helpers.cifrar = async(contrasena) => {
   const cadena= await bcrypt.genSalt(10);
   contracifrada= await bcrypt.hash(contrasena,cadena);
   return  contracifrada;
};






module.exports = helpers;