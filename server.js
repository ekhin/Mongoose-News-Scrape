var express = require('express');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var request = require('request');

var app = express();
var PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/"));
app.engine('handlebars', expressHandlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var apiRoute = require("./controllers/apiRoutes.js");
var htmlRoute = require("./controllers/htmlRoutes.js");
if(process.env.MONGODB_URI){
	mongoose.connect(process.env.MONGODB_URI, (err, connect) =>{
		if(err) return console.log("Connection error: " + err);
		console.log("MongoDB connection success");
	});
}else{
	mongoose.connect('mongodb://localhost:27017/scrapedNews', { useNewUrlParser: true }, (err, connect) =>{
		if(err) return console.log("Connection error: " + err);
		console.log("MongoDB connection success");
	});
}


app.use("/", htmlRoute);
app.use("/api/v1", apiRoute);



app.listen(PORT, ()=>{
	console.log("App is listening at port => " + PORT);
});