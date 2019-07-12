const express =require('express');
const router = express.Router();
const {response} = require('express');
const pool = require('../database');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { logeousuario} = require('../lib/auth');
const FileSaver = require('file-saver');

const XLSX =require('xlsx');
const path =require('path');

const request = require('request');
const cheerio = require('cheerio');
 
router.get('/',logeousuario,async(req, res)=>{  
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
   const usuario= await pool.query('SELECT * FROM persona ORDER BY comuna ASC, zona ASC, puesto ASC LIMIT '+ items +' OFFSET '+ limite );
  descargausuario= await pool.query('SELECT * FROM persona ORDER BY comuna ASC, zona ASC, puesto ASC');
 
 
  //var blob = new Blob(wb, {type: "text/plain;charset=utf-8"});
  //var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
  
 // FileSaver.saveAs(wb, "votantes.xlsx");
 // saveAs(wb, "votantes.xlsx");
   res.render('consultavista/consultavista',{usuario, comuna, zona, puesto, mesa,navegacion,numero});
  
});


router.post('/',logeousuario, async(req, res)=>{
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
  //console.log("query" +  conteo2[0].numero);
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
  querydescarga=query+' ORDER BY comuna ASC, zona ASC, puesto ASC ';
  query += ' ORDER BY comuna ASC, zona ASC, puesto ASC LIMIT '+ items +' OFFSET '+ limite;
 
   const usuario = await pool.query(query);
   descargausuarioconsultavista=await pool.query(querydescarga);
   res.render('consultavista/consultavista',{usuario, comuna, zona, puesto, mesa,navegacion,numero});
  
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
console.log(wb);
res.download('votantes.xlsx');
  */

   });
   router.get('/descarga', logeousuario,function(req, res) { 
   

    if(descargausuario!=null){
   
    var ws = XLSX.utils.json_to_sheet(descargausuario);
    // var csv= XLSX.utils.sheet_to_csv(data);
    
     var wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, ws, "People");
    
    
    XLSX.writeFile(wb, "resultadovotantes.xlsx");
    console.log(wb);
    res.download('resultadovotantes.xlsx');
    
   // XLSX.remove();
  
  }else{
     
      if(typeof XLSX == 'undefined') XLSX = require('xlsx');
      var ws = XLSX.utils.json_to_sheet(descargausuarioconsultavista);
      // var csv= XLSX.utils.sheet_to_csv(data);
      
       var wb = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "People");
      
      
      XLSX.writeFile(wb, "resultadovotantes.xlsx");
      console.log(wb);
      res.download('resultadovotantes.xlsx');

    }
});

router.post('/cedula',logeousuario,async(req, res)=>{ 
  const {cedula} = req.body; 
     if(cedula==''){
        req.flash('success','Digite una cedula');
        res.redirect('/consultavista/');
        //ensayo
       
     }else{
         const usuario = await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
         //usuariocedula= await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
          if(usuario==''){
            req.flash('success','No se encontraron coincidencias');
            res.redirect('/consultavista/');
          }else{
            //console.log('success','La cedula existe');
          res.render('consultavista/cedula',{usuario });
          //res.render('consultavista/',{usuario});
          }
  
      }  
     
});

router.get('/cedula',logeousuario,async(req, res)=>{ 
  
  res.redirect('/consultavista/');
});

 module.exports = router;
