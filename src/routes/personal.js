const express =require('express');
const router = express.Router();
const pool = require('../database');
//pagina consulta
const { logeosuper } = require('../lib/auth');
const FileSaver = require('file-saver');
const request = require('request');
const cheerio = require('cheerio');
const XLSX =require('xlsx');
const path =require('path')



//edictar
router.get('/edictar/:cedula',logeosuper,async(req, res)=>{   
    const {cedula} = req.params;
    glovalcedula =req.params.cedula;
    const usuario= await pool.query('SELECT * FROM gestores WHERE cedula='+cedula);
    const gestor = await pool.query('SELECT * FROM gestores WHERE tipo="GESTOR" ORDER BY comuna ASC, nombre_completo ASC');
   // const gestor_cedula = await pool.query('SELECT * FROM gestores WHERE cedula='+cedula);
 
    res.render('personal/edictar.hbs',{usuario,gestor});  
    
  });

  router.post('/edictar/:cedula',logeosuper,async(req, res)=>{   
    const {cedula, telefono,correo,tipo,comuna,zona, puesto, numero_votos,gestor_cedula} = req.body;
    var{ nombre_completo, nombre_del_puesto}= req.body
    //casos es mayusculas
    nombre_completo=nombre_completo.toUpperCase();
    nombre_del_puesto=nombre_del_puesto.toUpperCase();
   
    
    const nuevousuario={
          cedula,
          nombre_completo ,
          telefono,
          correo,
          tipo,
          comuna,
          zona,
          puesto,
          nombre_del_puesto,
          numero_votos,
          gestor_cedula
        
    }
    if(nuevousuario.cedula==''){
      req.flash('success','Digite una cedula');
      res.redirect('/personal/edictar/'+glovalcedula);
    }else{
      if(nuevousuario.cedula==glovalcedula){         
        await pool.query('UPDATE gestores SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
        req.flash('success','Modificación completa');
        res.redirect('/personal');
      }else{    
        const verificarusuario = await pool.query('SELECT * FROM gestores WHERE cedula='+nuevousuario.cedula);
           
              if(verificarusuario==''){
              await pool.query('UPDATE gestores SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
              await pool.query('UPDATE persona SET cc_lider_funcionario='+nuevousuario.cedula+'  WHERE cc_lider_funcionario='+glovalcedula);
              await pool.query('UPDATE persona SET cedula='+nuevousuario.cedula+'  WHERE cedula='+glovalcedula);
              req.flash('success','Modificación completa');
              res.redirect('/personal');
             
            }else{
              req.flash('success','Ya existe la cedula ERROR');
              res.redirect('/personal');   
            }
      }
    }
  });

  router.get('/borrar/:cedula',logeosuper,async(req, res)=>{  
    const {cedula} = req.params;
    await pool.query('DELETE FROM gestores WHERE cedula='+cedula);
    res.redirect('/personal/');
  });

  router.get('/borrar/opcion/:cedula',logeosuper,async(req, res)=>{  
    const {cedula} = req.params;
    const usuario= await pool.query('SELECT * FROM gestores WHERE cedula='+cedula);
    nombre_completo =usuario[0].nombre_completo;
    res.render('personal/borrar.hbs',{cedula,nombre_completo }); 
  });

//crear
  router.get('/crear',logeosuper,async(req, res)=>{ 
    const gestor = await pool.query('SELECT * FROM gestores WHERE tipo="GESTOR" ORDER BY comuna ASC, nombre_completo ASC');
    res.render('personal/crear.hbs',{gestor}); 
   });

   router.post('/crear',logeosuper,async(req, res)=>{   
    var {cedula, telefono,correo,tipo,comuna,zona, puesto, numero_votos, gestor_cedula} = req.body;
    
    var{ nombre_completo, nombre_del_puesto}= req.body
   
    // toca que hacer esto porque en el servidor no sirve mandarlo en comillas
     if(comuna==''){comuna=null;};
     if(zona==''){zona=null;};
     if(puesto==''){puesto=null;};    
     if(numero_votos==''){numero_votos=null;};     
     if(gestor_cedula==''){gestor_cedula=null;};
                 
      //casos es mayusculas
      

    if(nombre_completo!=null){
      nombre_completo=nombre_completo.toUpperCase();
    }
    if(nombre_del_puesto!=null){
      nombre_del_puesto=nombre_del_puesto.toUpperCase();
    }
    
    const nuevousuario={
          cedula,
          nombre_completo ,
          telefono,
          correo,
          tipo,
          comuna,
          zona,
          puesto,
          nombre_del_puesto,
          numero_votos,
          gestor_cedula
    

    }
        
     if(nuevousuario.cedula!=''){
     
      const verificarusuario = await pool.query('SELECT * FROM gestores WHERE cedula='+nuevousuario.cedula);
     
      if(verificarusuario==''){
        await pool.query('INSERT INTO gestores set ?',[nuevousuario]);
        req.flash('success','Guardado');
        res.redirect('/personal');
      }else{
        req.flash('success','la cedula ya esta registrada');
        res.redirect('/personal/crear');
      }
        
     }else{
      req.flash('success','Digite una cedula');
      res.redirect('/personal/crear');
      };
     
  });
 
  router.get('/archivo',logeosuper,async(req, res)=>{ 
    res.render('personal/archivo.hbs');
  });
   router.post('/archivo',logeosuper,async(req, res)=>{ 
     let EDFile = req.files.file;
        
     EDFile.mv(path.join(process.cwd())+'/src/assets/'+EDFile.name,err => {
       //  if(err) return res.status(500).send({ message : err })
       
         res.redirect('listo');
     });
   });
   
   router.get('/listo',logeosuper,async(req, res)=>{ 
     var workbook = XLSX.readFile(path.join(process.cwd())+'/src/assets/personal.xlsx', {sheetStubs: true}); 
    
     var sheet_name_list = workbook.SheetNames;
     
     const user=(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
    
     var celda=1;
     for(var i=0;i<user.length;i++){
      celda++;
  
       if(user[i].cedula==null){ 
         req.flash('warning','no hay cedula en la celda' +celda);
        
        }else{
         const verificarusuario = await pool.query('SELECT * FROM gestores WHERE cedula='+user[i].cedula);
          
         if(verificarusuario==''){
           await pool.query('INSERT INTO gestores set ?',[user[i]]);
           req.flash('success2','Guardada la celda ' +celda+' con la cedula '+user[i].cedula+', el nombre ' + user[i].nombre_completo );
          
         }else{
           req.flash('alert','La celda ' + celda+ ' con la cedula ' +user[i].cedula+', el nombre '   + user[i].nombre_completo  + ' ya está registrada.');
         }
        
         }
   
     
     }
     res.redirect('archivo');
        
   });
   
   
 router.get('/',logeosuper,async(req, res)=>{  
  const items=8;
  const page = req.body.page|| 1;
  var numero;
  var limite = (page-1)  * items;
  const tipo = (req.body.tipo);
  const comuna = (req.body.comuna);
  const zona = (req.body.zona);
  const puesto = (req.body.puesto);
  const nombre_del_puesto = (req.body.nombre_del_puesto);
  

  const conteo= await pool.query('SELECT count(*) as numero FROM gestores ');
  
  numero=conteo[0].numero;
   pages=Math.ceil(conteo[0].numero/items);

   var navegacion={
    page: parseInt(page),
    pages,
    items,
    limite,
    der:parseInt(page)+ 1,
    izq:parseInt(page)-1
   }
 
   const usuario= await pool.query('SELECT * FROM gestores   ORDER BY tipo ASC, nombre_completo ASC LIMIT '+ items +' OFFSET '+ limite);
   const usuarioconteo= await pool.query('SELECT * FROM gestores  ');
   descargausuario= await pool.query('SELECT * FROM gestores  ORDER BY tipo ASC, nombre_completo' );
   
 
   for(var i=0;i<usuarioconteo.length;i++){
    let query='SELECT count(*) as numero FROM  persona WHERE persona.cc_lider_funcionario='+usuarioconteo[i].cedula;
    const numeroconteo= await pool.query(query);
   
    reportenull(usuarioconteo[i]);
    reporte(usuarioconteo[i],numeroconteo[0].numero);

   }
   
   res.render('personal/personal',{usuario,navegacion,tipo,comuna,zona,puesto,numero});

  });
  async function reportenull(usuario){
    if(usuario.reporte==null){
       usuario.reporte=0;
       await pool.query('UPDATE gestores SET ? WHERE cedula=?',[usuario,usuario.cedula]);
    }
  }
  async function reporte(usuario,numeroconteo){
    
    if(usuario.reporte!=numeroconteo){ 
      usuario.reporte=numeroconteo;
      await pool.query('UPDATE gestores SET ? WHERE cedula=?',[usuario,usuario.cedula]);
    }

  }

  
  router.post('/',logeosuper,async(req, res)=>{ 
    
    const tipo = (req.body.tipo) ;
    var numero;
    const items=8;
    const page = req.body.page|| 1;
    const comuna =(req.body.comuna);
    const zona = (req.body.zona);
    const puesto = (req.body.puesto);
    const nombre_del_puesto = (req.body.nombre_del_puesto);
    
    var limite = (page-1)  * items;
  
    
   let firstQexecc = false;
    
   let queryy = ' SELECT count(*) as numero FROM gestores '
  // queryy += '  ' 
   if(tipo|| comuna|| zona|| puesto){

     queryy += ' WHERE'
    if (tipo ){
      
      queryy += '  tipo = "' +tipo+'"';
      firstQexecc = true;
      }
      if (comuna){
        if(firstQexecc) queryy+= ' AND ';
        queryy += ' comuna = ' + comuna;
        firstQexecc = true;
      }
      if (zona){
        if(firstQexecc) queryy+= ' AND ';
        queryy += ' zona = ' + zona;
       
      }
      if (puesto){
        if(firstQexecc) queryy+= ' AND ';
        queryy += ' puesto = ' + puesto;
  
      }
     }
      queryy += ' ORDER BY tipo ASC, nombre_completo '
     
     

   const conteo= await pool.query(queryy);
    numero=conteo[0].numero;
     pages=Math.ceil(conteo[0].numero/items);
  
     var navegacion={
      page: parseInt(page),
      pages,
      items,
      limite,
      der:parseInt(page)+ 1,
      izq:parseInt(page)-1
     }


    let firstQexec= false;;
    let query = ' SELECT * FROM gestores  ';
    let querydescarga='SELECT * FROM persona';
   if(tipo|| comuna|| zona|| puesto){
    descargausuario=null;

     query += ' WHERE'
    if (tipo ){
      
      query += '  tipo = "' +tipo+'"';
      firstQexec = true;
      }
      if (comuna){
        if(firstQexec) query+= ' AND ';
        query += ' comuna = ' + comuna;
        firstQexec = true;
      }
      if (zona){
        if(firstQexecc) query+= ' AND ';
        query += ' zona = ' + zona;
        firstQexecc = true;
      }
      if (puesto){
        if(firstQexecc) query+= ' AND ';
        query += ' puesto = ' + puesto;
        firstQexecc = true;
      }
   
   }
    
   query +=  ' ORDER BY tipo ASC, nombre_completo ';
   querydescarga=query+ ' ';
   query  += '  LIMIT '+ items +' OFFSET '+ limite;
    
   const usuario = await pool.query(query) ;
   descargausuarioconsulta=await pool.query(querydescarga);
   res.render('personal/personal',{usuario,page,navegacion,tipo,comuna,zona,puesto,numero});


  });
  router.get('/descarga', logeosuper,function(req, res) { 
   
    if(descargausuario!=null){
    if(typeof XLSX == 'undefined') XLSX = require('xlsx');
    var ws = XLSX.utils.json_to_sheet(descargausuario);
    // var csv= XLSX.utils.sheet_to_csv(data);
    
     var wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, ws, "People");
    
    
    XLSX.writeFile(wb, "resultadopersonal.xlsx");
    
    res.download('resultadopersonal.xlsx');}
    else{
      if(typeof XLSX == 'undefined') XLSX = require('xlsx');
      var ws = XLSX.utils.json_to_sheet(descargausuarioconsulta);
          
      var wb = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "People");
            
      XLSX.writeFile(wb, "resultadopersonal.xlsx");
      
      res.download('resultadopersonal.xlsx');

    }
});
  

  router.post('/cedula',logeosuper,async(req, res)=>{ 
    const {cedula} = req.body; 
       if(cedula==''){
          req.flash('success','Digite una cedula');
          res.redirect('/personal/');
          //ensayo
          
       }else{
           const usuario = await pool.query('SELECT * FROM gestores WHERE cedula='+cedula);
            if(usuario==''){
              req.flash('success','No se encontraron coincidencias');
              res.redirect('/personal/');
            }else{
              res.render('personal/cedula',{usuario });
            //res.render('consulta/',{usuario});
            }
    
        }  
       
  });
  
  router.get('/cedula',logeosuper,async(req, res)=>{ 
    res.redirect('/personal/');
  });

    router.get('/edictarpersona/:cedula',logeosuper,async(req, res)=>{   
      const {cedula} = req.params;
      glovalcedula =req.params.cedula;
      const usuario= await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
      res.render('personal/edictarpersona.hbs',{usuario });  
      
    });
    
    router.post('/edictarpersona/:cedula',logeosuper,async(req, res)=>{   
  
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
            
              //regis_lugarbool=false;
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
               
               
      
               if(nuevousuario.cedula==''){
                req.flash('success','Digite una cedula');
                res.redirect('/personal/lista/'+cc_lider_funcionario);
                //res.redirect('/consulta/edictar/'+glovalcedula);
                  }else{
                    if(nuevousuario.cedula==glovalcedula){         
                      await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
                      req.flash('success','Modificación completa');
                      res.redirect('/personal/lista/'+cc_lider_funcionario);
                      //res.redirect('/consulta');
                    }else{    
                      const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+nuevousuario.cedula);
                        
                            if(verificarusuario==''){
                            await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
                            req.flash('success','Modificación completa');
                            res.redirect('/personal/lista/'+cc_lider_funcionario);
                            //res.redirect('/consulta');
                            }else{
                            req.flash('success','Ya existe la cedula ERROR');
                            res.redirect('/personal/lista/'+cc_lider_funcionario);
                            //res.redirect('/consulta');   
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
            res.redirect('/personal/lista/'+cc_lider_funcionario);
            //res.redirect('/consulta/edictar/'+glovalcedula);
          }else{
            if(nuevousuario.cedula==glovalcedula){         
              await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
              req.flash('success','Modificación completa');
              res.redirect('/personal/lista/'+cc_lider_funcionario);
              //res.redirect('/consulta');
            }else{    
              const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+nuevousuario.cedula);
                 
                    if(verificarusuario==''){
                    await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
                    req.flash('success','Modificación completa');
                    res.redirect('/personal/lista/'+cc_lider_funcionario);
                    //res.redirect('/consulta');
                  
                  }else{
                    req.flash('success','Ya existe la cedula ERROR');
                    res.redirect('/personal/lista/'+cc_lider_funcionario);
                    //res.redirect('/consulta');   
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
          res.redirect('/personal/lista/'+cc_lider_funcionario);
          //res.redirect('/consulta/edictar/'+glovalcedula);
        }else{
          if(nuevousuario.cedula==glovalcedula){         
            await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
            req.flash('success','Modificación completa');
            res.redirect('/personal/lista/'+cc_lider_funcionario);
            //res.redirect('/consulta');
          }else{    
            const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+nuevousuario.cedula);
               
                  if(verificarusuario==''){
                  await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
                  req.flash('success','Modificación completa');
                  res.redirect('/personal/lista/'+cc_lider_funcionario);
                 // res.redirect('/consulta');
                
                }else{
                  req.flash('success','Ya existe la cedula ERROR');
                  res.redirect('/personal/lista/'+cc_lider_funcionario);
                  //res.redirect('/consulta');   
                }
          }
        
        }
      
      }
      
      
      }); 
            
      
      
      });





    router.get('/edictarpersonagestor/:cedula',logeosuper,async(req, res)=>{   
      const {cedula} = req.params;
      glovalcedula =req.params.cedula;
      const usuario= await pool.query('SELECT * FROM persona WHERE cedula='+cedula);
      res.render('personal/edictarpersonagestor.hbs',{usuario });  
      
    });
    router.post('/edictarpersonagestor/:cedula',logeosuper,async(req, res)=>{   
      const {cedula, telefono, correo, comuna, zona, puesto, mesa, cc_lider_funcionario} = req.body;
        var{ nombre_completo, nombre_del_puesto,direccion}= req.body
        //casos es mayusculas
        nombre_completo=nombre_completo.toUpperCase();
        nombre_del_puesto=nombre_del_puesto.toUpperCase();
        direccion=direccion.toUpperCase();
        
        const nuevousuario={
              cedula,
              nombre_completo ,
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
        if(nuevousuario.cedula==''){
          req.flash('success','Digite una cedula');
          res.redirect('/personal/listagestor/'+cc_lider_funcionario);
        }else{
          if(nuevousuario.cedula==glovalcedula){         
            await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
            req.flash('success','Modificación completa');
            res.redirect('/personal/listagestor/'+cc_lider_funcionario);
          }else{    
            const verificarusuario = await pool.query('SELECT * FROM persona WHERE cedula='+nuevousuario.cedula);
               
                  if(verificarusuario==''){
                  await pool.query('UPDATE persona SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
                  req.flash('success','Modificación completa');
                  res.redirect('/personal/listagestor/'+cc_lider_funcionario);
                
                }else{
                  req.flash('success','Ya existe la cedula ERROR');
                  res.redirect('/personal/edictarpersonagestor/'+cc_lider_funcionario);   
                }
          }
        
        }
    });


    router.get('/borrarpersona/:cedula',logeosuper,async(req, res)=>{  
      const {cedula} = req.params;
      var cc_lider_funcionario;
      const usuario = await pool.query('SELECT * FROM  persona WHERE persona.cedula='+cedula);
      
      cc_lider_funcionario=usuario[0].cc_lider_funcionario;
      await pool.query('DELETE FROM persona WHERE cedula='+cedula);
      res.redirect('/personal/lista/'+usuario[0].cc_lider_funcionario);
     
    });
    router.get('/borrarpersona/opcion/:cedula',logeosuper,async(req, res)=>{  
      const {cedula} = req.params;
      var cc_lider_funcionario;
      const usuario = await pool.query('SELECT * FROM  persona WHERE persona.cedula='+cedula);
      
      cc_lider_funcionario=usuario[0].cc_lider_funcionario;
      nombre_completo=usuario[0].nombre_completo;
      res.render('personal/borrarpersona.hbs',{cedula,cc_lider_funcionario,nombre_completo}); 
    
    });
    router.get('/borrarpersona/:cedula',logeosuper,async(req, res)=>{  
      const {cedula} = req.params;
      var cc_lider_funcionario;
     
      const usuario = await pool.query('SELECT * FROM  persona WHERE persona.cedula='+cedula);
      
      cc_lider_funcionario=usuario[0].cc_lider_funcionario;
      await pool.query('DELETE FROM persona WHERE cedula='+cedula);
      res.redirect('/personal/lista/'+usuario[0].cc_lider_funcionario);
     
    });
    router.get('/borrarpersona/opcion/:cedula',logeosuper,async(req, res)=>{  
     
      const {cedula} = req.params;
      var cc_lider_funcionario;
      const usuario = await pool.query('SELECT * FROM  persona WHERE persona.cedula='+cedula);
      
      cc_lider_funcionario=usuario[0].cc_lider_funcionario;
      res.render('personal/borrarpersona.hbs',{cedula,cc_lider_funcionario}); 
    
    });

    router.get('/borrarpersonagestor/:cedula',logeosuper,async(req, res)=>{  
      const {cedula} = req.params;
      var cc_lider_funcionario;
     
      const usuario = await pool.query('SELECT * FROM  persona WHERE persona.cedula='+cedula);
      
      cc_lider_funcionario=usuario[0].cc_lider_funcionario;
      await pool.query('DELETE FROM persona WHERE cedula='+cedula);
      res.redirect('/personal/listagestor/'+usuario[0].cc_lider_funcionario);
     
    });
    router.get('/borrarpersonagestor/opcion/:cedula',logeosuper,async(req, res)=>{  
     
      const {cedula} = req.params;
      var cc_lider_funcionario;
      const usuario = await pool.query('SELECT * FROM  persona WHERE persona.cedula='+cedula);
      
      cc_lider_funcionario=usuario[0].cc_lider_funcionario;
    
      nombre_completo=usuario[0].nombre_completo;
      res.render('personal/borrarpersonagestor.hbs',{cedula,cc_lider_funcionario,nombre_completo}); 
    
    });

    router.get('/lista/:cedula',logeosuper,async(req, res)=>{  
      const {cedula} = req.params;
      const items=5;
      const page = req.body.page|| 1;
      var vista;
    
      const verificausuario  =await pool.query('SELECT *  FROM  gestores WHERE cedula='+cedula);
      
      if(verificausuario[0].tipo=="LIDER ESTRUCTURA" ||verificausuario[0].tipo=="LIDER INDEPENDIENTE" ||verificausuario[0].tipo=="FUNCIONARIO"||(verificausuario[0].tipo=="GESTOR" && verificausuario[0].reporte!=0)){
        let query='SELECT * FROM  persona WHERE persona.cc_lider_funcionario='+cedula +' ORDER BY comuna ASC, zona ASC,  puesto ASC, mesa ASC';
        const usuario  =await pool.query(query);
       
        
        let queryy='SELECT count(*) as numero FROM  persona WHERE persona.cc_lider_funcionario='+cedula;
        const conteo= await pool.query(queryy);
        numero=conteo[0].numero;
        pages=Math.ceil(conteo[0].numero/items);
        usuariolista  =await pool.query(query);
        vista=true;
        
        res.render('personal/lista',{usuario,numero,vista,verificausuario});
      }else{
        

           const usuario=null;
           numero=0;
           usuariolista  =await pool.query(query);
           vista=false;
           res.render('personal/lista',{usuario,vista,numero,verificausuario});
        
       
      }
   
      });
      router.get('/lista1/:cedula',logeosuper,async(req, res)=>{  
        const {cedula} = req.params;
        const items=5;
        const page = req.body.page|| 1;
        var vista;
      
       
         
          const verificausuario  =await pool.query('SELECT *  FROM  gestores WHERE cedula='+cedula);
         
          if(verificausuario[0].tipo=="GESTOR" ){

            let query='SELECT * FROM  gestores WHERE comuna='+'"'+verificausuario[0].comuna+'" AND gestor_cedula='+cedula+' ORDER BY tipo ASC, nombre_completo ASC';
            
            const usuario  =await pool.query(query);
            if(usuario==''){
              //gestor que comparte sus  lideres con otros gestores
              let query='SELECT * FROM  gestores WHERE comuna='+'"'+verificausuario[0].comuna+'" '+' ORDER BY tipo ASC, nombre_completo ASC';
              
              const usuario  =await pool.query(query);
              let queryy='SELECT count(*) as numero FROM  gestores WHERE comuna='+'"'+verificausuario[0].comuna+'"'+' ORDER BY tipo ASC, nombre_completo ASC';
            const conteo= await pool.query(queryy);
            numero=conteo[0].numero;
             pages=Math.ceil(conteo[0].numero/items);
             usuariolista  =await pool.query(query);
             
            
             const usuarioreporte  =await pool.query(query);
              var reportecomuna=0;
             for(var i=0;i<usuarioreporte.length;i++){
              
              reportecomuna=reportecomuna+usuarioreporte[i].reporte;
          
            
             }
             // en total numero
             var numerototal=numero;
             var reportecomunatotal=reportecomuna;
            
          //conteo por separado
//funcionario


const conte_funcionario  =await pool.query('SELECT count(*) as numero FROM  gestores WHERE tipo="FUNCIONARIO" AND comuna='+'"'+verificausuario[0].comuna+'"');
const conteo_funcionario=conte_funcionario[0].numero;
//lider estructura
const conte_estructura  =await pool.query('SELECT count(*) as numero FROM  gestores WHERE tipo="LIDER ESTRUCTURA" AND comuna='+'"'+verificausuario[0].comuna+'"');
const conteo_estructura=conte_estructura[0].numero;
//lider independiente
const conte_independiente  =await pool.query('SELECT count(*) as numero FROM  gestores WHERE tipo="LIDER INDEPENDIENTE" AND comuna='+'"'+verificausuario[0].comuna+'"');
const conteo_independiente=conte_independiente[0].numero;
//gestor
const conte_gestor  =await pool.query('SELECT count(*) as numero FROM  gestores WHERE tipo="GESTOR" AND comuna='+'"'+verificausuario[0].comuna+'"');
const conteo_gestor=conte_gestor[0].numero;

const textomostrar=false;
          
              
res.render('personal/lista1',{usuario,vista,numero,verificausuario,reportecomuna,numerototal,reportecomunatotal,
  conteo_funcionario,conteo_estructura,conteo_independiente,conteo_gestor,textomostrar
});
            }else{


              let query='SELECT * FROM  gestores WHERE comuna='+'"'+verificausuario[0].comuna+'" AND gestor_cedula='+cedula+' ORDER BY tipo ASC, nombre_completo ASC';
            
              const usuario  =await pool.query(query);
              let queryy='SELECT count(*) as numero FROM  gestores WHERE comuna='+'"'+verificausuario[0].comuna+'"'+' AND gestor_cedula='+cedula+' ORDER BY tipo ASC, nombre_completo ASC';
              const conteo= await pool.query(queryy);
              numero=conteo[0].numero;
              pages=Math.ceil(conteo[0].numero/items);
              usuariolista  =await pool.query(query);
             
            
             const usuarioreporte  =await pool.query('SELECT * FROM  gestores WHERE comuna='+'"'+verificausuario[0].comuna+'" AND gestor_cedula='+cedula+' ORDER BY tipo ASC, nombre_completo ASC');
             var reportecomuna=0;
             for(var i=0;i<usuarioreporte.length;i++){
                reportecomuna=reportecomuna+usuarioreporte[i].reporte;
             }
             
   // en total numero
   

              let queryyy='SELECT count(*) as numero FROM  gestores WHERE comuna='+'"'+verificausuario[0].comuna+'"';
              const conteototal= await pool.query(queryyy);
              numerototal=conteototal[0].numero;
              pages=Math.ceil(conteototal[0].numero/items);
             

              const usuarioreportetotal  =await pool.query('SELECT * FROM  gestores WHERE comuna='+'"'+verificausuario[0].comuna+'"');
              var reportecomunatotal=0;
             for(var i=0;i<usuarioreportetotal.length;i++){
                reportecomunatotal=reportecomunatotal+usuarioreportetotal[i].reporte;
             }
             // en total numero
            

//conteo por separado
//funcionario


const conte_funcionario  =await pool.query('SELECT count(*) as numero FROM  gestores WHERE tipo="FUNCIONARIO" AND comuna='+'"'+verificausuario[0].comuna+'" AND gestor_cedula='+cedula);
const conteo_funcionario=conte_funcionario[0].numero;
//lider estructura
const conte_estructura  =await pool.query('SELECT count(*) as numero FROM  gestores WHERE tipo="LIDER ESTRUCTURA" AND comuna='+'"'+verificausuario[0].comuna+'" AND gestor_cedula='+cedula);
const conteo_estructura=conte_estructura[0].numero;
//lider independiente
const conte_independiente  =await pool.query('SELECT count(*) as numero FROM  gestores WHERE tipo="LIDER INDEPENDIENTE" AND comuna='+'"'+verificausuario[0].comuna+'" AND gestor_cedula='+cedula);
const conteo_independiente=conte_independiente[0].numero;
//gestor
const conte_gestor  =await pool.query('SELECT count(*) as numero FROM  gestores WHERE tipo="GESTOR" AND comuna='+'"'+verificausuario[0].comuna+'" AND gestor_cedula='+cedula);
const conteo_gestor=conte_gestor[0].numero;

const textomostrar=true;


              res.render('personal/lista1',{usuario,vista,numero,verificausuario,reportecomuna,numerototal,reportecomunatotal,
                conteo_funcionario,conteo_estructura,conteo_independiente,conteo_gestor,textomostrar
              });
              //gestor con lista tacaño

              
              

            }
            
            // const {cedula} = req.body; 
            /*
            let queryy='SELECT count(*) as numero FROM  gestores WHERE comuna='+'"'+verificausuario[0].comuna+'"';
            const conteo= await pool.query(queryy);
            numero=conteo[0].numero;
             pages=Math.ceil(conteo[0].numero/items);
             usuariolista  =await pool.query(query);
             
            
             const usuarioreporte  =await pool.query(query);
              reportecomuna=0;
             for(var i=0;i<usuarioreporte.length;i++){
              
              reportecomuna=reportecomuna+usuarioreporte[i].reporte;
          
            
             }*/
           
            }
   
          
         
     
        });
     
        
      
      router.get('/listagestor/:cedula',logeosuper,async(req, res)=>{  
        const {cedula} = req.params;
        //const {cedula} = req.body;
        
       if(req.url.indexOf('?')>0)
       {
           // cogemos la parte de la url que hay despues del interrogante
           cedulagestor = req.url.split('?')[1];
               
       }
      
       // var loc = document.location.href;
    // si existe el interrogante
   
        const items=5;
        const page = req.body.page|| 1;
        var vista;
      
        const verificausuario  =await pool.query('SELECT *  FROM  gestores WHERE cedula='+cedula);
        
        if(verificausuario[0].tipo=="LIDER ESTRUCTURA" ||verificausuario[0].tipo=="LIDER INDEPENDIENTE" ||verificausuario[0].tipo=="FUNCIONARIO"||verificausuario[0].tipo=="GESTOR"){
          let query='SELECT * FROM  persona WHERE persona.cc_lider_funcionario='+cedula+' ORDER BY comuna ASC, zona ASC,  puesto ASC, mesa ASC';
          const usuario  =await pool.query(query);
          
          // const {cedula} = req.body; 
         
          let queryy='SELECT count(*) as numero FROM  persona WHERE persona.cc_lider_funcionario='+cedula;
          const conteo= await pool.query(queryy);
          numero=conteo[0].numero;
        
           pages=Math.ceil(conteo[0].numero/items);
           usuariolista  =await pool.query(query);
           vista=true;
           
           res.render('personal/listagestor',{usuario,numero,vista,verificausuario,cedulagestor});
        }
        
        });
  router.get('/descargalistalf',logeosuper,function(req, res){

    var ws = XLSX.utils.json_to_sheet(usuariolista);
    // var csv= XLSX.utils.sheet_to_csv(data);
    
     var wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, ws, "People");
    
    
    XLSX.writeFile(wb, "resultadopersonal.xlsx");
   
    res.download('resultadopersonal.xlsx');
    
  });

      router.get('/edictargestores/:cedula',logeosuper,async(req, res)=>{   
          const {cedula} = req.params;
          glovalcedula =req.params.cedula;
          
          const usuario= await pool.query('SELECT * FROM gestores WHERE cedula='+cedula);
          if(req.url.indexOf('?')>0)
          {
            cedulagestor = req.url.split('?')[1];
          
        }
          res.render('personal/edictargestores.hbs',{usuario,cedulagestor });  
          
        });
        router.post('/edictargestores/:cedula',logeosuper,async(req, res)=>{   
          const {cedula, telefono,correo,tipo,comuna,zona, puesto, numero_votos} = req.body;
          var{ nombre_completo, nombre_del_puesto}= req.body
          //casos es mayusculas
          nombre_completo=nombre_completo.toUpperCase();
          nombre_del_puesto=nombre_del_puesto.toUpperCase();
          
          if(req.url.indexOf('?')>0)
          {
            cedulagestor = req.url.split('?')[1];
           
        }
    
          const nuevousuario={
          cedula,
          nombre_completo ,
          telefono,
          correo,
          tipo,
          comuna,
          zona,
          puesto,
          nombre_del_puesto,
          numero_votos
          

    }
    
          if(nuevousuario.cedula==''){
            req.flash('success','Digite una cedula');
            res.redirect('/personal/edictargestores/'+glovalcedula);
          }else{
            if(nuevousuario.cedula==glovalcedula){         
              await pool.query('UPDATE gestores SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
              req.flash('success','Modificación completa');                  
              res.redirect('/personal/lista/'+cedulagestor);
            }else{    
              const verificarusuario = await pool.query('SELECT * FROM gestores WHERE cedula='+nuevousuario.cedula);
                 
                    if(verificarusuario==''){
                    await pool.query('UPDATE gestores SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
                    await pool.query('UPDATE persona SET cc_lider_funcionario='+nuevousuario.cedula+'  WHERE cc_lider_funcionario='+glovalcedula);
                    await pool.query('UPDATE persona SET cedula='+nuevousuario.cedula+'  WHERE cedula='+glovalcedula);
                    req.flash('success','Modificación completa');                                
                    res.redirect('/personal/lista/'+nuevousuario.cedula);
                    
                  }else{               
                    req.flash('success','Ya existe la cedula ERROR');
                    res.redirect('/personal/lista/'+cedulagestor); 
                  }
            }
          
          }
        });
      ///--------------------------


      router.get('/edictargestores1/:cedula',logeosuper,async(req, res)=>{   
        const {cedula} = req.params;
        glovalcedula =req.params.cedula;
        
        const usuario= await pool.query('SELECT * FROM gestores WHERE cedula='+cedula);
        const gestor = await pool.query('SELECT * FROM gestores WHERE tipo="GESTOR" ORDER BY comuna ASC, nombre_completo ASC');

        if(req.url.indexOf('?')>0)
        {
          cedulagestor = req.url.split('?')[1];
          
      }
        res.render('personal/edictargestores1',{usuario,cedulagestor,gestor });  
        
      });
      router.post('/edictargestores1/:cedula',logeosuper,async(req, res)=>{   
        const {cedula, telefono,correo,tipo,comuna,zona, puesto, numero_votos,gestor_cedula} = req.body;
        var{ nombre_completo, nombre_del_puesto}= req.body
        //casos es mayusculas
        nombre_completo=nombre_completo.toUpperCase();
        nombre_del_puesto=nombre_del_puesto.toUpperCase();
        
        if(req.url.indexOf('?')>0)
        {
          cedulagestor = req.url.split('?')[1];
         
         
        }
  
        const nuevousuario={
        cedula,
        nombre_completo ,
        telefono,
        correo,
        tipo,
        comuna,
        zona,
        puesto,
        nombre_del_puesto,
        numero_votos,
        gestor_cedula
        

  }

 // const usueriogestor= await pool.query('SELECT * FROM gestores  WHERE cedula='+cedula+' AND tipo="GESTOR"');
    if(cedulagestor==cedula){
      if(nuevousuario.cedula==glovalcedula){         
        await pool.query('UPDATE gestores SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
       
        req.flash('success','Modificación completa');
       
    
        res.redirect('/personal/');
      }else{    

        const verificarusuario = await pool.query('SELECT * FROM gestores WHERE cedula='+nuevousuario.cedula);
           
              if(verificarusuario==''){
              await pool.query('UPDATE gestores SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
            
              await pool.query('UPDATE persona SET cc_lider_funcionario='+nuevousuario.cedula+'  WHERE cc_lider_funcionario='+glovalcedula);
              await pool.query('UPDATE persona SET cedula='+nuevousuario.cedula+'  WHERE cedula='+glovalcedula);
            
              req.flash('success','Modificación completa');
             
          
              res.redirect('/personal/');
            
            }else{
            
             
             
              req.flash('success','Ya existe la cedula ERROR');
              res.redirect('/personal/lista1/'+cedulagestor); 
            }
      }
    
    
    }else{

      if(nuevousuario.cedula==''){
        req.flash('success','Digite una cedula');
        res.redirect('/personal/edictargestores/'+glovalcedula);
      }else{
        if(nuevousuario.cedula==glovalcedula){         
          await pool.query('UPDATE gestores SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
         
          req.flash('success','Modificación completa');
         
      
          res.redirect('/personal/lista1/'+cedulagestor);
        }else{    
          const verificarusuario = await pool.query('SELECT * FROM gestores WHERE cedula='+nuevousuario.cedula);
             
                if(verificarusuario==''){
                await pool.query('UPDATE gestores SET ? WHERE cedula=?',[nuevousuario,glovalcedula]);
                
                await pool.query('UPDATE persona SET cc_lider_funcionario='+nuevousuario.cedula+'  WHERE cc_lider_funcionario='+glovalcedula);
                await pool.query('UPDATE persona SET cedula='+nuevousuario.cedula+'  WHERE cedula='+glovalcedula);
              
                req.flash('success','Modificación completa');
               
            
                res.redirect('/personal/lista1/'+nuevousuario.cedula);
              
              }else{
                
                req.flash('success','Ya existe la cedula ERROR');
                res.redirect('/personal/lista1/'+cedulagestor); 
              }
        }
      
      }
    }
        
      });
    
        router.get('/borrargestores/:cedula',logeosuper,async(req, res)=>{  
          const {cedula} = req.params;
          var cc_lider_funcionario;
          const usuario = await pool.query('SELECT * FROM  gestores WHERE cedula='+cedula);
         
         if(usuario[0].tipo=="GESTOR"){
          cc_lider_funcionario=usuario[0].cc_gestor;
          await pool.query('DELETE FROM  gestores WHERE cedula='+cedula);
          res.redirect('/personal/');
         }else{
          cc_lider_funcionario=usuario[0].cc_gestor;              
          await pool.query('DELETE FROM  gestores WHERE cedula='+cedula);
          res.redirect('/personal/lista/'+cedulagestor);
         }
        
        });
        router.get('/borrargestores/opcion/:cedula',logeosuper,async(req, res)=>{  
                  
         if(req.url.indexOf('?')>0){
             // cogemos la parte de la url que hay despues del interrogante
             cedulagestor = req.url.split('?')[1];
                  
         }
         
          const {cedula} = req.params;
          
          var cc_lider_funcionario;
          const usuario = await pool.query('SELECT * FROM  gestores WHERE cedula='+cedula);
          
          cc_lider_funcionario=usuario[0].cc_gestor;
         
          
           nombre_completo =usuario[0].nombre_completo;
          res.render('personal/borrargestores.hbs',{cedula,cc_lider_funcionario, nombre_completo,cedulagestor}); 
        
        });
    

//----------------------------------------
        router.get('/borrargestores1/:cedula',logeosuper,async(req, res)=>{  
          const {cedula} = req.params;
          var cc_lider_funcionario;
         
          const usuario = await pool.query('SELECT * FROM  gestores WHERE cedula='+cedula);
         
         if(usuario[0].tipo=="GESTOR"){
          cc_lider_funcionario=usuario[0].cc_gestor;
          await pool.query('DELETE FROM  gestores WHERE cedula='+cedula);
          res.redirect('/personal/');
         }else{
          cc_lider_funcionario=usuario[0].cc_gestor;
          await pool.query('DELETE FROM  gestores WHERE cedula='+cedula);
          res.redirect('/personal/lista1/'+cedulagestor);
         }
        
        });
        router.get('/borrargestores1/opcion/:cedula',logeosuper,async(req, res)=>{  
                   
         if(req.url.indexOf('?')>0){
             // cogemos la parte de la url que hay despues del interrogante
             cedulagestor = req.url.split('?')[1];               
         }
         
          const {cedula} = req.params;
          
          var cc_lider_funcionario;
          const usuario = await pool.query('SELECT * FROM  gestores WHERE cedula='+cedula);
          
          cc_lider_funcionario=usuario[0].cc_gestor;         
          nombre_completo =usuario[0].nombre_completo;
          res.render('personal/borrargestores1',{cedula,cc_lider_funcionario, nombre_completo,cedulagestor}); 
        
        });
    
module.exports = router;

