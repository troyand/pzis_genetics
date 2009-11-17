//main global object
//PZIS genetic algorithms
var PGA = {};


PGA.time = 0;//time counter; each step gets incremented by 1
PGA.updateInterval = 40;//25 fps
PGA.renderIntervalID = null;

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
$(document).ready(function(){
    console.log(PGA);
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



