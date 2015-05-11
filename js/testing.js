/**
 * @author Kate
 */

function validateGrammar(s) {
    s = s.trim();

    var errors = [];
    function addError(index, text) {
        errors.push({
            index : index,
            text : text,
        });
    }

    if (s.charAt(0) !== "{") {
        addError(0, "Your grammar should start with a '{'");
    } else {
        //     s = s.substring(1, s.length);
    }
    if (s.charAt(s.length - 1) !== "}") {
        addError(s.length - 1, "Your grammar should end with a '}'");
    } else {
        //  s = s.substring(0, s.length - 1);
    }
    s.trim();

    // Split into lines
    var inQuotes = false;
    var inBrackets = false;
    var lastQuoteSection = "";
    var lastUnquotedSection = "";
    var hasQuoteError = false;

    var lastColonAt = -1;

    var lastQuote = -1;
    var expectingNewSymbol = true;
    var currentSymbol = undefined;
    var currentRules = undefined;

    var expectingRules = false;

    function hasNoDataToNext(start, c) {
        var index = s.indexOf(c, start + 1);
        if (index < 0)
            return false;
        //  console.log(start + " " + c + ": " + s.substring(start + 1, index));
        return s.substring(start + 1, index).trim().length === 0;
    }

    for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        switch(c) {
        case '"' :
            if (inQuotes) {
                lastQuoteSection = s.substring(lastQuote + 1, i);

                if (expectingRules)
                    expectingRules = false;

            } else {
                lastUnquotedSection = s.substring(lastQuote + 1, i);
            }
            inQuotes = !inQuotes;
            lastQuote = i;
            break;
        case "[":
            if (!inQuotes) {
                if (expectingNewSymbol) {
                    addError(i, "Started rules without naming the symbol");
                }
                if (inBrackets)
                    addError(i, "Unmatched open bracket:'['");
                else {
                    inBrackets = true;
                }
            }
            break;
        case "]":
            if (!inQuotes) {
                if (!inBrackets)
                    addError(i, "Unmatched closing bracket: ']'");
                else {
                    if (expectingRules)
                        addError(i, "No rules for symbol " + currentSymbol);
                    inBrackets = false;
                    currentRules = s.substring();
                }
            }
            break;

        case "{":

            break;
        case "}":
            break;

        case ":":
            if (!inQuotes) {
                currentSymbol = lastQuoteSection;
                expectingNewSymbol = false;
                expectingRules = true;
                lastColonAt = i;
            }
            break;

        case ",":
            if (hasNoDataToNext(i, "}"))
                addError(i, "Last item in the grammar should not have a comma");
            if (hasNoDataToNext(i, ","))
                addError(i, "Two commas in a row!");

            if (!inQuotes) {
                if (inBrackets) {
                    // Dangers: is this the last item in a list?
                    if (hasNoDataToNext(i, "]"))
                        addError(i, "Last item in a list should not have a comma");

                } else {
                    currentRules = s.substring(lastColonAt + 1, i);
                    expectingNewSymbol = true;
                }

            }
            break;
        default:
            if (!inQuotes) {
                if (/\s/.test(c)) {

                } else {
                    if (!hasQuoteError) {
                     hasQuoteError = true;
                    addError(i, "Unexpected character outside of quotation marks:'" + c + "'" + s.charCodeAt(i));
               }
                }
            }
            break;
        }
    }

    var errorDiv = $("#errors");
    errorDiv.html("Parsing....<br>");

    for (var i = 0; i < errors.length; i++) {
        errorDiv.append(errors[i].index.toString().paddingLeft("    ") + ": " + errors[i].text + "<br>");
    }
    if (errors.length === 0) {
        errorDiv.append("No errors!");
    }

};
