var express = require('express');
var morgan     = require('morgan');
var connect = require('connect');
var app     = express();
var router  = express.Router();
var bodyParser = require('body-parser');
const spawn = require("child_process").spawn;
var scanUtils = require('./scanUtils');

var server_port = process.env.PORT || 8010;
cors = require('cors');
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app vars



var fs = require('fs');
var configSettings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

g_deviceName= configSettings.deviceName || scanUtils.getHostName();
g_agentCTL= configSettings.agents;

app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
	next();
});

app.use(cors());
//================LandingPage
router.get("/", function(req, res){
  data = "<H1>Device Info</h1>";
  data += "<h2>Network Interfaces</h2>"+scanUtils.getIPInfo("html");
  data += "<h2>Hostname</h2><li>"+scanUtils.getHostName();
  data += "<h2>Device Name</h2><li>"+g_deviceName;
  data += "<h2>Supported API Calls:</h2>";
  
  var fs = require('fs'),
      path = require('path'),    
      filePath = path.join(__dirname, 'start.html');

  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data2){
    if (!err) {
        console.log('received data: ' + data2);
        res.send(data+data2).end();
    } else {
        console.log(err);
    }
});
  
});

//===============Service Calls
//Return the device name as a JSON object, if no name is set, use MAC/Hostname
router.get("/deviceName", function(req, res) {
	res.json({value: g_deviceName}).end();
});

//Set the device name
router.put("/deviceName", function(req, res){
	console.log(req.query.name)
	g_deviceName=req.query.name;
	updatePreferences();
	res.status(200).end();
	
});


router.get("/discover", function(req, res){
	
	
	res.json({hostname:scanUtils.getHostName() , ip: scanUtils.getIP("wlan0") , deviceName: g_deviceName}).end(); 

});

router.put("/provision", function(req, res){
	
	
	res.json({value: g_deviceName}).end(); 

});

router.put("/display", function(req, res){
  
  var ln1=req.query.line1 ? req.query.line1 : "line1";
 // if(req.body.value!=null) { ln1 = req.body.value }
  var ln2=req.query.line2 ? req.query.line2 : "line2";
  var ln3=req.query.line3 ? req.query.line3 : "line3";
  
    const pythonProcess = spawn('python',[ "pyscripts/updateDisplay.py", ln1, ln2, ln3]);
  res.status(200).end();
  
});


router.get("/allData", function(req, res){
  
    const pythonProcess = spawn('python',[ "pyscripts/allData.py"]);
	pythonProcess.stdout.on('data', function (data){
	res.send(data).end();
	});
  //res.status(200).end();
  
});


router.get("/environment", function(req, res){
	const pythonProcess = spawn('python',[ "pyscripts/allData.py"]);
	pythonProcess.stdout.on('data', function (data){
	var environmentData = JSON.parse(data).Environment;
	res.json(environmentData).end();
	});
});

router.put("/blink", function(req, res){
	const pythonProcess = spawn('python', ["pyscripts/blink.py"]);
	res.status(200).end();
});

//================Supporting functions


function updatePreferences(){
 	var newPrefs = scanUtils.createPreferences(g_deviceName, g_deviceType, pinMap);
	var fs = require('fs');
	var fd = fs.openSync('./settings.json', 'w');
	fs.write(fd, JSON.stringify(newPrefs));
	
  }


function defaultLoop(){
	
	}

//=====================================================================(main loop)
app.use('/', router);
app.listen(server_port);
console.log("Sensor Server Started, Port: "+server_port);
const displayProcess = spawn('python',[ "pyscripts/updateDisplay.py", "Data Server Running"]);
setInterval(defaultLoop, 1000);
