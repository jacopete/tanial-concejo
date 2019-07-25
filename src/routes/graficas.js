const express =require('express');
const router = express.Router();
const { logeocualquiera } = require('../lib/auth');
const pool = require('../database');

router.get('/',logeocualquiera,async(req, res)=>{
    var restadeltotal=0;
    reportecomuna=0;
    cedula=req.body.cedula;
    comuna=req.body.comuna;
   
    var comunas=[]
    var comuna_votantes=[]
    
    
    var conteo=0;
    var total=0;
    
    var comunalider=[]
    var comunaliderzona=[];
    var totallidercali=0;
    var totalfueralider=0;
    var totallider=0;
     //PARA MAS DATOS
     var conteo_comuna_dentro_comuna=0;
     var contartotalpersonascomuna=0;
     var conteo_comuna_fuera_cali=0;
     var conteo_comuna_fuera_comuna=0;
    //dibujar lider gestor o funcionario
   if(cedula!=null){
       //el lider como tal
    const usuariolider = await pool.query('SELECT * FROM gestores  WHERE cedula='+cedula);
    reportecomuna=usuariolider[0].comuna;

    //listado del lider
    const usuarioconteo = await pool.query('SELECT count(*) as numero FROM persona  WHERE cc_lider_funcionario='+cedula);
    totallider=totallider+usuarioconteo[0].numero;

    for(i=1;i<=38;i++){
        const usuario = await pool.query('SELECT count(*) as numero FROM persona  WHERE cc_lider_funcionario='+cedula +' AND comuna='+i);
        totallidercali=totallidercali+usuario[0].numero;
        comunalider.push(usuario[0].numero);
    }
    const usuariolider90 = await pool.query('SELECT count(*) as numero FROM persona  WHERE cc_lider_funcionario='+cedula +' AND zona='+90);
    comunaliderzona.push(usuariolider90[0].numero);
    totallidercali=totallidercali+usuariolider90[0].numero;
    

    //diferencias
    totalfueralider=totallider-totallidercali;
   }else{
    usuariolider=null;
    usuariolider90=null;
   }

    //para dibujar la fuerza de la comuna consiguiendo votantes
    total=0;
    for(var i=1;i<=39;i++){
    
        const usuario = await pool.query('SELECT * FROM gestores  WHERE comuna='+i);

        for(var t=0;t<usuario.length;t++){
            conteo  = conteo+usuario[t].reporte;
            total =total+usuario[t].reporte;
            
        }
        comunas.push(conteo);
        
        conteo=0;
    }
   
    //para dibujar los votantes en comuna
   
    var totalcomuna_votantes=0;
    for(var i=1;i<=38;i++){
    
        const usuario = await pool.query('SELECT count(*) as numero FROM persona  WHERE comuna='+i);
        //usuariopersona = await pool.query('SELECT * FROM persona  WHERE comuna='+i);
      
        comuna_votantes.push(usuario[0].numero);
        totalcomuna_votantes=totalcomuna_votantes+usuario[0].numero;
     
    }
    var zona90=0;
    const usuario90 = await pool.query('SELECT count(*) as numero FROM persona  WHERE zona='+90);
    zona90=usuario90[0].numero;
   
    var totalvalle=zona90+totalcomuna_votantes;
    
    

    //para dibujar los lideres en comuna
//lider estrutura
const lider_estrutura = await pool.query('SELECT * FROM gestores  WHERE tipo="LIDER ESTRUCTURA" AND comuna='+reportecomuna);
const conte_lider_estrutura = await pool.query('SELECT count(*) as numero FROM gestores  WHERE tipo="LIDER ESTRUCTURA" AND comuna='+reportecomuna);
    conteo_lider_estrutura = conte_lider_estrutura[0].numero;
//gestor
const gestor = await pool.query('SELECT * FROM gestores  WHERE tipo="GESTOR" AND comuna='+reportecomuna);
const conte_gestor = await pool.query('SELECT count(*) as numero FROM gestores  WHERE tipo="GESTOR" AND comuna='+reportecomuna);
    conteo_gestor = conte_gestor[0].numero;
//funcionario
const funcionario = await pool.query('SELECT * FROM gestores  WHERE tipo="FUNCIONARIO" AND comuna='+reportecomuna);
const conte_funcionario = await pool.query('SELECT count(*) as numero FROM gestores  WHERE tipo="FUNCIONARIO" AND comuna='+reportecomuna);
    conteo_funcionario = conte_funcionario[0].numero;
    
    //lider independiente

    const lider_independiente = await pool.query('SELECT * FROM gestores  WHERE tipo="LIDER INDEPENDIENTE" AND comuna='+reportecomuna);
    const conte_independiente = await pool.query('SELECT count(*) as numero FROM gestores  WHERE tipo="LIDER INDEPENDIENTE" AND comuna='+reportecomuna);
    conteo_independiente = conte_independiente[0].numero;
    
    //conteo de lo demas
    const conteoreporte = await pool.query('SELECT * FROM gestores  WHERE comuna='+reportecomuna);
    var conteo_reporte=0;
    var totalreportecomuna=0;
    for(var t=0;t<conteoreporte.length;t++){
        conteo_reporte  = conteo_reporte+conteoreporte[t].reporte;
        totalreportecomuna =totalreportecomuna+conteoreporte[t].reporte;
    }
    comunas.push(conteo);
    conteo=0;
   
    const conteolider = await pool.query('SELECT count(*) as numero FROM gestores  WHERE comuna='+reportecomuna);
    var conteo_lider=conteolider[0].numero;
    
   

    total_inscritos=0;
    const totalinscritos = await pool.query('SELECT count(*) as numero FROM persona');
    total_inscritos=totalinscritos[0].numero;
    

    restadeltotal=total-totalvalle;
    
res.render("graficas/graficas",{

    total, restadeltotal, comunas , total_inscritos, comuna_votantes,comuna,
    lider_estrutura,gestor,funcionario,lider_independiente,
    conteo_gestor,conteo_lider_estrutura,conteo_funcionario,conteo_independiente,
    
    totalreportecomuna,conteo_lider,total,reportecomuna,zona90,totalvalle,
    usuariolider,comunalider,totallidercali,comunaliderzona,totalfueralider,totallider,
    conteo_comuna_dentro_comuna,contartotalpersonascomuna,conteo_comuna_fuera_cali,conteo_comuna_fuera_comuna
  
}


);

});
































































router.post('/',logeocualquiera,async(req, res)=>{
    var restadeltotal=0;
    reportecomuna=req.body.reportecomuna;
   
    comuna==req.body.comuna;
    cedula=req.body.cedula;
    
    var comunas=[]
    var comuna_votantes=[]
    
    
    var conteo=0;
    var total=0;
    
    var comunalider=[]
    var comunaliderzona=[];
    var totallidercali=0;
    var totalfueralider=0;
    var totallider=0;

    //PARA MAS DATOS
    var conteo_comuna_dentro_comuna=0;
    var contartotalpersonascomuna=0;
    var conteo_comuna_fuera_cali=0;
    var conteo_comuna_fuera_comuna=0;
    
    //dibujar lider gestor o funcionario
   if(cedula!=null){
       //el lider como tal
       usuariolider = await pool.query('SELECT * FROM gestores  WHERE cedula='+cedula);
      
    reportecomuna=usuariolider[0].comuna;

    //listado del lider
    const usuarioconteo = await pool.query('SELECT count(*) as numero FROM persona  WHERE cc_lider_funcionario='+cedula);
    totallider=totallider+usuarioconteo[0].numero;

    for(i=1;i<=38;i++){
        const usuario = await pool.query('SELECT count(*) as numero FROM persona  WHERE cc_lider_funcionario='+cedula +' AND comuna='+i);
        totallidercali=totallidercali+usuario[0].numero;
        comunalider.push(usuario[0].numero);
    }
    const usuariolider90 = await pool.query('SELECT count(*) as numero FROM persona  WHERE cc_lider_funcionario='+cedula +' AND zona='+90);
    comunaliderzona.push(usuariolider90[0].numero);
    totallidercali=totallidercali+usuariolider90[0].numero;
   

    //diferencias
    totalfueralider=totallider-totallidercali;
   }else{
    //usuariolider=null;
    usuariolider90=null;
   }
   

     //para dibujar la fuerza de la comuna consiguiendo votantes
     total=0;
     for(var i=1;i<=39;i++){
     
         const usuario = await pool.query('SELECT * FROM gestores  WHERE comuna='+i);
 
         for(var t=0;t<usuario.length;t++){
             conteo  = conteo+usuario[t].reporte;
             total =total+usuario[t].reporte;
             
         }
         comunas.push(conteo);
         
         conteo=0;
     }
    
     //para dibujar los votantes en comuna
    
     var totalcomuna_votantes=0;
     for(var i=1;i<=38;i++){
     
         const usuario = await pool.query('SELECT count(*) as numero FROM persona  WHERE comuna='+i);
         //usuariopersona = await pool.query('SELECT * FROM persona  WHERE comuna='+i);
       
         comuna_votantes.push(usuario[0].numero);
         totalcomuna_votantes=totalcomuna_votantes+usuario[0].numero;
      
     }
    var zona90=0;
    const usuario90 = await pool.query('SELECT count(*) as numero FROM persona  WHERE zona='+90);
    zona90=usuario90[0].numero;
    var totalvalle=zona90+totalcomuna_votantes;
    
    

    //para dibujar los lideres en comuna
//lider estrutura
const lider_estrutura = await pool.query('SELECT * FROM gestores  WHERE tipo="LIDER ESTRUCTURA" AND comuna='+reportecomuna +' ORDER BY nombre_completo');
const conte_lider_estrutura = await pool.query('SELECT count(*) as numero FROM gestores  WHERE tipo="LIDER ESTRUCTURA" AND comuna='+reportecomuna);
    conteo_lider_estrutura = conte_lider_estrutura[0].numero;
//gestor
const gestor = await pool.query('SELECT * FROM gestores  WHERE tipo="GESTOR" AND comuna='+reportecomuna);
const conte_gestor = await pool.query('SELECT count(*) as numero FROM gestores  WHERE tipo="GESTOR" AND comuna='+reportecomuna+' ORDER BY nombre_completo');
    conteo_gestor = conte_gestor[0].numero;
//funcionario
const funcionario = await pool.query('SELECT * FROM gestores  WHERE tipo="FUNCIONARIO" AND comuna='+reportecomuna+' ORDER BY nombre_completo');
const conte_funcionario = await pool.query('SELECT count(*) as numero FROM gestores  WHERE tipo="FUNCIONARIO" AND comuna='+reportecomuna+' ORDER BY nombre_completo');
    conteo_funcionario = conte_funcionario[0].numero;
    
    //lider independiente

    const lider_independiente = await pool.query('SELECT * FROM gestores  WHERE tipo="LIDER INDEPENDIENTE" AND comuna='+reportecomuna+' ORDER BY nombre_completo');
    const conte_independiente = await pool.query('SELECT count(*) as numero FROM gestores  WHERE tipo="LIDER INDEPENDIENTE" AND comuna='+reportecomuna);
    conteo_independiente = conte_independiente[0].numero;
    
    //conteo de lo demas
    const conteoreporte = await pool.query('SELECT * FROM gestores  WHERE comuna='+reportecomuna);
    var conteo_reporte=0;
    var totalreportecomuna=0;
    for(var t=0;t<conteoreporte.length;t++){
        conteo_reporte  = conteo_reporte+conteoreporte[t].reporte;
        totalreportecomuna =totalreportecomuna+conteoreporte[t].reporte;
    }
    
    comunas.push(conteo);
    conteo=0;
///datos

for(var t=0;t<conteoreporte.length;t++){     
    const conteototalcomuna= await pool.query('SELECT * FROM persona WHERE cc_lider_funcionario='+conteoreporte[t].cedula+' AND comuna='+reportecomuna);
    for(var i=0;i<conteototalcomuna.length;i++){       
        contartotalpersonascomuna=contartotalpersonascomuna+1;
    }
}



for(var t=0;t<conteoreporte.length;t++){     
    const conteototalcomuna= await pool.query('SELECT * FROM persona WHERE cc_lider_funcionario='+conteoreporte[t].cedula+' AND comuna=0');
    for(var i=0;i<conteototalcomuna.length;i++){       
        conteo_comuna_fuera_cali=conteo_comuna_fuera_cali+1;
    }
}



for(var t=0;t<conteoreporte.length;t++){     
    const conteototalcomuna= await pool.query('SELECT * FROM persona WHERE cc_lider_funcionario='+conteoreporte[t].cedula+' AND comuna <> 0 AND comuna <> '+reportecomuna );
    for(var i=0;i<conteototalcomuna.length;i++){       
        conteo_comuna_fuera_comuna=conteo_comuna_fuera_comuna+1;
    }
}





conteo_comuna_dentro_comuna=contartotalpersonascomuna+conteo_comuna_fuera_comuna;
/*
console.log("En cali")
console.log(conteo_comuna_dentro_comuna)

console.log("total en la comuna")
console.log(totalreportecomuna);

console.log("fuera de cali")
console.log(conteo_comuna_fuera_cali)

console.log("en otras comunas ")
console.log(conteo_comuna_fuera_comuna)

console.log("en la comuna ")
console.log(contartotalpersonascomuna)

*/







//







    
   
    const conteolider = await pool.query('SELECT count(*) as numero FROM gestores  WHERE comuna='+reportecomuna);
    var conteo_lider=conteolider[0].numero;
   

    total_inscritos=0;
    const totalinscritos = await pool.query('SELECT count(*) as numero FROM persona');
    total_inscritos=totalinscritos[0].numero;
   

    restadeltotal=total-totalvalle;
   
res.render("graficas/graficas",{

    total, restadeltotal, total_inscritos, comunas , comuna_votantes,comuna,
    lider_estrutura,gestor,funcionario,lider_independiente,
    conteo_gestor,conteo_lider_estrutura,conteo_funcionario,conteo_independiente,
    
    totalreportecomuna,conteo_lider,total,reportecomuna,zona90,totalvalle,
    usuariolider,comunalider,totallidercali,comunaliderzona,totalfueralider,totallider,

    conteo_comuna_dentro_comuna,contartotalpersonascomuna,conteo_comuna_fuera_cali,conteo_comuna_fuera_comuna
  
}


);

});





module.exports = router;