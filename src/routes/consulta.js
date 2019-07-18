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
//require('geckodriver');

const {Builder, By, Key, until} = require('selenium-webdriver');

async function example(CEDULA) {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
      await driver.get('https://www.procuraduria.gov.co/CertWEB/Certificado.aspx');
      
     // await driver.findElement(By.id('txtRespuestaPregunta')).sendKeys('cali');
    
     CEDULAPRIMERO = CEDULA.substring(0,3);
 
    
     CEDULAULTIMO = CEDULA.substring(CEDULA.length - 2, CEDULA.length);
   
      await driver.findElement(By.id('txtNumID')).sendKeys(CEDULA)
     var valor =driver.findElement( (By.id('lblPregunta') ));
    
     const html = await driver.getPageSource();
    
     var $ = cheerio.load(html);
     
     if($('#lblPregunta').text() =="¿ Cual es la Capital del Vallle del Cauca?"){
     
      await driver.findElement(By.id('ddlTipoID')).sendKeys('Cédula de ciudadanía');
      await driver.findElement(By.id('txtRespuestaPregunta')).sendKeys('cali');
 
     
    }
    if($('#lblPregunta').text() =="¿ Cual es la Capital de Colombia (sin tilde)?"){
     
      
      await driver.findElement(By.id('ddlTipoID')).sendKeys('Cédula de ciudadanía');
      await driver.findElement(By.id('txtRespuestaPregunta')).sendKeys('bogota');
     }
     
     if($('#lblPregunta').text() =="¿ Cual es la Capital de Antioquia (sin tilde)?"){
      
      await driver.findElement(By.id('ddlTipoID')).sendKeys('Cédula de ciudadanía');
      await driver.findElement(By.id('txtRespuestaPregunta')).sendKeys('medellin');
     
    }
    if($('#lblPregunta').text() =="¿Escriba los tres primeros digitos del documento a consultar?"){
      
      await driver.findElement(By.id('ddlTipoID')).sendKeys('Cédula de ciudadanía');
      await driver.findElement(By.id('txtRespuestaPregunta')).sendKeys(CEDULAPRIMERO);
     
    }
    if($('#lblPregunta').text() =="¿ Cuanto es 2 X 3 ?"){
      
      //await driver.quit();
      //example();
      await driver.findElement(By.id('ddlTipoID')).sendKeys('Cédula de ciudadanía');
      await driver.findElement(By.id('txtRespuestaPregunta')).sendKeys('6');
    }
    if($('#lblPregunta').text() =="¿ Cuanto es 5 + 3 ?"){
     
      //await driver.quit();
      //example();
      await driver.findElement(By.id('ddlTipoID')).sendKeys('Cédula de ciudadanía');
      await driver.findElement(By.id('txtRespuestaPregunta')).sendKeys('8');
    }
    if($('#lblPregunta').text() =="¿ Cuanto es 3 x 3 ?"){
      
      //await driver.quit();
      //example();
      await driver.findElement(By.id('ddlTipoID')).sendKeys('Cédula de ciudadanía');
      await driver.findElement(By.id('txtRespuestaPregunta')).sendKeys('9');
    }
    if($('#lblPregunta').text() =="¿Escriba los dos ultimos digitos del documento a consultar?"){
      
       await driver.findElement(By.id('ddlTipoID')).sendKeys('Cédula de ciudadanía');
      await driver.findElement(By.id('txtRespuestaPregunta')).sendKeys(CEDULAULTIMO);
    }
    if($('#lblPregunta').text() =="¿ Cual es la Capital del Atlantico?"){
     
      await driver.findElement(By.id('ddlTipoID')).sendKeys('Cédula de ciudadanía');
      await driver.findElement(By.id('txtRespuestaPregunta')).sendKeys('barranquilla');
    }
    if($('#lblPregunta').text() =="¿Escriba la cantidad de letras del primer nombre de la persona a la cual esta expidiendo el certificado?"){
      
      example(CEDULA);
      
      
  
    }
    if($('#lblPregunta').text() =="¿Cual es el primer nombre de la persona a la cual esta expidiendo el certificado?"){
      
      example(CEDULA);
     
     
    }
    if($('#lblPregunta').text() =="¿Escriba las dos primeras letras del primer nombre de la persona a la cual esta expidiendo el certificado?"){
      
      example(CEDULA);
      
     
    }
  
    await driver.findElement(By.id('btnConsultar')).click();
    
     
   
      
    

    } finally {
      const html = await driver.getPageSource();
    
      var $ = cheerio.load(html);
      
      if($('.datosConsultado').text()!=''){
        NOMBRE_PERSONA={
          PRIMER_NOMBRE:$('.datosConsultado').find("span:nth-child(1)").text(),
          SEGUNDO_NOMBRE:$('.datosConsultado').find("span:nth-child(2)").text(),
          PRIMER_APELLIDO:$('.datosConsultado').find("span:nth-child(3)").text(),
          SEGUNDO_APELLIDO:$('.datosConsultado').find("span:nth-child(4)").text()
        }
        console.log("primer nombre");
        console.log(($('.datosConsultado').find("span:nth-child(1)").text()))
        console.log("segundo nombre");
        console.log(($('.datosConsultado').find("span:nth-child(2)").text()))
        console.log("primer apellido");
        console.log(($('.datosConsultado').find("span:nth-child(3)").text()))
        console.log("segundo apellido");
        console.log(($('.datosConsultado').find("span:nth-child(4)").text()))
      }
      await driver.quit();
     // await driver.quit();
    }
  };
//https://www.procuraduria.gov.co/CertWEB/Certificado.aspx?tpo=1
//https://www.sisben.gov.co/atencion-al-ciudadano/Paginas/consulta-del-puntaje.aspx

  /*
request.post('https://wsp.registraduria.gov.co/censo/consultar/', { 

  form: { nuip: '1107071154' }}, (err, res, body) => {
  var $ = cheerio.load(body);

  var lugar=$('.table').find("td:nth-child(4)").text().slice(0, -28);
  var direccion=$('.table').find("td:nth-child(5)").text().slice(0, -28);
  var mesa=$('.table').find("td:nth-child(6)").text().slice(0, -33);


 
 
  }); 

  request.post('https://wsp.registraduria.gov.co/censo/consultar/',(err, res, body)=> {
    let $ = cheerio.load(body);
    $("form[name=form]")='5455';
    form: { FormattedLocation: '1107071154' }
   
//var x = $("input[name=FormattedLocation]").text();
  //  var y = $("input[name=FormattedLocation]").next().attr('type');

    //form: { FormattedLocation: '1107071154' }

    

    //code to click button and get the page it goes to goes here
});*/
function myFunction() {
  document.getElementById("demo").innerHTML = "Hello World";
}



//consulta cedula    
router.post('/cedula',logeosuper,async(req, res)=>{ 
  const {cedula} = req.body; 
     if(cedula==''){
        req.flash('success','Digite una cedula');
        res.redirect('/consulta/');
        //ensayo
      }else{
         const usuario = await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
         //usuariocedula= await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
          if(usuario==''){
            req.flash('success','No se encontraron coincidencias');
            res.redirect('/consulta/');
          }else{
            res.render('consulta/cedula',{usuario });
          }
  
      }  
     
});

router.get('/cedula',logeosuper,async(req, res)=>{ 
  res.redirect('/consulta/');
});


//edictar
router.get('/edictar/:cedula',logeosuper,async(req, res)=>{   
  const {cedula} = req.params;
  glovalcedula =req.params.cedula;
  const usuario= await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
  res.render('consulta/edictar.hbs',{usuario });  
});

router.post('/edictar/:cedula',logeosuper,async(req, res)=>{   
  
  //------------edictar lo que hay que acomodar
    const {cedula, telefono, correo, comuna, zona,  puesto,mesa, cc_lider_funcionario} = req.body;
      //casos en mayusculas
    var{ nombre_completo, nombre_del_puesto,direccion}= req.body
      //casos es mayusculas
     
      
    CEDULA=cedula;
    //example(CEDULA);
   
    
    
    if(nombre_completo!=''){
     
      nombre_completo=nombre_completo.toUpperCase();
    }
    if(nombre_del_puesto!=''){
     
         nombre_del_puesto=nombre_del_puesto.toUpperCase();
    }
    request.post('https://wsp.registraduria.gov.co/censo/consultar/', { 
      // 1107071154    66946183
       form: { nuip: CEDULA }},async (err, ress,body) => {
         var $ = cheerio.load(body);
  
         var workbook = XLSX.readFile(path.join(process.cwd())+'/src/assets/DIVIPOL_DEFINITIVA.xlsx', {sheetStubs: true}); 
   
         var sheet_name_list = workbook.SheetNames;
        
         var regis_direccion=$('.table').find("td:nth-child(5)").text().slice(0, -28).replace(/u00d1/, "Ñ");
         var regis_mesa=$('.table').find("td:nth-child(6)").text().slice(0, -33);
         var regis_lugar=$('.table').find("td:nth-child(4)").text().slice(0, -28).replace(/u00d1/, "Ñ");
       
        
         regis_lugarbool=false;
        
         divipol=(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
         
        if(regis_lugar!=''){
        
        for(var i=0;i<divipol.length;i++){
         
           if(regis_lugar==divipol[i].nombre_del_puesto){
           
              regis_lugarbool=true;
              const nuevousuario={
              cedula,
              nombre_completo ,
              direccion:regis_direccion,   
              telefono,
              correo,
              comuna:divipol[i].comuna,
              zona:divipol[i].zona,
              nombre_del_puesto:regis_lugar,
              puesto:divipol[i].puesto,
              mesa:regis_mesa,
              cc_lider_funcionario
             }
           
           //lol
  
           if(nuevousuario.cedula==''){
            req.flash('success','Digite una cedula');
            res.redirect('/consulta/edictar/'+glovalcedula);
              }else{
                if(nuevousuario.cedula==glovalcedula){         
                  await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
                  
                  req.flash('success','Modificación completa');
                  res.redirect('/consulta');
                }else{    
                  const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+nuevousuario.cedula);
                    
                        if(verificarusuario==''){
                        await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
                        req.flash('success','Modificación completa');
                        res.redirect('/consulta');
                      
                      }else{
                        req.flash('success','Ya existe la cedula ERROR');
                        res.redirect('/consulta');   
                      }
                }
              }
            }
      }
  
      
      }else{
     //fuera del for
  
     const nuevousuario={
      cedula,
      nombre_completo,
      direccion:0,   
      telefono:0,
      correo:0,
      comuna:0,
      zona:0,
      nombre_del_puesto:0,
      puesto:0,
      mesa:0,
      cc_lider_funcionario
      }
      if(nuevousuario.cedula==''){
        req.flash('success','Digite una cedula');
        res.redirect('/consulta/edictar/'+glovalcedula);
      }else{
        if(nuevousuario.cedula==glovalcedula){         
          await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
          req.flash('success','Modificación completa');
          res.redirect('/consulta');
        }else{    
          const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+nuevousuario.cedula);
             
                if(verificarusuario==''){
                await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
                req.flash('success','Modificación completa');
                res.redirect('/consulta');
              
              }else{
                req.flash('success','Ya existe la cedula ERROR');
                res.redirect('/consulta');   
              }
        }
      }
    }
    
  if(regis_lugarbool==false){
  
    const nuevousuario={
      cedula,
      nombre_completo ,
      direccion:regis_direccion,   
      telefono,
      correo,
      comuna,
      zona,
      nombre_del_puesto:regis_lugar,
      puesto,
      mesa:regis_mesa,
      cc_lider_funcionario
     }
    
    if(nuevousuario.cedula==''){
      req.flash('success','Digite una cedula');
      res.redirect('/consulta/edictar/'+glovalcedula);
    }else{
      if(nuevousuario.cedula==glovalcedula){         
        await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
        req.flash('success','Modificación completa');
        res.redirect('/consulta');
      }else{    
        const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+nuevousuario.cedula);
           
              if(verificarusuario==''){
              await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
              req.flash('success','Modificación completa');
              res.redirect('/consulta');
            
            }else{
              req.flash('success','Ya existe la cedula ERROR');
              res.redirect('/consulta');   
            }
      }
    }
  }
  
  }); 
     
  });




  
//crear usuario
router.post('/crear',logeosuper,async(req, res)=>{   
  var {cedula, telefono, correo, comuna, zona,  puesto,mesa, cc_lider_funcionario} = req.body;
    //casos en mayusculas
  var{ nombre_completo, nombre_del_puesto,direccion}= req.body
  if(comuna==''){comuna=null;};
  if(zona==''){zona=null;};
  if(puesto==''){puesto=null;};
  if(mesa==''){mesa=null;};
  if(cc_lider_funcionario==''){cc_lider_funcionario=null;};
  if(comuna==''){comuna=null;};
    //casos es mayusculas
   
    
  CEDULA=cedula;
  //example(CEDULA);
 
  if(nombre_completo!=''){
   
    nombre_completo=nombre_completo.toUpperCase();
  }
  if(nombre_del_puesto!=''){
   
       nombre_del_puesto=nombre_del_puesto.toUpperCase();
  }
  request.post('https://wsp.registraduria.gov.co/censo/consultar/', { 
    // 1107071154    66946183
     form: { nuip: CEDULA }},async (err, ress,body) => {
       var $ = cheerio.load(body);

       var workbook = XLSX.readFile(path.join(process.cwd())+'/src/assets/DIVIPOL_DEFINITIVA.xlsx', {sheetStubs: true}); 
 
       var sheet_name_list = workbook.SheetNames;
      
       var regis_direccion=$('.table').find("td:nth-child(5)").text().slice(0, -28).replace(/u00d1/, "Ñ");
       var regis_mesa=$('.table').find("td:nth-child(6)").text().slice(0, -33);
       var regis_lugar=$('.table').find("td:nth-child(4)").text().slice(0, -28).replace(/u00d1/, "Ñ");
      
      
       regis_lugarbool=false;
      
        divipol=(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
       
      if(regis_lugar!=''){
    
      for(var i=0;i<divipol.length;i++){
       
         if(regis_lugar==divipol[i].nombre_del_puesto){
         
             regis_lugarbool=true;
            const nuevousuario={
            cedula,
            nombre_completo ,
            direccion:regis_direccion,   
            telefono,
            correo,
            comuna:divipol[i].comuna,
            zona:divipol[i].zona,
            nombre_del_puesto:regis_lugar,
            puesto:divipol[i].puesto,
            mesa:regis_mesa,
            cc_lider_funcionario
           }
         
          if(nuevousuario.cedula!=''){
         
            const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+nuevousuario.cedula);
            
            if(verificarusuario==''){
            await pool.query('INSERT INTO persona set ?',[nuevousuario]);
            req.flash('success','Guardado');
            res.redirect('/consulta');
            }else{
            req.flash('success','La cedula ya está registrada');
            res.redirect('/consulta/crear');
            }}else{
            req.flash('success','Digite una cedula');
            res.redirect('/consulta/crear');
            };
         }
      }
    }else{
   //fuera del for

   const nuevousuario={
    cedula,
    nombre_completo,
    direccion,   
    telefono,
    correo,
    comuna,
    zona,
    nombre_del_puesto,
    puesto,
    mesa,
    cc_lider_funcionario
    }

  if(nuevousuario.cedula!=''){

    const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+nuevousuario.cedula);
    
    if(verificarusuario==''){
    await pool.query('INSERT INTO persona set ?',[nuevousuario]);
    req.flash('success','Guardado');
    res.redirect('/consulta');
    }else{
    req.flash('success','La cedula ya está registrada');
    res.redirect('/consulta/crear');
    }}else{
    req.flash('success','Digite una cedula');
    res.redirect('/consulta/crear');
    };

  }
  
if(regis_lugarbool==false){

  const nuevousuario={
    cedula,
    nombre_completo ,
    direccion:regis_direccion,   
    telefono,
    correo,
    comuna,
    zona,
    nombre_del_puesto:regis_lugar,
    puesto,
    mesa:regis_mesa,
    cc_lider_funcionario
   }

  if(nuevousuario.cedula!=''){
  
    const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+nuevousuario.cedula);
    
    if(verificarusuario==''){
    await pool.query('INSERT INTO persona set ?',[nuevousuario]);
    req.flash('success','Guardado');
    res.redirect('/consulta');
    }else{
    req.flash('success','La cedula ya está registrada');
    res.redirect('/consulta/crear');
    }}else{
    req.flash('success','Digite una cedula');
    res.redirect('/consulta/crear');
    };

}


}); 
  
    
});
router.get('/crear',logeosuper,async(req, res)=>{ 
   res.render('consulta/crear.hbs'); 
});

router.get('/archivo',logeosuper,async(req, res)=>{ 
 res.render('consulta/archivo.hbs');
});

router.post('/archivo',logeosuper,async(req, res)=>{ 
  
  let EDFile = req.files.file;
  
  EDFile.mv(path.join(process.cwd())+'/src/assets/votantes.xlsx',err => {
    //  if(err) return res.status(500).send({ message : err })
    
      
  });
  res.redirect('listo');
});
/*
router.get('/listo',logeosuper,async(req, res)=>{ 
  
  
  
  var workbook = XLSX.readFile(path.join(process.cwd())+'/src/assets/votantes.xlsx', {sheetStubs: true}); 
 
  var sheet_name_list = workbook.SheetNames;
 

  const user=(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
 
  var celda=1;
  for(var i=0;i<user.length;i++){
  
   
   celda++;
    if(user[i].cedula==null){ 
     
      req.flash('warning','no hay cedula en la celda '+ celda);
     
     }else{
      const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+user[i].cedula);
     
      if(verificarusuario==''){
       
        await pool.query('INSERT INTO persona set ?',[user[i]]);
        req.flash('success2','Guardada la celda ' +celda+' con la cedula '+user[i].cedula+', el nombre ' + user[i].nombre_completo );
       
      }else{
        req.flash('alert','La celda '+celda+ ' con la cedula ' +user[i].cedula+', el nombre '   + user[i].nombre_completo  + ' ya está registrada.');
      
      }
     
      }


    
  

  
  }
  res.redirect('archivo');
    
});
*/

router.get('/listo',logeosuper,async(req, res)=>{ 
  
  
  
  var workbook = XLSX.readFile(path.join(process.cwd())+'/src/assets/votantes.xlsx', {sheetStubs: true}); 
 
  var sheet_name_list = workbook.SheetNames;
 

   user=(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
   


   var workbookk = XLSX.readFile(path.join(process.cwd())+'/src/assets/DIVIPOL_DEFINITIVA.xlsx', {sheetStubs: true}); 
   var sheet_name_listt = workbook.SheetNames;
   divipol=(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
   
    tamano=user.length;
    var celda=1;
    conteo=0;
    tamaño=user.length;
  for(i=0;i<user.length;i++){
   
  celda++;
  conteo++;
   
   formulario(i,user[i],req,res,celda,user.length,conteo);
   conte(user.length);
  }
 
 
});

async function conte(tamaño){
  grande=tamaño;
}

async function formulario(i,users,req,res,celda,tamaño,con){
  t=0;
request.post('https://wsp.registraduria.gov.co/censo/consultar/', { 
    // 1107071154    66946183
    
     form: { nuip: users.cedula }},async (err, ress,body) => {
       if(err){
        req.flash('warning','demora muycho ');
       }
       
       var $ = cheerio.load(body);
      
    var regis_direccion=$('.table').find("td:nth-child(5)").text().slice(0, -28).replace(/u00d1/, "ñ");
    var regis_mesa=$('.table').find("td:nth-child(6)").text().slice(0, -33);
    var regis_lugar=$('.table').find("td:nth-child(4)").text().slice(0, -28).replace(/u00d1/, "Ñ");
   
    
    var workbookk = XLSX.readFile(path.join(process.cwd())+'/src/assets/DIVIPOL_DEFINITIVA.xlsx', {sheetStubs: true}); 
    var sheet_name_listt = workbookk.SheetNames;
    divipol=(XLSX.utils.sheet_to_json(workbookk.Sheets[sheet_name_listt[0]]));
    
    for(var t=0;t<divipol.length;t++){
 
     if(regis_lugar!=''){
      if(regis_lugar==divipol[t].nombre_del_puesto){
     
     
      if(divipol[i].zona!='' ){
        users.zona=divipol[t].zona;
       }
      if(divipol[i].puesto!=''){
        users.puesto=divipol[t].puesto;
      }
      if(divipol[i].comuna!=''){
        users.comuna=divipol[t].comuna;
      }
     
     
        }
      }
    
    }
    
   
     if(users.cedula==null){ 
   
      req.flash('warning','no hay cedula en la celda '+ celda);
     
     }else{
      const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+users.cedula);
     
      if(verificarusuario==''){

        if(users.nombre_del_puesto==null){
         
         users.nombre_del_puesto=regis_lugar;
         
        }
        if(users.mesa==null){
         
          users.mesa=regis_mesa;
          
         }
         if(users.direccion==null){
         
          users.direccion=regis_direccion;
          
         }
        
       
        //cambio a mayusculas
        if(users.nombre_completo!=null){
          users.nombre_completo=users.nombre_completo.toUpperCase();
        }
         if(users.telefono!=null){
          
          users.telefono=users.telefono;
        }
        if(users.nombre_del_puesto!=null){
          users.nombre_del_puesto=users.nombre_del_puesto.toUpperCase();
        }
        if(users.direccion!=null){
          users.direccion=users.direccion.toUpperCase();
        }
    
        
     
        await pool.query('INSERT INTO persona set ?',[users]);
        req.flash('success2','Guardada la celda ' +celda+' con la cedula '+users.cedula+', el nombre ' + users.nombre_completo );
        
      }else{
        req.flash('alert','La celda '+celda+ ' con la cedula ' +users.cedula+', el nombre '   + users.nombre_completo  + ' ya está registrada.');
      
      }
     
      
      }

     
 
    if(0<=grande){
      grande--;
   
    }
    
    if(grande==0){
      req.flash('success','Terminado');
      res.redirect('archivo');
      grande=tamaño;
    }
     
   
    
    });
 

}



router.get('/borrar/:cedula',logeosuper,async(req, res)=>{  
  const {cedula} = req.params;
  await pool.query('DELETE FROM persona WHERE cedula='+cedula);
  res.redirect('/consulta/');
});

router.get('/borrar/opcion/:cedula',logeosuper,async(req, res)=>{  
  const {cedula} = req.params;
  const usuario= await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
  nombre_completo =usuario[0].nombre_completo;
  res.render('consulta/borrar.hbs',{cedula,nombre_completo }); 

});



router.get('/',logeosuper,async(req, res)=>{  
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
   res.render('consulta/consulta',{usuario, comuna, zona, puesto, mesa,navegacion,numero});
  
});


router.post('/',logeosuper, async(req, res)=>{
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
  res.render('consulta/consulta',{usuario, comuna, zona, puesto, mesa,navegacion,numero});
  
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
   router.get('/descarga', logeosuper,function(req, res) { 
   

    if(descargausuario!=null){
   
    var ws = XLSX.utils.json_to_sheet(descargausuario);
    // var csv= XLSX.utils.sheet_to_csv(data);
    
    var wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, ws, "People");
    
    XLSX.writeFile(wb, "resultadovotantes.xlsx");
    
    res.download('resultadovotantes.xlsx');
    
   // XLSX.remove();
  
  }else{
     
      if(typeof XLSX == 'undefined') XLSX = require('xlsx');
      var ws = XLSX.utils.json_to_sheet(descargausuarioconsulta);
      // var csv= XLSX.utils.sheet_to_csv(data);
      
      var wb = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "People");
           
      XLSX.writeFile(wb, "resultadovotantes.xlsx");
     
      res.download('resultadovotantes.xlsx');

    }
});
  

 module.exports = router;
