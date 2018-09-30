var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var request = require("request");
var cheerio = require('cheerio');
var trimNewlines = require('trim-newlines');
var trim = require('trim-whitespace');

var commentModel = require("../models/comment.js");
var newModel = require("../models/new.js");
mongoose.set('useFindAndModify', false);
const news = "https://www.nytimes.com/section/technology"

router.delete("/scrapeNews", (req, res)=> {
	var model = new newModel();
	newModel.deleteMany({title:"LendingClub Founder, Ousted in 2016, Settles Fraud Charges"}, (error, response)=>{
		res.send(response);
	})
});

router.get("/scrapeNews", (req, res)=> {
	var model = new newModel();
	newModel.find({},{}, {limit:20, title: 'asc'}, (error, response)=>{
		res.send(response);
	});
});

router.post("/comments", (req, res)=>{
	var comments = {}
	comments['comment'] = req.body.comment
	var cModel = new commentModel(comments);
	cModel.save((err, response)=>{
		if(err) return res.send(err);
		newModel.findOneAndUpdate({_id:req.body._id},{$push:{"comments":cModel}}, {new:true,upsert:true},(error, result)=>{
			res.send(result);
		});
	});

});
router.get("/comments/:newsId", (req, res)=>{
	var newsId = req.params.newsId;
	commentModel.findOne({_id:newsId},(err, response)=>{
		if(err) return res.send(err);
		res.send(response);

	});

});

router.delete("/comments/:id", (req, res)=>{
	var commentId = req.params.id;
	if(!commentId){
		return res.send("Error: Invalid comment!");
	}
	newModel.findOneAndUpdate({_id:req.body.id},{$pull:{"comments":commentId}}, {upsert:true, new: true},(err, response)=>{
		if(err) return res.send(err);

	});
	commentModel.deleteOne({_id:commentId},(e,r)=>{
		res.send(r);
	});

});

router.delete("/:id", (req, res)=>{
	var newsId = req.params.id;
	if(!newsId){
		return res.send("Error: Invalid news!");
	}
	newModel.deleteOne({_id:newsId}, (err,response)=>{
		if(err) return res.send(err);
		res.send(response);
	});
});

router.post("/news", async(req, res)=>{
	var newData = await getNews();
	var newDocument = [];
	for(var i=0;i<newData.length;i++){
		var data = newData[i];
		newModel.findOneAndUpdate({link:data.link}, data, {upsert:true, new: true}, (err, response)=>{
			newDocument.push(response);
		});
	}
	res.status(200).send({Message: "Data successfully saved!"});
});

function getNews(){
	return new Promise(function(fulfill){

		request(news, (err,response, html)=>{
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
						link: `${link}`,
						byline: byline,
						img: img
					});
					
				}
			});
			fulfill(results);
		});
		
	});

	
}

module.exports = router;