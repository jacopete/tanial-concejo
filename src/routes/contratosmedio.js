const express =require('express');
const router = express.Router();
const {response} = require('express');
const pool = require('../database');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { logeousuariomedio } = require('../lib/auth');
const FileSaver = require('file-saver');

const XLSX =require('xlsx');
const path =require('path');

const request = require('request');
const cheerio = require('cheerio');

router.get('/',logeousuariomedio,async(req, res)=>{
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
res.render('contratosmedio/contratosmedio',{usuario, tipo_vinculo, tipo_contrato, entidad, dependencia,navegacion,numero});
});

router.post('/',logeousuariomedio, async(req, res)=>{
  const items=8;
  const page = req.body.page|| 1;
  var numero;
 
  var limite = (page-1)  * items;
  const tipo_vinculo = req.body.tipo_vinculo ;
  const tipo_contrato =req.body.tipo_contrato;
  const entidad =req.body.entidad;
  const dependencia =req.body.dependencia;
  const reconocimiento = req.body.reconocimiento;
  
  
  let firstQexecc = false;
  let queryy = 'SELECT count(*) as numero FROM contratos';
  
  if (tipo_vinculo || tipo_contrato || entidad || dependencia|| reconocimiento){
    descargausuario=null;
    queryy += ' WHERE'
    if(tipo_vinculo){
     
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
  
  query += ' LIMIT '+ items +' OFFSET '+ limite;
 
   const usuario = await pool.query(query);
   descargausuariocontratos=await pool.query(querydescarga);
  
  
     
  
//const usuario= await pool.query('SELECT * FROM contratos');
 res.render('contratosmedio/contratosmedio',{usuario, tipo_vinculo, tipo_contrato, entidad, dependencia,navegacion,numero});
   });


  router.post('/cedula',logeousuariomedio,async(req, res)=>{ 
    const {cedula} = req.body; 
       if(cedula==''){
          req.flash('success','Digite una cedula');
          res.redirect('/contratosmedio/');
          //ensayo
         
       }else{
           const usuario = await pool.query('SELECT * FROM contratos WHERE cedula='+cedula);
           //usuariocedula= await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
            if(usuario==''){
              req.flash('success','No se encontraron coincidencias');
              res.redirect('/contratosmedio/');
            }else{
             
            res.render('contratosmedio/cedula',{usuario });
            //res.render('consulta/',{usuario});
            }
    
        }  
       
  });
  
  router.get('/cedula',logeousuariomedio,async(req, res)=>{ 
    
    res.redirect('/contratosmedio/');
  });
  
 
  router.post('/nombre',logeousuariomedio,async(req, res)=>{ 
    const {nombre} = req.body;
    
       if(nombre==''){
          req.flash('success','Digite un nombre');
          res.redirect('/contratosmedio/');
          //ensayo
          
       }else{
           let query='SELECT * FROM contratos WHERE nombre_completo LIKE '+'"'+'%'+nombre+'%'+'"';
           const usuario = await pool.query(query);
            if(usuario==''){
              req.flash('success','No se encontraron coincidencias');
              res.redirect('/contratosmedio/');
            }else{
              res.render('contratosmedio/nombre',{usuario});
            //res.render('consulta/',{usuario});
            }
    
        }  
       
  });
  
  router.get('/nombre',logeousuariomedio,async(req, res)=>{ 
    res.redirect('/contratosmedio/');
  });

  router.get('/descarga', logeousuariomedio,function(req, res) { 
   

    if(descargausuario!=null){
   
    var ws = XLSX.utils.json_to_sheet(descargausuario);
    // var csv= XLSX.utils.sheet_to_csv(data);
    
     var wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, ws, "People");
    
    
    XLSX.writeFile(wb, "resultadovotantes.xlsx");
    
    res.download('resultadovotantes.xlsx');}
    else{
     
      if(typeof XLSX == 'undefined') XLSX = require('xlsx');
      var ws = XLSX.utils.json_to_sheet(descargausuariocontratos);
      // var csv= XLSX.utils.sheet_to_csv(data);
      
       var wb = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "People");
      
      
      XLSX.writeFile(wb, "resultadovotantes.xlsx");
     
      res.download('resultadovotantes.xlsx');

    }
});
module.exports = router;