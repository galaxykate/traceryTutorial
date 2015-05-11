/**
 * @author Kate
 */

var visKate = {
    init : function() {

    },

    calculateConnections : function(symbol) {

    },

    createGraph : function(grammar, startSymbol) {
        console.log(grammar);
        console.log(startSymbol);
        var rootSymbol = currentGrammar.symbols[startSymbol];

        var nodes = [];
        var edges = [];
        function addNode(label) {
            var n = {
                id : nodes.length,
                label : label,
            };
            nodes.push(n);
            return n;
        }

        function createRules(symbol, node) {
            console.log(symbol);
            for (var i = 0; i < symbol.baseRules.rules.length; i++) {
                var rule = symbol.baseRules.rules[i];
                console.log(rule);
                var n = addNode("");

                edges.push({
                    from : node.id,
                    to : n.id

                });
            }
        }

        var root = addNode(rootSymbol.key);
        createRules(rootSymbol, root);

        // create a network
        var container = document.getElementById('rightWindow');
        var data = {
            nodes : nodes,
            edges : edges
        };
        var network = new vis.Network(container, data, {});
    },

    onGrammarChange : function(grammar, origin) {
        this.createGraph(grammar, origin);
    },
};
