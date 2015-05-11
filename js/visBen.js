/**
 * @author Ben
 */

var visBen = {
    init : function() {
        $("#bottomBar").html("visualization!");
    },

    onGrammarChange : function(grammar, origin) {
        $("#bottomBar").html("Some some stuff about the grammar!");
    },
};
