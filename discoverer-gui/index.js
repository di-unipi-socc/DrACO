var express = require('express')
	, serveStatic = require('serve-static')
	, cors = require('cors');

var app = express();

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(serveStatic(__dirname + '/public'));
app.listen(80);
