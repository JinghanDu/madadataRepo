var express = require('express');
var app = express();
var hbs = require('hbs');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./stock.db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(express.static('./'));

app.get('/', function(req,res) {
	res.sendfile('index.html');
});

app.post('/', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var sName = req.body.stockName; 
  var sDate = req.body.stockDate;
  console.log(sName);
  var sqlRequest = "SELECT * FROM stockInfo WHERE stockName = '" + sName + "' AND Date = '" + sDate + "' ";
  db.all(sqlRequest, function(err, result) {
      if (err !== null) {
         next(err);
      } 
      else {
         if (result.length > 0){
            res.send(JSON.stringify(result));
         }
         else {
        	res.send(JSON.stringify("Not Found"));
         }
      }
   });



  //res.send("hi");
});
app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});