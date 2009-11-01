var functionName;
var maximumType;
var encodingType;
var populationSize;
var parentReplacement;
var selectionType;
var crossingoverProbability;
var mutationProbability;
var stopCriterion;
var canvasContext;
var time = 0;

$(document).ready(function(){
        $("#tabs").tabs();
        $('#tabs').bind('tabsselect', function(event, ui) {
                if(ui.index==0){
                    updateOptions();
                    renderOptions();
                }
            });
        updateOptions();
        renderOptions();
        initCanvas();
        });

function updateOptions(){
    functionName = $("#function-chooser-selector").val();
    maximumType = $("input[name=maximum]:checked").val();
    encodingType = $("#encoding-chooser-selector").val();
    populationSize = $("#population-size").val();
    parentReplacement = $("#parent-replacement-percent").val();
    selectionType = $("#selection-chooser-selector").val();
    crossingoverProbability = $("#crossing-over-percent").val();
    mutationProbability = $("#mutation-percent").val();
    stopCriterion = $("#stop-criterion-chooser-selector").val();
}

function optionsRenderHelper(text, value){
    $("#result-options").append(text + " - " + value + "<br>");
}

function renderOptions(){
    $("#result-options").html("");
    optionsRenderHelper("Function", functionName);
    optionsRenderHelper("Maximum", maximumType);
    optionsRenderHelper("Encoding", encodingType);
    optionsRenderHelper("Population", populationSize);
    optionsRenderHelper("Parent replacement", parentReplacement);
    optionsRenderHelper("Selection", selectionType);
    optionsRenderHelper("Crossing over", crossingoverProbability);
    optionsRenderHelper("Mutation", mutationProbability);
    optionsRenderHelper("Stop criterion", stopCriterion);
}

function initCanvas(){
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
        setInterval("canvasRenderLoop()", 40);
    }
}

function canvasRenderLoop(){
    canvasContext.fillStyle = "rgb(255,255,255)";
    //canvasContext.fillRect(0, 0, 640, 480);
    //canvasContext.translate(time, 0);
    var width = 640;
    var height = 480;
    canvasContext.fillRect(0+(time % width), 0, 1, height);

    canvasContext.fillStyle = "rgba(255,0,0,0.5)";
    canvasContext.fillRect(0+((time + 1) % width), 0, 1, height);

    canvasContext.fillStyle = "rgba(0, 0, 200, 0.5)";
    canvasContext.fillRect(0+(time % width), 0.5*height*(1-Math.sin(0.02*time*Math.exp(0.0003*time))*Math.exp(-0.001*time)), 2, 2);
    time += 1;
}
