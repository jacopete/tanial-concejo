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
  
//consultamedio cedula    
router.post('/cedula',logeousuariomedio,async(req, res)=>{ 
  const {cedula} = req.body; 
     if(cedula==''){
        req.flash('success','Digite una cedula');
        res.redirect('/consultamedio/');
        //ensayo
       
     }else{
         const usuario = await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
         //usuariocedula= await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
          if(usuario==''){
            req.flash('success','No se encontraron coincidencias');
            res.redirect('/consultamedio/');
          }else{
            //console.log('success','La cedula existe');
          res.render('consultamedio/cedula',{usuario });
          //res.render('consultamedio/',{usuario});
          }
  
      }  
     
});

router.get('/cedula',logeousuariomedio,async(req, res)=>{ 
  
  res.redirect('/consultamedio/');
});



//crear usuario


router.get('/',logeousuariomedio,async(req, res)=>{  
  const items=8;
  const page = req.body.page|| 1;
  var numero;
  var limite = (page-1)  * items;
  const comuna = parseInt(req.body.comuna);
  const zona = parseInt(req.body.zona);
  const puesto = parseInt(req.body.puesto);
  const mesa = parseInt(req.body.mesa);

  const conteo= await pool.query('SELECT count(*) as numero FROM persona');
 

   pages=Math.ceil(conteo[0].numero/items);
   numero=conteo[0].numero;
   var navegacion={
    page: parseInt(page),
    pages,
    items,
    limite,
    der:parseInt(page)+ 1,
    izq:parseInt(page)-1
   }
   const usuario= await pool.query('SELECT * FROM persona ORDER BY comuna ASC, zona ASC,  puesto ASC, mesa ASC LIMIT '+ items +' OFFSET '+ limite );
   descargausuario= await pool.query('SELECT * FROM persona ORDER BY comuna ASC, zona ASC, puesto ASC, mesa ASC');
 
 
  //var blob = new Blob(wb, {type: "text/plain;charset=utf-8"});
  //var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
  
 // FileSaver.saveAs(wb, "votantes.xlsx");
 // saveAs(wb, "votantes.xlsx");
   res.render('consultamedio/consultamedio',{usuario, comuna, zona, puesto, mesa,navegacion,numero});
  
});


router.post('/',logeousuariomedio, async(req, res)=>{
  const items=8;
  const page = req.body.page|| 1;
  var numero;
  var limite = (page-1)  * items;
  const comuna = parseInt(req.body.comuna) ;
  const zona = parseInt(req.body.zona);
  const puesto = parseInt(req.body.puesto);
  const mesa = parseInt(req.body.mesa);
  
  
  let firstQexecc = false;

 
  let queryy = ' SELECT count(*) as numero FROM persona ';
  if (comuna || zona || puesto || mesa){
    
    queryy += ' WHERE'
    if(comuna){
      queryy += ' comuna = ' + comuna;
     
      firstQexecc = true;
    }
    if(zona){
      if(firstQexecc) queryy += ' AND ';
      queryy += ' zona = ' + zona;
      firstQexecc = true;
    }
    if(puesto){
      if(firstQexecc) queryy+= ' AND ';
      queryy += ' puesto = ' + puesto;
      firstQexecc = true;
    }
    if(mesa){
      if(firstQexecc) queryy += ' AND ';
      queryy += ' mesa = ' + mesa;
    }
  }
 
  const conteo2 = await pool.query(queryy);
  
  pages=Math.ceil(conteo2[0].numero/items);
  numero=conteo2[0].numero;
  var navegacion={
    page: parseInt(page),
  
    pages,
    items,
    limite,
    der:parseInt(page)+ 1,
    izq:parseInt(page)-1,
    comuna,
    zona,
    puesto,
    mesa
   }
   
   
  let firstQexec = false;
  let query = 'SELECT * FROM persona';
  let querydescarga='SELECT * FROM persona';
  if (comuna || zona || puesto || mesa){
    descargausuario=null;
    query += ' WHERE'
    if(comuna){
      query += ' comuna = ' + comuna;
      
      firstQexec = true;
    }
    if(zona){
      if(firstQexec) query += ' AND ';
      query += ' zona = ' + zona;
     
      firstQexec = true;
    }
    if(puesto){
      if(firstQexec) query += ' AND';
      query += ' puesto = ' + puesto;
      firstQexec = true;
    }
    if(mesa){
      if(firstQexec) query += ' AND';
      query += ' mesa = ' + mesa;
    }
  }else{
    query =  'SELECT * FROM persona ' 
   
  }
  querydescarga=query+' ORDER BY comuna ASC, zona ASC, puesto ASC, mesa ASC ';
  query += ' ORDER BY comuna ASC, zona ASC, puesto ASC, mesa ASC LIMIT '+ items +' OFFSET '+ limite;
 
  const usuario = await pool.query(query);
  descargausuarioconsulta=await pool.query(querydescarga);
  res.render('consultamedio/consultamedio',{usuario, comuna, zona, puesto, mesa,navegacion,numero});
  
//------------------------------------------exportar excel
/*
var data = [
  {"name":"John", "city": "Seattle"},
  {"name":"Mike", "city": "Los Angeles"},
  {"name":"Zach", "city": "New York"}
];
if(typeof XLSX == 'undefined') XLSX = require('xlsx');
var ws = XLSX.utils.json_to_sheet(data);
// var csv= XLSX.utils.sheet_to_csv(data);

 var wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb, ws, "People");


XLSX.writeFile(wb, "votantes.xlsx");

res.download('votantes.xlsx');
  */

   });

   router.get('/descarga', logeousuariomedio,function(req, res) { 
   

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
      var ws = XLSX.utils.json_to_sheet(descargausuarioconsultamedio);
      // var csv= XLSX.utils.sheet_to_csv(data);
      
       var wb = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "People");
      
      
      XLSX.writeFile(wb, "resultadovotantes.xlsx");
      console.log(wb);
      res.download('resultadovotantes.xlsx');

    }
});
  

 module.exports = router;
