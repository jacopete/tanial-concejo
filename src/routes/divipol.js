const express =require('express');
const router = express.Router();
const { logeocualquiera } = require('../lib/auth');

router.get('/',logeocualquiera,(req, res)=>{
res.render("divipol/divipol");

});





module.exports = router;