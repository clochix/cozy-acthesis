//jshint node: true
var express    = require('express'),
    http       = require('http'),
    bodyParser = require('body-parser'),
    acthesis   = require('acthesis'),
    path       = require('path'),
    app, port, host, httpServer;
process.on('uncaughtException', function (err) {
  "use strict";
  console.error("Uncaught Exception");
  console.error(err);
  console.error(err.stack);
});

app = express();
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));

port = process.env.PORT || 9250;
host = process.env.HOST || "127.0.0.1";

// Serve static content
app.use(express.static(path.join(__dirname, '/public/')));

// Enable CORS
app.use(function (req, res, next) {
  "use strict";
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Requester");
  next();
});

// Starts the server
httpServer = http.createServer(app).listen(port, host, function () {
  "use strict";
  console.log("Server listening to %s:%d within %s environment", host, port, app.get('env'));
});

// Web activities
app.use(acthesis({httpServer: httpServer}));
