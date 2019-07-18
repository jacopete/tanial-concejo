const express =require('express');
const router = express.Router();
const {response} = require('express');
const pool = require('../database');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { logeosuper } = require('../lib/auth');
const FileSaver = require('file-saver');

const XLSX =require('xlsx');
const path =require('path');

const request = require('request');
const cheerio = require('cheerio');

router.get('/',logeosuper,async(req, res)=>{
    const items=8;
  const page = req.body.page|| 1;
  var numero;
  var limite = (page-1)  * items;
 

  const conteo= await pool.query('SELECT count(*) as numero FROM contratos');
 

   pages=Math.ceil(conteo[0].numero/items);
   numero=conteo[0].numero;
   const tipo_vinculo = parseInt(req.body.tipo_vinculo) ;
  const tipo_contrato = parseInt(req.body.tipo_contrato);
  const entidad = parseInt(req.body.entidad);
  const dependencia = parseInt(req.body.dependencia);
  const reconocimiento = parseInt(req.body.reconocimiento);
  console.log("tipo_vinculo :"+tipo_vinculo +"tipo_contrato :"+tipo_contrato +"entidad :"+entidad+"dependencia :"+dependencia+"reconocimiento :"+reconocimiento)
   var navegacion={
    page: parseInt(page),
    pages,   
    items,
    limite,
    der:parseInt(page)+ 1,
    izq:parseInt(page)-1
   }
   const usuario= await pool.query('SELECT * FROM contratos  LIMIT '+ items +' OFFSET '+ limite);
    descargausuario= await pool.query('SELECT * FROM contratos');
 
 
//res.render("contratos/contratos",{usuario, navegacion,numero});
res.render('contratos/contratos',{usuario, tipo_vinculo, tipo_contrato, entidad, dependencia,navegacion,numero});
});

router.post('/',logeosuper, async(req, res)=>{
  const items=8;
  const page = req.body.page|| 1;
  var numero;
 
  var limite = (page-1)  * items;
  const tipo_vinculo = req.body.tipo_vinculo ;
  const tipo_contrato =req.body.tipo_contrato;
  const entidad =req.body.entidad;
  const dependencia =req.body.dependencia;
  const reconocimiento = req.body.reconocimiento;
  console.log("tipo_vinculo :"+ tipo_vinculo +" tipo_contrato :"+tipo_contrato +" entidad :"+entidad+" dependencia :"+dependencia+" reconocimiento :"+reconocimiento)
  
  let firstQexecc = false;
  let queryy = 'SELECT count(*) as numero FROM contratos';
  
  if (tipo_vinculo || tipo_contrato || entidad || dependencia|| reconocimiento){
    descargausuario=null;
    queryy += ' WHERE'
    if(tipo_vinculo){
      console.log("entro a vinculo")
      queryy += ' tipo_vinculo = ' + '"'+tipo_vinculo+'"';
      
      firstQexecc = true;
    }
    if(tipo_contrato){
      if(firstQexecc) queryy += ' AND ';
      queryy += ' tipo_contrato = ' + '"'+tipo_contrato+'"';
      firstQexecc = true;
     
    }
    if(entidad){
      if(firstQexecc) queryy += ' AND';
      queryy += ' entidad = ' + '"'+entidad+'"';
      firstQexecc = true;
    }
    if(dependencia){
      if(firstQexecc) queryy += ' AND';
      queryy += ' dependencia = ' + '"'+dependencia+'"';
      firstQexecc = true;
    }
    if(reconocimiento){
      if(firstQexecc) queryy += ' AND';
      queryy += ' reconocimiento = ' +'"'+reconocimiento+'"';
    }
  }

 
 
   const conteo2= await pool.query(queryy);

   pages=Math.ceil(conteo2[0].numero/items);
   numero=conteo2[0].numero;
   var navegacion={
     page: parseInt(page),
   
     pages,
     items,
     limite,
     der:parseInt(page)+ 1,
     izq:parseInt(page)-1,
     tipo_vinculo,
     tipo_contrato,
     entidad
    }



  let firstQexec = false;
  let query = 'SELECT * FROM contratos';
  let querydescarga='SELECT * FROM contratos';
  if (tipo_vinculo || tipo_contrato || entidad || dependencia|| reconocimiento){
    descargausuario=null;
    query += ' WHERE'
    if(tipo_vinculo){
      console.log("entro a vinculo")
      query += ' tipo_vinculo = ' + '"'+tipo_vinculo+'"';
      
      firstQexec = true;
    }
    if(tipo_contrato){
      if(firstQexec) query += ' AND ';
      query += ' tipo_contrato = ' + '"'+tipo_contrato+'"';
      firstQexec = true;
     
    }
    if(entidad){
      if(firstQexec) query += ' AND';
      query += ' entidad = ' + '"'+entidad+'"';
      firstQexec = true;
    }
    if(dependencia){
      if(firstQexec) query += ' AND';
      query += ' dependencia = ' + '"'+dependencia+'"';
      firstQexec = true;
    }
    if(reconocimiento){
      if(firstQexec) query += ' AND';
      query += ' reconocimiento = ' +'"'+reconocimiento+'"';
    }
  }else{
    query =  'SELECT * FROM contratos' 
   
   
   
  }
  querydescarga=query;
  console.log( query);
  query += ' LIMIT '+ items +' OFFSET '+ limite;
 
   const usuario = await pool.query(query);
   descargausuariocontratos=await pool.query(querydescarga);
  
  
     
  
//const usuario= await pool.query('SELECT * FROM contratos');
 res.render('contratos/contratos',{usuario, tipo_vinculo, tipo_contrato, entidad, dependencia,navegacion,numero});
   });

router.get('/edictar/:cedula',logeosuper,async(req, res)=>{   
    const {cedula} = req.params;
    glovalcedula =cedula;
    console.log(glovalcedula)
    const usuario= await pool.query('SELECT * FROM contratos WHERE cedula='+cedula);
   
    res.render('contratos/edictar',{usuario});  
    
  });
  router.post('/edictar/:cedula',logeosuper,async(req, res)=>{   
   
    var {cedula,telefono, celular  , correo  , tipo_vinculo , tipo_contrato, salario,
        fechai,fechat ,entidad } = req.body;
    var{ nombre_completo, direccion,cargo, dependencia}= req.body
    
    if(salario==''){salario=null;};
    if(fechai==''){fechai=null;};
    if(fechat==''){fechat=null;};
   
      //casos es mayusculas
      if(nombre_completo!=null){
        nombre_completo=nombre_completo.toUpperCase();
      }
      if(direccion!=null){
        direccion=direccion.toUpperCase();
      }
      if(cargo!=null){
        cargo=cargo.toUpperCase();
      }
      if(dependencia!=null){
        dependencia=dependencia.toUpperCase();
      }
   console.log("cedula   mmm "+cedula)
    const nuevousuario={
        
          cedula,
          nombre_completo ,
          telefono,
          celular ,
          direccion,
          correo,
          tipo_vinculo ,
          tipo_contrato,
          salario ,
          fechai ,
          fechat ,
          cargo ,
          dependencia,
          entidad,
         
          
         
    }
    if(nuevousuario.cedula==''){
        req.flash('success','Digite una cedula');
        res.redirect('/contratos/edictar/'+glovalcedula);
      }else{
        if(nuevousuario.cedula==glovalcedula){         
          await pool.query('UPDATE contratos SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
          
          req.flash('success','Modificación completa');
          res.redirect('/contratos');
        }else{    
          const verificarusuario = await pool.query('SELECT * FROM contratos WHERE cedula='+nuevousuario.cedula);
             
                if(verificarusuario==''){
                await pool.query('UPDATE contratos SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
               
                req.flash('success','Modificación completa');
                res.redirect('/contratos');
              
              }else{
              
                req.flash('success','Ya existe la cedula ERROR');
                res.redirect('/contratos');   
              }
        }
      }    
  });

  router.get('/crear',logeosuper,async(req, res)=>{ 

    res.render('contratos/crear.hbs'); 
   });

   router.post('/crear',logeosuper,async(req, res)=>{   
    var {cedula,telefono, celular  , correo  , tipo_vinculo , tipo_contrato, salario,
    fechai,fechat ,entidad } = req.body;
    var{ nombre_completo, direccion,cargo,dependencia}= req.body
    if(salario==''){salario=null;};
    if(fechai==''){fechai=null;};
    if(fechat==''){fechat=null;};
    //casos es mayusculas
    if(nombre_completo!=null){
      nombre_completo=nombre_completo.toUpperCase();
    }
    if(direccion!=null){
      direccion=direccion.toUpperCase();
    }
    if(cargo!=null){
      cargo=cargo.toUpperCase();
    }
    if(dependencia!=null){
      dependencia=dependencia.toUpperCase();
    }
 console.log("cedula   mmm "+cedula)
  const nuevousuario={
      
        cedula,
        nombre_completo ,
        telefono,
        celular ,
        direccion,
        correo,
        tipo_vinculo ,
        tipo_contrato,
        salario ,
        fechai ,
        fechat ,
        cargo ,
        dependencia,
        entidad
        
        
       
  }
        
     if(nuevousuario.cedula!=''){
     
      const verificarusuario = await pool.query('SELECT * FROM contratos WHERE cedula='+nuevousuario.cedula);
     
      if(verificarusuario==''){
        console.log("puede ingresar la cedula");
      
        await pool.query('INSERT INTO contratos set ?',[nuevousuario]);
        req.flash('success','Guardado');
        res.redirect('/contratos');
      }else{
        req.flash('success','la cedula ya esta registrada');
        console.log("la cedula ya esta registrada");
        res.redirect('/contratos/crear');
      }
        
     }else{
      req.flash('success','Digite una cedula');
      console.log("dijite una cedula");
      res.redirect('/contratos/crear');
      };
     
  });
 

  router.post('/cedula',logeosuper,async(req, res)=>{ 
    const {cedula} = req.body; 
       if(cedula==''){
          req.flash('success','Digite una cedula');
          res.redirect('/contratos/');
          //ensayo
         
       }else{
           const usuario = await pool.query('SELECT * FROM contratos WHERE cedula='+cedula);
           //usuariocedula= await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
            if(usuario==''){
              req.flash('success','No se encontraron coincidencias');
              res.redirect('/contratos/');
            }else{
              //console.log('success','La cedula existe');
            res.render('contratos/cedula',{usuario });
            //res.render('consulta/',{usuario});
            }
    
        }  
       
  });
  
  router.get('/cedula',logeosuper,async(req, res)=>{ 
    
    res.redirect('/contratos/');
  });
  
  router.get('/borrar/:cedula',logeosuper,async(req, res)=>{  
    const {cedula} = req.params;
   
    await pool.query('DELETE FROM contratos WHERE cedula='+cedula);
    
    res.redirect('/contratos/');
  });
  router.get('/borrar/opcion/:cedula',logeosuper,async(req, res)=>{  
    const {cedula} = req.params;
    const usuario= await pool.query('SELECT * FROM contratos WHERE cedula='+cedula);
    nombre_completo =usuario[0].nombre_completo;
    res.render('contratos/borrar.hbs',{cedula,nombre_completo}); 
  
  });


  router.get('/descarga', logeosuper,function(req, res) { 
   

    if(descargausuario!=null){
   
    var ws = XLSX.utils.json_to_sheet(descargausuario);
    // var csv= XLSX.utils.sheet_to_csv(data);
    
     var wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, ws, "People");
    
    
    XLSX.writeFile(wb, "resultadovotantes.xlsx");
    console.log(wb);
    res.download('resultadovotantes.xlsx');}
    else{
     
      if(typeof XLSX == 'undefined') XLSX = require('xlsx');
      var ws = XLSX.utils.json_to_sheet(descargausuariocontratos);
      // var csv= XLSX.utils.sheet_to_csv(data);
      
       var wb = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "People");
      
      
      XLSX.writeFile(wb, "resultadovotantes.xlsx");
      console.log(wb);
      res.download('resultadovotantes.xlsx');

    }
});
module.exports = router;