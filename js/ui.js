var ui = {
    currentMode : 0,

    init : function() {

        // Buttons

        $("#clearStorage").click(function() {
            localStorage.setItem("databaseID", null);
            console.log("cleared stored id:" + localStorage.getItem("databaseID"));
        });

        $("#toggleVizMode").click(function() {
            ui.toggleVizMode();
        });

        var originHolder = $("#originSymbol");

        originHolder.text("#origin#");

        originHolder.get(0).addEventListener("input", function() {
            ui.updateOrigin();
        }, false);
        ui.updateOrigin();
        
           visKate.init();
      visBen.init();
 
    },

    refreshExamples : function() {
        console.log("Refresh");
        var output = $("#examples");
        output.html("");

        for (var i = 0; i < 10; i++) {
            if (currentGrammar) {
                var s = currentGrammar.flatten(ui.originWord);
                var div = $("<div/>", {
                    class : "example",
                    html : s
                }).appendTo(output);
            }
        }
    },

    updateOrigin : function() {
        ui.originWord = $("#originSymbol").text();
        console.log("New origin: " + ui.originWord);
        ui.refreshExamples();
    },

    hideWindow : function() {
        $("#rightWindow").addClass("minimized");
        $("#output").addClass("maximized");
    },

    showWindow : function() {
        $("#rightWindow").removeClass("minimized");
        $("#output").removeClass("maximized");
    },

    hideBar : function() {
        $("#bottomBar").addClass("minimized");
        $("#centerBar").addClass("maximized");
    },

    showBar : function() {
        $("#bottomBar").removeClass("minimized");
        $("#centerBar").removeClass("maximized");
    },

    setVizMode : function(mode) {
        if (isNaN(mode) || mode === null || mode === "null") {
            mode = 0;
        }
        ui.currentMode = mode;
        switch(  ui.currentMode) {
        case 0:
            ui.hideWindow();
            ui.hideBar();
            break;
        case 1:
            ui.hideWindow();
            ui.showBar();
            break;
        case 2:
            ui.showWindow();
            ui.hideBar();
            break;
        default:
            console.log("Unknown mode");
        }

        $("#vizMode").text(ui.currentMode);
        // remember the mode
        localStorage.setItem("vizMode", ui.currentMode);
    },

    toggleVizMode : function() {
        console.log("Toggle mode");
        ui.setVizMode((ui.currentMode + 1) % 3);

    }
};
