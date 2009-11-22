var GA = new Object();

function initGA(){
    GA.chromasomes = new Array();
    GA.minvalue = 1;
    GA.maxvalue = 1000;
    var length = Math.ceil(Math.log(GA.maxvalue)/Math.LN2);
    //console.log(length);
    for(var i=0; i<populationSize; i++){
        var random = Math.random();
        var chromasomeDecimalValue = Math.round(GA.minvalue + (GA.maxvalue - GA.minvalue)*random);
        var chromasomeBinValue = chromasomeDecimalValue.toString(2);
        for(var j=length-chromasomeBinValue.length; j>0; j--){
            chromasomeBinValue = "0" + chromasomeBinValue;
        }
        GA.chromasomes[i] = chromasomeBinValue;
        //console.log(chromasomeDecimalValue + ": " + chromasomeBinValue);
    }
}
