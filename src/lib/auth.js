module.exports = {
    logeosuper (req, res, next) {
        if (req.isAuthenticated()) {
            console.log(req.user.tipo)
            if (req.user.tipo == "superusuario") return next();
            if (req.user.tipo == "usuario") res.redirect('consultavista');
            if (req.user.tipo == "usuariomedio") res.redirect('consultamedio');
          
        }else{
            res.redirect('/login');
        }
     
     
    },
    logeousuario (req, res, next) {
        if (req.isAuthenticated()) {
        if (req.user.tipo == "usuario") return next();
        if (req.user.tipo == "superusuario") res.redirect('consulta');
        if (req.user.tipo == "usuariomedio") res.redirect('consultamedio');
        
        }else{
        res.redirect('/login');
        }
     
    },
    logeousuariomedio (req, res, next) {
        if (req.isAuthenticated()) {
        if (req.user.tipo == "usuario") res.redirect('consultavista');
        if (req.user.tipo == "superusuario") res.redirect('consulta');
        if (req.user.tipo == "usuariomedio") return next();
        
        }else{
        res.redirect('/login');
        }
     
    },
    logeocualquiera(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
       
        }else{
            res.redirect('/login');
           
       
        }
     
    },
    login(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('consulta');
       
        }else{
            return next();
       
        }
     
    }
  
};