PGA.A = {} //algorithm object

PGA.A.encoding = function() {
    //length of the chromosome
    PGA.A.chLength = PGA.activeFunction.properties.bitsPerNumber*PGA.activeFunction.argNum;
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
    //PGA.A.f = function(arg){
    //    return 1+Math.sin(arg[0]*0.05);
    //}
    PGA.A.f = PGA.funcs[PGA.activeFunction.name];
    PGA.A.h = function(ch){
        var arg = [];
        for(var k=0; k<PGA.activeFunction.argNum; k++){
            arg[k] = PGA.A.toNum(ch.slice(k*PGA.activeFunction.properties.bitsPerNumber,(k+1)*PGA.activeFunction.properties.bitsPerNumber));
        }
        return arg;
    }
    PGA.A.g = function(ch){
        return PGA.A.f(PGA.A.h(ch));
    }
    var sum = 0;
    for(var k=0; k<PGA.A.chromosomes.length; k++){
        sum += PGA.A.g(PGA.A.chromosomes[k]);
    }
    PGA.A.baseF = sum/PGA.A.chromosomes.length;
    console.log('base', PGA.A.baseF);
    //console.log(PGA.A.chromosomes,PGA.activeFunction.properties.populationSize);
}

PGA.A.selection = function() {
    var elitarists = Math.floor( PGA.activeFunction.properties.populationSize*PGA.activeFunction.properties.elitarism/100 );
    var grandparents = Math.floor( PGA.activeFunction.properties.populationSize*(1-PGA.activeFunction.properties.parentReplacementRate/100) );
    var mainChildren = null;
    if(PGA.activeFunction.properties.selectionType=="tournament"){
        mainChildren = tournament(5,PGA.A.chromosomes.length-elitarists-grandparents);
    }
    if(PGA.activeFunction.properties.selectionType=="roulette"){
        mainChildren = roulette(PGA.A.chromosomes.length-elitarists-grandparents);
    }
    PGA.A.chromosomes = mainChildren.concat( elitarism(elitarists) , getRandomChromosomes(grandparents));
    //console.log(PGA.A.g(PGA.A.chromosomes[0]));
    //console.log(elitarism(Math.floor( PGA.activeFunction.properties.populationSize*PGA.activeFunction.properties.elitarism/100 )));
    function elitarism(quantity){
        var pool =[];
        //var quantity = Math.round(percent*PGA.activeFunction.properties.populationSize);
        //var chromHealth= [];
        PGA.A.chromosomes.sort(function(a,b){return PGA.A.g(a) - PGA.A.g(b)});
        PGA.A.chromosomes.reverse();
        //for (var i=0; i<PGA.A.chromosomes.length; i++)
        //{
        //	var z = PGA.A.chromosomes[i];
        //	var h = PGA.A.g(z);
        //	var temp=[h,z];
        //	chromHealth[i]=temp;
        //}
        //chromHealth.sort(function(a,b){return a - b});
        //chromHealth.reverse();
        //console.log("vporadkovane: "+chromHealth);
        //for (var j=0; j<quantity; j++)
        //{
        //	pool[j]=chromHealth[j][1];
        //}
        pool = PGA.A.chromosomes.slice(0,quantity);
        //console.log(pool);
        return pool;
    }
    function getRandomChromosomes(quantity){
        //for incomplete parent replacement
        PGA.A.chromosomes.shuffle();
        return PGA.A.chromosomes.slice(0,quantity);
    }
    function roulette(quantity){
        var sum = 0;//sum of function values to normalize probabilities arrray
        var pSum = 0;
        var prob = [];
        for(var i=0; i < PGA.A.chromosomes.length; i++){
            //prob[i] = PGA.A.f([ PGA.A.toNum(PGA.A.chromosomes[i]) ]);
            prob[i] = PGA.A.g(PGA.A.chromosomes[i]);
            sum += prob[i];
            //console.log(PGA.A.chromosomes[i], PGA.A.toNum(PGA.A.chromosomes[i]), PGA.A.f([ PGA.A.toNum(PGA.A.chromosomes[i]) ]) );
        }
        for(var i=0; i < PGA.A.chromosomes.length; i++){
            prob[i] /= sum;
            pSum += prob[i];
            prob[i] = pSum;
        }
        var pool = [];
        for(var i=0; i < quantity; i++){
            var rand = Math.random();
            var found = false;
            for(var j=0; (j < PGA.A.chromosomes.length) && !found; j++){
                if(rand < prob[j]){
                    pool[i] = PGA.A.chromosomes[j];
                    found = true;
                }
            }
        }
        return pool;
        //console.log(prob);
        //console.log('sum before', sum);
        //PGA.A.chromosomes = pool;
        //sum = 0;
        //for(var i=0; i < PGA.A.chromosomes.length; i++){
        //    //prob[i] = PGA.A.f([ PGA.A.toNum(PGA.A.chromosomes[i]) ]);
        //    prob[i] = PGA.A.g(PGA.A.chromosomes[i]);
        //    sum += prob[i];
        //    //console.log(PGA.A.chromosomes[i], PGA.A.toNum(PGA.A.chromosomes[i]), PGA.A.f([ PGA.A.toNum(PGA.A.chromosomes[i]) ]) );
        //}
        //console.log('sum after', sum);
    }
    function tournament(participantsNumber, quantity){
    	var pool = [];
    	for (var i=0; i<quantity; i++){ //form the needed quantity of chromosomes in the pool
    		var winner=-1;
    		var winnerHealth=Math.log(0); //-Infinity
    		//console.log("next round");
    		//var sssss=Math.sin(157.5);
    		for (var j=0; j<participantsNumber; j++){ //form participants of the tournament and asses them
    			var randChrom=Math.floor(Math.random()*PGA.A.chromosomes.length);
    			//var z=PGA.A.toNum(PGA.A.chromosomes[randChrom]);
    			var currHealth=PGA.A.g(PGA.A.chromosomes[randChrom]);//PGA.A.f([z]);
    			if (currHealth>winnerHealth){
    				winner=randChrom;
    				winnerHealth=currHealth;
    			}
    		}
    		pool[i]=PGA.A.chromosomes[winner];
    		//console.log(pool[i]);
    	}
    	return pool;
    }
    //console.log(tournament(2,10));
   }

PGA.A.recombination = function() {
    PGA.A.chromosomes = form_pairs(PGA.activeFunction.properties.crossingOverProbability/100, PGA.A.chromosomes);
    PGA.A.chromosomes = mutation(PGA.activeFunction.properties.mutationProbability/100, PGA.A.chromosomes);
	
	//forms pairs and invokes crossover for them and returns children
	function form_pairs(prob, pool){
		var children = [];
		var child = [];//temporary
		var n=pool.length;
		pool=pool.shuffle();
//		console.log(pool);
		for (var i=0;i<n-1; i+=2)
		{
			if (Math.random()<prob){//crossover with probability prob
                //console.log('ok');
				child=crossover(pool[i], pool[i+1]);
			}
			else{//no crossover
				child[0]=pool[i];
				child[1]=pool[i+1];
			}
			children[i]=child[0];
			children[i+1]=child[1];

		}
		if (n%2==1)
		{
			children[n-1]=pool[n-1];
		}
		return children;
	}
    //console.log('B', PGA.A.chromosomes);
	//console.log('P', form_pairs(0.8,PGA.A.chromosomes));
	//console.log('M', mutation(0.4, PGA.A.children));
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
		var alphabet=["0","1"];
		for (var i=0; i<children.length; i++){
			r=Math.random();
			if (r<prob){
				var point=Math.floor(Math.random()*(PGA.A.chLength));
				for (var j=0; j<alphabet.length; j++){
					if (children[i].charAt(point)===alphabet[j]){
						var k=(j+1)%alphabet.length;
						children[i]=children[i].substring(0,point)+alphabet[k]+children[i].substring(point+1);
						break;
					}
				}
			}
		}
		return children;
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
