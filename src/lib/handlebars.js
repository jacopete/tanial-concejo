const helpers = {};

helpers.selected = (options, selected) => {
    return options == selected ? ' selected' : '';
};
helpers.persona=('ifpersona', (persona)=> {



});
helpers.ifnavegacion=('ifnavegacion', (navegacion)=> {

 
  
    mediosbotones=[];

    if(navegacion.der >=navegacion.pages){
        navegacion.der=navegacion.pages;
    }
  
    //console.log("comuna "+ navegacion.comuna,"puesto "+navegacion.puesto,"mesa "+navegacion.mesa, "zona "+navegacion.zona)
    botonizq=['<button class="btn btn-secondary" type="text" name="page" value='+navegacion.izq+'><<</button>'];
    botonizqdisable=['<button class="btn btn-secondary" type="text" name="page" value='+navegacion.page+'><<</button>'];
    botonder=['<button class="btn btn-secondary" type="text" name="page" value='+navegacion.der+'>>></button>'];
    botonderdisable=['<button class="btn btn-secondary" type="text" name="page" value='+navegacion.page+'>>></button>'];
    botonultimo=['<button class="btn btn-secondary" type="text" name="page" value='+navegacion.pages+'>Ultima pagina</button>'];
    botoncomenzar=['<button class="btn btn-secondary" type="text" name="page" value=1>Primera pagina</button>'];
    for(var i=1;i<=navegacion.pages;i++){
        mediosbotones.push('<button class="btn btn-secondary" type="text" name="page" value="'+i+'">'+i+'</button>');
        //console.log(i);
        
    }
    
    //console.log(mediosbotones)
    if(navegacion.page == 1){
        return botoncomenzar + botonizqdisable  +botonder + botonultimo;
    }
  
   
    if(navegacion.page == navegacion.pages){
        return botoncomenzar + botonizq  + botonderdisable + botonultimo;
    }
    if(navegacion.page != navegacion.pages){
        return botoncomenzar + botonizq + botonder + botonultimo;
    }
   


   
});
helpers.ifconteo=('ifconteo', (numero)=> {
    numero ++;
    return numero ++;
   

});
helpers.compare = ((lvalue, rvalue, options)=> {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    var operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

helpers.iff=('iff', (a, operator, b, opts)=> {
    var bool = false;
    switch(operator) {
       case '==':
           bool = a == b;
           break;
       case '>':
           bool = a > b;
           break;
       case '<':
           bool = a < b;
           break;
       default:
           throw "Unknown operator " + operator;
    }
 
    if (bool) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});
helpers.ifusuario=('ifusuario', (v1, v2, options)=> {
    if(v1 == v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  helpers.ifgestor=('ifgestor', (v1, options)=> {
    if(v1 == "GESTOR") {
      return options.fn(this);
    }
    return options.inverse(this);
  });

module.exports = helpers;