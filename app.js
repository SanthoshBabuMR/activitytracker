var express      	= require("express"),
    bodyParser      = require('body-parser')
    app		        = express(),
	router          = express.Router(),
    routeHandler    = require("./routes"),
    fileHandler     = require("./file");    

app.use(express.static("public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/", router);
router.get("/", function(req, res) {
    // TODO: probably send a index.html
    res.send("welcome to activity tracker!");
});

//CREATE
router.put("/:date", function(req, res) {
    // create activity ( task / commit ) for given date  based on REQUEST params;
    // return the entire activity list for the given date;
    routeHandler.addActivity(req, res);
});

//READ
router.get("/list/:from/:to", function(req, res) {
    // get all activity ( task / commit ) for given date range;
    routeHandler.getActivity(req, res);
});

router.get("/list/:from/:to/:type", function(req, res) {
    // get specific activity ( task / commit ) for given date range;
    routeHandler.getActivity(req, res);
});

router.get("/:date", function(req, res) {
    // get all activity ( task / commit ) for given date;
    routeHandler.getActivity(req, res);
});

router.get("/:date/:type", function(req, res) {
    // get all records within a specific activity ( task / commit ) for given date;
    routeHandler.getActivity(req, res);
});

router.get("/:date/:type/:id", function(req, res) {
    // get a specific record within a specific activity ( task / commit ) for given date;
    routeHandler.getActivity(req, res);
});


//UPDATE
router.post("/:date", function(req, res) {
    // update activity ( task / commit ) for given date  based on REQUEST params;
    // return the entire activity list for the given date;
    routeHandler.updateActivity(req, res);
});

//DELETE
router.delete("/:date", function(req, res) {
    // delete activity ( task / commit ) for given date based on REQUEST params;
    routeHandler.removeActivity(req, res);
});

//HANDLE INVALID REQUEST
router.all("*", function(req,res) {
    routeHandler.noSuchOption( req, res );
});

app.listen(6060,function(){
    fileHandler.createStorage( function(err){
        if(err){
            console.log("Error creating 'storage' folder");
        }
        console.log("activity tracker server listening on port 6060");
    });	
});
