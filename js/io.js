/**
 * @author Kate
 */

var url = "https://glaring-fire-2118.firebaseio.com";
var tutorialUrl = "https://dhv67bo2zng.firebaseio-demo.com/";

var io = {

    userName : "VelourMoose",

    authData : null,
    init : function() {
        var ref = new Firebase(url);
        var usersRef = ref.child("users");

    },
    authenticate : function() {
        ref.authAnonymously(function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);

                io.authData = authData;
                io.databaseID = localStorage.getItem("databaseID");
                if (io.databaseID !== null && io.databaseID !== undefined && io.databaseID !== "null") {
                    console.log("has databaseID: ", io.databaseID);
                } else {
                    console.log("No existing id, create one");
                    var date = (new Date()).toISOString();

                    var startInfo = {
                        userName : io.userName,
                        started : date,
                        onTutorial : Math.floor(Math.random() * 10)
                    };

                    console.log(startInfo);
                    var newUser = usersRef.push(startInfo);
                    io.databaseID = newUser.key();
                    console.log("has databaseID: " + io.databaseID);
                    console.log(io);

                    // Store
                    localStorage.setItem("databaseID", io.databaseID);
                    // Retrieve
                }
            }

            $("#dbID").text(io.databaseID);
        });
    }
};
