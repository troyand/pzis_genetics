PGA.funcs = {};
PGA.funcs.sin = function(x){
    return 1+Math.sin(x[0]);
}

PGA.funcs.cos = function(x){
    return 1+Math.cos(x[0]);
}

PGA.funcs.hyp = function(x){
    return x[0]*x[0]+x[1]*x[1];
}

PGA.funcs.griewank = function(x){
    return 1/(((x[0]*x[0]+x[1]*x[1])/200)-Math.cos(x[0])*Math.cos(x[1]/Math.sqrt(2))+2);
}

PGA.funcs.rastrigin2 = function(x){
    y=-100;
    for(t=0;t<x.length;t++){
        y+=10*Math.cos(2*Math.PI*x[t])-x[t]*x[t];
    }
    return y;
}

PGA.funcs.rastrigin1 = function(x){
    return 20+x[0]*x[0]+x[1]*x[1]-10*Math.cos(2*Math.PI*x[0])-10*Math.cos(2*Math.PI*x[1]);
}

PGA.funcs.schwefel = function(x){
    y = 0;
    for(t=0; t<x.length; t++){
        y += -x[t]*Math.sin(Math.sqrt(Math.abs(x[t])));
    }
    return y;
}

PGA.funcs.test = function(){
    var y = PGA.funcs.sin([1]);
    //console.log(PGA.funcs.schwefel([1,1,1,1,1,1,1,1,1,1]));
}
