PGA.A = {} //algorithm object

PGA.A.encoding = function() {
    //length of the chromosome
    //TODO should be calculated dynamically
    PGA.A.chLength = 16; 
    console.log(PGA.activeFunction.properties.encoding);
    console.log(num2log(log2num("0011")));
    console.log(fixedBin(31,PGA.A.chLength));
    //binary fixed-length string (chopped/zero-padded)
    function fixedBin(num,length){
        var bin = num.toString(2);
        if(bin.length > length){
            return bin.substring(bin.length - length);
        }
        if(bin.length < length){
            for(var j=length-bin.length; j>0; j--){
                bin = "0" + bin;
            }
            return bin;
        }
        return bin;
    }
    //binary encoded chromosome to number
    function bin2num(ch){
        return parseInt(ch,2);
    }
    //number to binary encoded chromosome
    function num2bin(num){
        return fixedBin(num, PGA.A.chLength);
    }
    //logarithm encoded chromosome to number
    function log2num(ch){
        var alpha = parseInt(ch[0],2);
        var beta = parseInt(ch[1],2);
        var n = parseInt(ch.substring(2),2);
        return Math.pow(-1, alpha)*Math.exp(Math.pow(-1,beta)*n);
    }
    //number to logarithm encoded chromosome
    function num2log(num){
        var alpha = null;
        if(num>0){
            alpha = '0';
        } else{
            alpha = '1';
        }
        var beta = null;
        var log = Math.log(Math.abs(num));
        if(log>0){
            beta = '0';
        }
        else{
            beta = '1';
        }
        return alpha + beta + fixedBin(Math.round(log),PGA.A.chLength-2);
    }
}

PGA.A.init = function() {
    PGA.A.chromosomes = [];
    for(var i=0; i<PGA.activeFunction.properties.populationSize; i++){
        var ch = '';
        for(var j=0; j<PGA.A.chLength; j++){
            if(Math.random()>0.5){
                ch += '0';
            }else{
                ch += '1';
            }
        }
        PGA.A.chromosomes[i]=ch;
    }
    //console.log(PGA.A.chromosomes,PGA.activeFunction.properties.populationSize);
}

PGA.A.selection = function() {
}

PGA.A.recombination = function() {
}
/*
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
*/
