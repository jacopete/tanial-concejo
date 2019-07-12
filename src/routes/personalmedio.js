const express =require('express');
const router = express.Router();
const pool = require('../database');
//pagina consulta
const { logeousuariomedio } = require('../lib/auth');
const FileSaver = require('file-saver');

const XLSX =require('xlsx');


const path =require('path')

router.get('/',logeousuariomedio,async(req, res)=>{  
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
   
   res.render('personalmedio/personalmedio',{usuario,navegacion,tipo,comuna,zona,puesto,numero});

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

  
  router.post('/',logeousuariomedio,async(req, res)=>{ 
    
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
   res.render('personalmedio/personalmedio',{usuario,page,navegacion,tipo,comuna,zona,puesto,numero});


  });

 

  router.get('/descarga', logeousuariomedio,function(req, res) { 
   
    if(descargausuario!=null){
    if(typeof XLSX == 'undefined') XLSX = require('xlsx');
    var ws = XLSX.utils.json_to_sheet(descargausuario);
    // var csv= XLSX.utils.sheet_to_csv(data);
    
     var wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, ws, "People");
    
    
    XLSX.writeFile(wb, "resultadopersonalvista.xlsx");
    console.log(wb);
    res.download('resultadopersonalvista.xlsx');}
    else{
      if(typeof XLSX == 'undefined') XLSX = require('xlsx');
      var ws = XLSX.utils.json_to_sheet(descargausuarioconsulta);
          
       var wb = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "People");
      
      
      XLSX.writeFile(wb, "resultadopersonalvista.xlsx");
      console.log(wb);
      res.download('resultadopersonalvista.xlsx');

    }
});
  

  router.post('/cedula',logeousuariomedio,async(req, res)=>{ 
    const {cedula} = req.body; 
       if(cedula==''){
          req.flash('success','Digite una cedula');
          res.redirect('/personalmedio/');
          //ensayo
          console.log(req.body);
       }else{
           const usuario = await pool.query('SELECT * FROM gestores WHERE cedula='+cedula);
            if(usuario==''){
              req.flash('success','No se encontraron coincidencias');
              res.redirect('/personalmedio/');
            }else{
              console.log('success','La cedula existe');
            res.render('personalmedio/cedula',{usuario });
            //res.render('consulta/',{usuario});
            }
    
        }  
       
  });
  
  router.get('/cedula',logeousuariomedio,async(req, res)=>{ 
    
    res.redirect('/personalmedio/');
  });


  router.get('/lista/:cedula',logeousuariomedio,async(req, res)=>{  
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
      
      res.render('personalmedio/lista',{usuario,numero,vista,verificausuario});
    }else{
      

         const usuario=null;
         numero=0;
         usuariolista  =await pool.query(query);
         vista=false;
         res.render('personalmedio/lista',{usuario,vista,numero,verificausuario});
      
     
    }
 
    });

      router.get('/lista1/:cedula',logeousuariomedio,async(req, res)=>{  
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
          
              
res.render('personalmedio/lista1',{usuario,vista,numero,verificausuario,reportecomuna,numerototal,reportecomunatotal,
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


              res.render('personalmedio/lista1',{usuario,vista,numero,verificausuario,reportecomuna,numerototal,reportecomunatotal,
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
     
        
      
      router.get('/listagestor/:cedula',logeousuariomedio,async(req, res)=>{  
        const {cedula} = req.params;
        //const {cedula} = req.body;
        

       console.log(req.url);
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
          let query='SELECT * FROM  persona WHERE persona.cc_lider_funcionario='+cedula;
          const usuario  =await pool.query(query);
          //console.log(usuario);
          // const {cedula} = req.body; 
         
          let queryy='SELECT count(*) as numero FROM  persona WHERE persona.cc_lider_funcionario='+cedula;
          const conteo= await pool.query(queryy);
          numero=conteo[0].numero;
          console.log("mi numero "+numero)
           pages=Math.ceil(conteo[0].numero/items);
           usuariolista  =await pool.query(query);
           vista=true;
           console.log("cedulagestor")
          console.log(cedulagestor);
           res.render('personalmedio/listagestor',{usuario,numero,vista,verificausuario,cedulagestor});
        }
        
        });
  router.get('/descargalistalf',logeousuariomedio,function(req, res){

    var ws = XLSX.utils.json_to_sheet(usuariolista);
    // var csv= XLSX.utils.sheet_to_csv(data);
    
     var wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, ws, "People");
    
    
    XLSX.writeFile(wb, "resultadopersonalvista.xlsx");
    console.log(wb);
    res.download('resultadopersonalvista.xlsx');
    
  });


module.exports = router;

