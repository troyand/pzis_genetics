//provide dummy console if we don't have a real one
if(!console){
    var console = {
        log: function() {
                 return;
             }
    }
}

function object(o) {
    //prototypal inheritance helper
    function F() {}
    F.prototype = o;
    return new F();
}


String.prototype.camel2human = function () {
    //camel name to spaced starting from capital
    //e.g. camelCasedName -> Camel cased name

    var regex = /([A-Z])/g;//match capital
    var str = this.replace(regex, " $1");//add a space before capitals
    str = str[0].toUpperCase() + str.slice(1).toLowerCase();//capitalize the first and lowercase the rest
    return str;
}
