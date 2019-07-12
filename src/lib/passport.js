const passport =require('passport');
const LocalStrategy =require('passport-local').Strategy;
const pool =require('../database');
passport.use('local',new LocalStrategy({
usernameField:'usuario',
passwordField:'contrasena',
passReqToCallback: true
},async(req,usuario,contrasena,done)=>{

const {usuariofull}=req.body;
console.log(req.body);
console.log("por aqui paso");
query='SELECT * FROM ingreso WHERE usuario="'+usuario+'" AND contrasena= "'+contrasena+'"';

queryusuario='SELECT * FROM ingreso WHERE usuario = "'+usuario+'"';
console.log(queryusuario);

const user = await pool.query(queryusuario);


if(user.length>0){
    console.log("existe");
    
    if(user[0].contrasena==contrasena){
        console.log("son iguales");
        if(user[0].tipo=="usuario"){
            console.log("vienvenido Usuario normal"+user[0].tipo)
            done(null,user[0]);
          //req.flash('success','vienvenido usuario'+newusuario[0].nombre) req.flash('success','ingrese un usuario correcto'),req.flash('success','ingrese un usuario correcto')
        }
         if(user[0].tipo=="superusuario"){
            console.log("vienvenido super usuario"+user[0].tipo)
            done(null,user[0]);
        }
        if(user[0].tipo=="usuariomedio"){
            console.log("vienvenido Usuario medio"+user[0].tipo)
            done(null,user[0]);
        }
        console.log("el existe")
    }else{
        
        done(null,false,req.flash('success','ingrese una contraseña correcta'));
      
    }
   
   
}else{
    //console.log("dijite usuario")
    done(null,false,req.flash('success','ingrese un usuario correcto'));
}

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    query='SELECT * FROM ingreso WHERE id='+id;


    const newusuario = await pool.query(query);
    
    done(null, newusuario[0]);
  });
  