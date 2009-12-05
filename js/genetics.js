PGA.A = {} //algorithm object

PGA.A.encoding = function() {
    //length of the chromosome
    //TODO should be calculated dynamically
    PGA.A.chLength = 6; 
    if(PGA.activeFunction.properties.encoding==='logarithmic'){
        PGA.A.toNum = log2num;
        PGA.A.toCh = num2log;
    }

    if(PGA.activeFunction.properties.encoding==='binary'){
        PGA.A.toNum = bin2num;
        PGA.A.toCh = num2bin;
    }
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
    PGA.A.f = function(arg){
        return 1+Math.sin(arg[0]*0.1);
    }
    //console.log(PGA.A.chromosomes,PGA.activeFunction.properties.populationSize);
}

PGA.A.selection = function() {
    var sum = 0;//sum of function values to normalize probabilities arrray
    var pSum = 0;
    var prob = [];
    for(var i=0; i < PGA.A.chromosomes.length; i++){
        prob[i] = PGA.A.f([ PGA.A.toNum(PGA.A.chromosomes[i]) ]);
        sum += prob[i];
        console.log(PGA.A.chromosomes[i], PGA.A.toNum(PGA.A.chromosomes[i]), PGA.A.f([ PGA.A.toNum(PGA.A.chromosomes[i]) ]) );
    }
    for(var i=0; i < PGA.A.chromosomes.length; i++){
        prob[i] /= sum;
        pSum += prob[i];
        prob[i] = pSum;
    }
    var pool = [];
    for(var i=0; i < PGA.A.chromosomes.length; i++){
        var rand = Math.random();
        var found = false;
        for(var j=0; (j < PGA.A.chromosomes.length) && !found; j++){
            if(rand < prob[j]){
                pool[i] = PGA.A.chromosomes[j];
                found = true;
            }
        }
    }
    console.log(prob);
    console.log('sum before', sum);
    PGA.A.chromosomes = pool;
    sum = 0;
    for(var i=0; i < PGA.A.chromosomes.length; i++){
        prob[i] = PGA.A.f([ PGA.A.toNum(PGA.A.chromosomes[i]) ]);
        sum += prob[i];
        console.log(PGA.A.chromosomes[i], PGA.A.toNum(PGA.A.chromosomes[i]), PGA.A.f([ PGA.A.toNum(PGA.A.chromosomes[i]) ]) );
    }
    console.log('sum after', sum);
}

PGA.A.recombination = function() {
	
	//forms pairs and invokes crossover for them and returns children
	function form_pairs(prob, pool){
		PGA.A.children = [];
		var child = [];//temporary
		var n=pool.length;
		pool=pool.shuffle();
//		console.log(pool);
		for (var i=0;i<n-1; i+=2)
		{
			if (Math.random()<prob){//crossover with probability prob
				child=crossover(pool[i], pool[i+1]);
			}
			else{//no crossover
				child[0]=pool[i];
				child[1]=pool[i+1];
			}
			PGA.A.children[i]=child[0];
			PGA.A.children[i+1]=child[1];

		}
		if (n%2==1)
		{
			PGA.A.children[n-1]=pool[n-1];
		}
		return PGA.A.children;
	}
    console.log('B', PGA.A.chromosomes);
	console.log('P', form_pairs(0.8,PGA.A.chromosomes));
	console.log('M', mutation(0.4, PGA.A.children));
	//console.log(PGA.A.children);
	
	function crossover(f1,f2){
        //two-point crossingover
		var Length=PGA.A.chLength;
		var point1 = Math.ceil(Math.random()*(Length-1)); //converting from (0;1) to (1,.., Length-1) 
		var point2 = Math.ceil(Math.random()*(Length-1));
		if(point1===point2){
			while (point1===point2){
				point2 = Math.ceil(Math.random()*Length-1);
			}
		}
		if(point1>point2){
			var t=point2;
			point2=point1;
			point1=t;
		}
		var result = [];
		result[0]=f1.substring(0,point1)+f2.substring(point1,point2)+f1.substring(point2);
		result[1]=f2.substring(0,point1)+f1.substring(point1,point2)+f2.substring(point2);
		return result;
	}
	function mutation (prob, children)
	{
		//var count=0;
		for (var i=0; i<children.length; i++){
			r=Math.random();
			if (r<prob){
				var point=Math.floor(Math.random()*(PGA.A.chLength-1));
				if (children[i].charAt(point)==="0"){
					children[i]=children[i].substring(0,point)+"1"+children[i].substring(point+1);
				}
				else {
					children[i]=children[i].substring(0,point)+"0"+children[i].substring(point+1);
				}
			//	count++;
			}	
		}
		PGA.A.children=children;
		return children;
		//return count;
	}
}
/*
	}
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
