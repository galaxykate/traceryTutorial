/**
 * @author Kate Compton
 */

var currentGrammar;
console.log("App");

$(document).ready(function() {
    console.log("Start");

    ui.init();

    String.prototype.paddingLeft = function(paddingValue) {
        return String(paddingValue + this).slice(-paddingValue.length);
    };
    var vizMode = parseInt(localStorage.getItem("vizMode"));
    ui.setVizMode(vizMode);
    // io.init();
    //  io.authenticate();
    var count = 0;

    var grammarRaw = {

        name : ["Artemesia", "Beatrix", "Cordelia", "Daphne", "Eloise", "Francesca", "Georgina", "Heloise", "Ingrid", "Josephine", "Katrina", "Louisa", "Maribelle", "Nanette", "Ophelia"],
        surnameStart : "Chest West Long East North River South Snith Cross Aft Aver Ever Down Whit Rob Rod Hesel Kings Queens Ed Sift For Farring Coven Craig Cath Chil Clif Grit Grand Orla Prat Milt Wilt Berk Draft Red Black".split(" "),
        surnameEnd : "castle hammer master end wrench bottom hammer wick shire gren glen swith bury every stern ner brath mill bly ham tine field groat sythe well bow bone wind storm horn thorne cart bry ton man watch leath heath ley".split(" "),
        surname : ["#surnameStart##surnameEnd#"],

        firstSyl : "B C D F G H J K L M N P Qu R S T V W X Y Z St Fl Bl Pr Kr Ll Chr Sk Br Sth Ch Dhr Dr Sl Sc Sh Thl Thr Pl Fr Phr Phl Wh".split(" "),
        middleSyl : "an all ar art air aean af av ant app ab er en eor eon ent enth irt ian ion iont ill il ipp in is it ik ob ov orb oon ion uk uf un ull urk".split(" "),
        lastSyl : "a ia ea u y en am is on an oo io i el ios ius ian ean ekang anth ".split(" "),
        scifiWord : ["#firstSyl##lastSyl#-#firstSyl##lastSyl#", "#firstSyl##middleSyl##lastSyl#"],
        scifiName : ["#firstSyl##middleSyl##lastSyl#", "#firstSyl##middleSyl##middleSyl##lastSyl#"],

        animal : "amoeba mongoose capybara yeti dragon unicorn sphinx kangaroo boa nematode sheep quail goat corgi agouti zebra giraffe rhino skunk dolphin whale bullfrog okapi sloth platypus grizzly moose elk dikdik ibis stork finch nightingale goose robin eagle hawk iguana tortoise panther lion tiger gnu reindeer raccoon opossum".split(" "),
        mood : "vexed indignant impassioned wistful astute courteous benevolent convivial mirthful lighthearted affectionate mournful inquisitive quizzical studious disillusioned angry bemused oblivious sophisticated elated skeptical morose gleeful curious sleepy hopeful ashamed alert energetic exhausted giddy grateful groggy grumpy irate jealous jubilant lethargic sated lonely relaxed restless surprised tired thankful".split(" "),
        color : "ivory silver ecru scarlet red burgundy ruby crimson carnelian pink rose grey pewter charcoal slate onyx mahogany brown green emerald blue sapphire turquoise aquamarine teal gold yellow carnation orange lavender purple magenta lilac ebony amethyst garnet".split(" "),
        adventure : "lament story epic tears wish desire dance mystery enigma drama path training sorrows joy tragedy comedy riddle puzzle regret victory loss song adventure question quest vow oath tale travels".split(" "),

        story : "Once there lived a #mc_species# named #mc_name#. #mc_name# was very #mc_adj#, but wanted more than anything to be #mc_goalAdj#.",
        title : "<div class='title'>The #adventure.capitalize# of the #mc_adj.capitalize# #mc_species.capitalize#</div>",
        book : "#title##story#",
        origin : "#[mc_species:#animal#][mc_name:#scifiName#][mc_adj:#mood#][mc_goalAdj:#mood#]book#"

    };

    var grammarRaw2 = {

        animal : "amoeba mongoose gnu reindeer raccoon opossum".split(" "),
        mood : "vexed sated lonely relaxed restless surprised tired thankful".split(" "),
    };

    function escapeHTML(s) {
        var s = s.replace(/</g, "&#60;");
        var s = s.replace(/>/g, "&#62;");

        return s;
    };

    currentGrammar = tracery.createGrammar(grammarRaw);

    io.userName = currentGrammar.flatten("#mood.capitalize##color.capitalize##animal.capitalize#");
    $("#username").val(io.userName);
    var json = currentGrammar.toJSON();
    json = escapeHTML(json);
    json = json.replace(/\n/g, "<p/>");
    $("#grammarText").html(json);

    var grammarDiv = $("#grammar");

    grammarDiv.get(0).addEventListener("input", function() {
        reparseGrammar();
    }, false);

    reparseGrammar();

    function reparseGrammar() {
        var s = grammarDiv.text();
        s.trim();
        s = s.replace(/<br\/>/g, "");

        //  grammarDiv.html(s);
        var isValid = validateGrammar(s);

        var obj = JSON.parse(s);
        if (obj) {
            console.log("Successful parse");
            currentGrammar = tracery.createGrammar(obj);
            ui.refreshExamples();
        }

        visKate.onGrammarChange(currentGrammar, "origin");
        visBen.onGrammarChange(currentGrammar, "origin");

    }

});
