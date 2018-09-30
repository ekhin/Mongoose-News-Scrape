var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require('cheerio');
var trimNewlines = require('trim-newlines');
var trim = require('trim-whitespace');

var newModel = require('../models/new.js');

router.get("/", (req, res)=>{
	res.redirect("/home");
});

router.get('/home', (req, res) => {
    res.render('index');
});

const news = "https://www.nytimes.com/section/technology"

router.get("/news", (req, res)=> {
	request(news, (error, response, html)=>{
		var $ = cheerio.load(html);
		var results = [];
		$(".story-body").each(function(i, e){ 
			
			var title = $(e).children("a").children(".story-meta").children("h2").text();
			var summary = $(e).children("a").children(".story-meta").children(".summary").text() || "";
			var byline = $(e).children("a").children(".story-meta").children(".byline").text() || ""; 
			var link = $(e).children("a").attr("href");
			var img = $(e).children("a").children(".wide-thumb").children("img").attr("src") || "";
			if(title != "" && link != undefined){
				title = trim.trailing(trim.leading(trimNewlines(title)));
				results.push({
					title: title,
					summary: summary,
					link: `https://www.bbc.com${link}`,
					byline: byline,
					img: img
				});
			}

		});
		// for(var i=0; )
		// var model = new newModel()
		// res.status(200).send(results);
	});
});


module.exports = router;