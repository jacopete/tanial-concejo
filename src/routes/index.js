const express =require('express');
const router = express.Router();
const { logeosuper } = require('../lib/auth');
router.get('/',logeosuper,(req, res)=>{
    //res.render('consulta/consulta');
    res.render('perfil/perfil')

});

//router.post('/cedula',logeosuper,async(req, res)=>{ 



module.exports = router;