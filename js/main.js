var functionName;
var maximumType;
var encodingType;
var populationSize;
var parentReplacement;
var selectionType;
var crossingoverProbability;
var mutationProbability;
var stopCriterion;

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
