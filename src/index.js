const express = require('express');
const morgan = require('morgan');
const exphbs=require('express-handlebars')
const path =require('path')
const flahs=require('connect-flash');
const session=require('express-session');
const mysqlStore=require('express-mysql-session');
const {database}=require('./keys');
var bodyParser = require('body-parser');
const passport =require('passport');
const fileUpload = require('express-fileupload')
//inicializar
const app=express();
//...
require('./lib/passport');

//configuracion
app.set('port', process.env.PORT || 3000);
//para decirle donde esta la carpeta view

app.set('views',path.join(__dirname,'view'))
//configura el engine
app.engine('.hbs',exphbs({
defaultLayout:'main',
layoutsDir: path.join(app.get('views'),'layouts'),
partialsDir:path.join(app.get('views'),'partials'),
extname: 'hbs',
helpers:require('./lib/handlebars'),

}));
//dibuja
app.set('view engine','.hbs');
//middlewares
app.use(session({
    secret:'lala',
    resave:false,
    saveUninitialized:false,
    store:new mysqlStore(database)
}));
app.use(flahs());
app.use(morgan('dev'));
app.use(fileUpload());
//solo formatos de string
app.use(express.urlencoded({extended:false}));
//solo formatos json
app.use(express.json());
//inicar passport
app.use(passport.initialize());
app.use(passport.session());

//paginacion
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
//variables globales

app.use((req,res,next)=>{
app.locals.message = req.flash('message');
app.locals.success =req.flash('success');
app.locals.success2 =req.flash('success2');
app.locals.alert =req.flash('alert');
app.locals.warning =req.flash('warning');
app.locals.user =req.user;
next();
});

//routes
app.use(require('./routes/index.js'));
app.use(require('./routes/autenticar.js'));

//super usuario
app.use('/personal',require('./routes/personal'));
app.use('/consulta',require('./routes/consulta'));
app.use('/contratos',require('./routes/contratos'));


//usuario
app.use('/consultavista',require('./routes/consultavista'));
app.use('/personalvista',require('./routes/personalvista'));

//usuariomedio
app.use('/consultamedio',require('./routes/consultamedio'));
app.use('/personalmedio',require('./routes/personalmedio'));
app.use('/contratosmedio',require('./routes/contratosmedio'));

//divipol
app.use('/divipol',require('./routes/divipol'));
app.use('/graficas',require('./routes/graficas'));
//public
app.use(express.static(path.join(__dirname,'public')));

//inicar servidor
app.listen(app.get('port'),()=>{

    console.log("inicio servidor "+ app.get('port'));
});


