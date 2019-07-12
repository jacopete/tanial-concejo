const express =require('express');
const router = express.Router();
const pool = require('../database');

//const passport = require('passport');
const passport = require('passport');
const { login } = require('../lib/auth');
//renderisa formulario
router.get('/login',login,(req, res)=>{
res.render('autenticar/login')


});
//pide los datos del formulario
/*
router.post('/login',(req, res)=>{

    passport.authenticate('local', {
        successRedirect: '/perfil',
        failureRedirect: '/logins',
        failureFlash: true
      })(req, res, next);
   
    console.log(req.body)
    res.render('autenticar/login')
    
    });*/
    router.post('/login',login,passport.authenticate('local', {
        successRedirect: '/consulta',
        failureRedirect: '/login',
        failureFlash: true
      }));
/*
    router.get('/perfil',(req, res)=>{
        res.render('perfil/perfil')

    });*/
    router.get('/salir',(req, res)=>{
        req.logOut();
         res.redirect('/login');
    });
    /*
    router.get('/logins',(req, res)=>{
        res.send('entro al no usuario')

    });*/

module.exports = router;