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
var updateInterval;
var renderIntervalID = null;

$(document).ready(function(){
        funcs.test();
        $("#tabs").tabs();
        $('#tabs').bind('tabsselect', function(event, ui) {
                if(ui.index==0){
                    updateOptions();
                    renderOptions();
                }
            });
        updateOptions();
        renderOptions();

        initGA();

        initCanvas();
        
        $(".ui-icon-stop").click(function() {
            time = 0;
            clearInterval(renderIntervalID);
            renderIntervalID = null;
            });

        $(".ui-icon-pause").click(function() {
            clearInterval(renderIntervalID);
            renderIntervalID = null;
            });

        $(".ui-icon-play").click(function() {
                if(time == 0){
                    initCanvas();
                }
                else{
                    if(renderIntervalID == null){
                        renderIntervalID = setInterval("canvasRenderLoop()", updateInterval);
                    }
                }
            });
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
    updateInterval = $("#update-interval").val();
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
    optionsRenderHelper("Update interval", updateInterval);
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
        renderIntervalID = setInterval("canvasRenderLoop()", updateInterval);
    }
}

function canvasRenderLoop(){
    function sinExp(t){
        return Math.sin(0.02*time*Math.exp(0.0003*t))*Math.exp(-0.001*t);
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
    canvasContext.fillRect(0+(time % width), 0, 1, height);

    canvasContext.fillStyle = "rgba(255,0,0,0.5)";
    canvasContext.fillRect(0+((time + 1) % width), 0, 1, height);

    //canvasContext.fillStyle = "rgba(0, 0, 200, 0.5)";
    //canvasContext.fillRect(0+(time % width), 0.5*height*(1-fRender(time))-1, 1, 2 );
    renderPlot(sinExp, time, "rgba(0, 0, 200, 0.5)");

    renderPlot(myCos, time, "rgba(0, 200, 0, 0.5)");
    //alert(Math.abs(fRender(time)-fRender(time+2)));
    time += 1;
}
