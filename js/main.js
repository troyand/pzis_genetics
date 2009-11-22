//main global object
//PZIS genetic algorithms
var PGA = {};


PGA.time = 0;//time counter; each step gets incremented by 1
PGA.updateInterval = 40;//25 fps
PGA.renderIntervalID = null;

$(document).ready(function(){
    console.log(PGA);
    PGA.initFunctions();
    PGA.renderFunctionOptions();

    $("#tabs").tabs();
    $('#tabs').bind('tabsselect', function(event, ui) {
        if(ui.index==0){
        //updateOptions();
        }
        });

    //initPGA();

    PGA.initCanvas();

    $(".ui-icon-stop").click(function() {
        PGA.time = 0;
        clearInterval(PGA.renderIntervalID);
        PGA.renderIntervalID = null;
        });

    $(".ui-icon-pause").click(function() {
        clearInterval(PGA.renderIntervalID);
        PGA.renderIntervalID = null;
        });

    $(".ui-icon-play").click(function() {
            if(PGA.time == 0){
                PGA.initCanvas();
            }
            else{
                if(PGA.renderIntervalID == null){
                    PGA.renderIntervalID = setInterval("PGA.canvasRenderLoop()", PGA.updateInterval);
                }
            }
        });
    });



PGA.initCanvas = function(){
    var canvas = document.getElementById("graph-canvas");
    if (canvas.getContext) {
        canvasContext = canvas.getContext("2d");

        canvasContext.fillStyle = "rgb(200,0,0)";
        canvasContext.fillRect (10, 10, 55, 50);

        canvasContext.fillStyle = "rgba(0, 0, 200, 0.5)";
        canvasContext.fillRect (30, 30, 55, 50);

        canvasContext.fillStyle = "rgb(200,200,200)";
        canvasContext.fillRect(0, 0, 640, 480);

        //canvasContext.beginPath();
        //canvasContext.arc(320, 240, 10, 0, 2*Math.PI, 0);
        //canvasContext.fill();
        PGA.renderIntervalID = setInterval("PGA.canvasRenderLoop()", PGA.updateInterval);
    }
}

PGA.canvasRenderLoop = function(){
    function sinExp(t){
        return Math.sin(0.02*t*Math.exp(0.0003*t))*Math.exp(-0.001*t);
        //return Math.sin(0.01*t);
    }
    function myCos(t){
        return Math.cos(0.01*t);
    }
    function renderPlot(f,t,color){
        canvasContext.fillStyle = color;
        canvasContext.fillRect(0 + (t % width), 0.5*height*(1 - f(t)) - 1, 1, 2);
    }
    canvasContext.fillStyle = "rgb(255,255,255)";
    //canvasContext.fillRect(0, 0, 640, 480);
    //canvasContext.translate(time, 0);
    var width = 640;
    var height = 480;
    canvasContext.fillRect(0+(PGA.time % width), 0, 1, height);

    canvasContext.fillStyle = "rgba(255,0,0,0.5)";
    canvasContext.fillRect(0+((PGA.time + 1) % width), 0, 1, height);

    //canvasContext.fillStyle = "rgba(0, 0, 200, 0.5)";
    //canvasContext.fillRect(0+(time % width), 0.5*height*(1-fRender(time))-1, 1, 2 );
    renderPlot(sinExp, PGA.time, "rgba(0, 0, 200, 0.5)");

    renderPlot(myCos, PGA.time, "rgba(0, 200, 0, 0.5)");
    //alert(Math.abs(fRender(time)-fRender(time+2)));
    PGA.time += 1;
}

PGA.initFunctions = function(){
    PGA.parameters = {
        maximumType: ["local", "global"],
        encoding: ["binary", "gray", "exponential"],
        populationSize: {
            required: true,
            number: true,
            digits: true,
            range: [2, 1000]
        },
        parentReplacementRate: {
            required: true,
            number: true,
            range: [0, 100]
        },
        selectionType: ["roulette", "tournament"],
        crossingOverProbability: {
            required: true,
            number: true,
            range: [0, 100]
        },
        mutationProbability: {
            required: true,
            number: true,
            range: [0, 100]
        }
    };
    PGA.defVals = {
        maximumType: "global",
        encoding: "exponential",
        allowedEncodings: ["binary", "exponential"],
        populationSize: 125,
        parentReplacementRate: 80,
        selectionType: "tournament",
        crossingOverProbability: 90,
        mutationProbability: 5
    };

    PGA.functions = {
        sin: {
            properties: object(PGA.defVals)//prototypally inherit from default vals
        },
        cos: {
            properties: object(PGA.defVals)
        }
    }
    //tweek the specific properties to suit the function
    PGA.functions.sin.properties.crossingOverProbability = 80;
    PGA.functions.cos.properties.mutationProbability = 10;
    PGA.functions.cos.properties.allowedEncodings = ["gray", "exponential"];
    PGA.activeFunction = {
        name: null, //string containing the name
        properties: null //reference to corresponding properties
    };
    PGA.activeFunction.update = function(newName) {
        PGA.activeFunction.name = newName;
        //searching in the functions object for needed properties and keepeng reference to them
        PGA.activeFunction.properties = PGA.functions[PGA.activeFunction.name].properties;
        //add limitation of possible encodings
        $("#encoding > *").attr("disabled","disabled");
        for(var enc in PGA.activeFunction.properties.allowedEncodings){
            $("#encoding > [value=" + PGA.activeFunction.properties.allowedEncodings[enc] + "]").removeAttr("disabled");
        }
        //re-render options with the values of new function
        for(var v in PGA.activeFunction.properties){
            $("#"+v).val(PGA.activeFunction.properties[v]);
        }
        $("#optionsForm").validate().form();
    }


}

PGA.renderFunctionOptions = function(){

    var formHTML = "";//a variable for bulk aggregation of html text to provide for $("#id").append(formHTML)

    //first render the dropdown box for functions list
    formHTML = "<form id='functionsForm'>";
    formHTML += "<label for='functions'>Function</label>";
    formHTML += "<select id='functions'>";
    for(var f in PGA.functions){
        formHTML += "<option value='" + f + "'>" + f + "</option>";
    }
    formHTML += "</select></form>";
    $("#fs").append(formHTML);
    
    //when user changes the function in the dropdown box we must change the values in the properties
    //corresponding to the function chosen
    $("#functions").change(function () {
        PGA.activeFunction.update( this.value );
    });

    
    var validationRules = {};

    for(var parameterKey in PGA.parameters){
        var parameterValue = PGA.parameters[parameterKey];
        //clear the innerHTML aggreagtor
        formHTML = "";

        //the label is needed for both dropdown box and input
        formHTML+="<label for='" + parameterKey + "'>" + parameterKey.camel2human() + "</label>";
        if(parameterValue instanceof Array){
            //open label and select tag
            formHTML+="<select id='" + parameterKey + "'>";
            for(var index in parameterValue){
                //add option
                var parameterOption = parameterValue[index];
                formHTML+="<option value='" + parameterOption + "'>" + parameterOption + "</option>";
            }
            //close select tag
            formHTML+="</select><br />";
            } else{
            if (parameterValue instanceof Object) {
                //add label and input tag
                formHTML+="<input id='" + parameterKey + "' name='" + parameterKey + "' /><br />";
                //remember validation rules for input
                validationRules[parameterKey] = parameterValue;
            }
        }
        console.log($("#optionsForm"));
        $("#optionsForm").append(formHTML);
        $("#"+parameterKey).change(function (pk) {
            return function() {
                //change the value in properies only if it is valid
                if($("#optionsForm").validate().element("#"+pk)){
                    PGA.activeFunction.properties[pk] = this.value;
                }
            }
        }(parameterKey));
    }

    //apply the validation rules
    $("#optionsForm").validate({
        rules: validationRules
    });
    //set option in select by value
    //$("#maximumType").val('global');


    /*for(var v in vals){
        $("#"+v).val(vals[v]);
    }
    console.log(JSON.stringify(vals));*/

    //since the properties' fields are still empty, though some function is chosen
    //we must manually fire the update method
    PGA.activeFunction.update( $("#functions").val() );

}
