$(document).ready(function(){
	function ajaxCall(data, type, url){
		return $.ajax({
			type: type,
			url: url,
			data: data,
			success: function(result){
				return result;
			}

		});
	}


	function openDialog(message){
		$("<div title='User Comments' id='dialog'>"+ message +"</div>").dialog();
	}

	$("body").on("click", ".readComments", function(event){
		var articleId = this.id;
		var urlComment = "/api/v1/comments/";
		var comments = $("<div title='User Comments' id='commentModal'>");
		var commentIdList = this.value;
		commentIdList = commentIdList.split(",");

		if(commentIdList.length <= 0 || commentIdList[0] === ""){
			comments.append("<p> There are no comments for this article!");
		}else{
			for(var i=0; i< commentIdList.length; i++){
				ajaxCall({}, "GET", urlComment+commentIdList[i]).then(function(resCom){
					comments.append("<hr><button class='delComment' id='"+ resCom._id +"' value='"+articleId+"'>x</button><p>"+resCom.comment+"</p><br>")
				});
			}
		}

		comments.dialog();

	})
	function drawNewsList(){
		var url = "/api/v1/scrapenews";
		var urlComment = "/api/v1/comments/";
		ajaxCall({}, "GET", url).then(function(res){

			var card = $("#news").empty();
			for(var i=0; i< res.length; i++){
				var eachRow = "<div class='card w-75'><div class='card-body'>" + 
					"<button class='save saveButton' style='float: right;' id='"+res[i]._id+"' value='"+JSON.stringify(res[i])+"'>save article</button>"+
					"<img class='images' src='"+res[i].img+"'>" +
					"<h4 class='card-title'>"+res[i].title+"</h4>" +
					"<p class='card-text'>"+res[i].summary+"</p>"+
					"<p >" + res[i].byline + "</p>" +
					"<a class='link' href="+res[i].link+">click here to read more!</a><br>" +
					"<label>comment: </label> &nbsp&nbsp <input type='text' id='"+i+"'>"+
					"<button class='submit writeComments' id='"+res[i]._id+ " "+ i+"'>submit</button>" +
					"&nbsp&nbsp"+
					"<button class='submit readComments' id='"+res[i]._id+"' value='"+res[i].comments+"' >Read comments</button>"
					card.append(eachRow);

			}
		});
	}

	$("body").on("click", ".saveButton", function(event){
		event.preventDefault();
		var saveUrl = "/api/v1/saves"
		var data = JSON.parse(this.value);

		ajaxCall(data, "POST", saveUrl).then(function(resp){
			openDialog("An article saved!");
		});
	})


	$("body").on("click", ".writeComments", function(event){
		event.preventDefault();
		createCommentUrl = "/api/v1/comments"
		var data = {};
		var inputId = this.id;
		var value = "#"+inputId;
		inputId = inputId.split(" ");
		data['_id'] = inputId[0];
		data['comment']=$("input").eq(parseInt(inputId[1])).val();

		ajaxCall(data,"POST", createCommentUrl).then(function(resp){
			drawNewsList();
		});

	});

	$("body").on("click", "#scrapeNews", function(event){
		event.preventDefault();

		generateData();
	});

	function drawSavedNewsList(){
		var url = "/api/v1/saves";
		var urlComment = "/api/v1/comments/";
		ajaxCall({}, "GET", url).then(function(res){

			var card = $("#news").empty();
			for(var i=0; i< res.length; i++){
				var eachRow = "<div class='card w-75'><div class='card-body'>" + 
					"<button class='delete deleteButton' style='float: right;' id='"+res[i]._id+"'>delete article</button>"+
					"<button class='save saveButton' style='float: right;' id='"+res[i]._id+"' value='"+JSON.stringify(res[i])+"'>save article</button>"+
					"<img class='images' src='"+res[i].img+"'>" +
					"<h4 class='card-title'>"+res[i].title+"</h4>" +
					"<p class='card-text'>"+res[i].summary+"</p>"+
					"<p >" + res[i].byline + "</p>" +
					"<a class='link' href="+res[i].link+">click here to read more!</a><br>" +
					"<label>comment: </label> &nbsp&nbsp <input type='text' id='"+i+"'>"+
					"<button class='submit writeComments' id='"+res[i]._id+ " "+ i+"'>submit</button>" +
					"&nbsp&nbsp"+
					"<button class='submit readComments' id='"+res[i]._id+"' value='"+res[i].comments+"' >Read comments</button>"
					card.append(eachRow);

			}
		});
	}

	$("body").on("click", ".deleteButton", function(event){
		event.preventDefault();
		var id = this.id;
		var deleteUrl = "/api/v1/saves/";
		ajaxCall({}, "DELETE", deleteUrl+id).then(function(resp){
			drawSavedNewsList();
		});
	});

	$("body").on("click", "#saveArticle", function(event){
		event.preventDefault();
		drawSavedNewsList();
	});

	function generateData(){
		var url = "/api/v1/news"
		ajaxCall({}, "POST", url).then(function(resp){
			drawNewsList();
		});
	}
	generateData();
	
	$("body").on('click', '.delComment',function(event){
		event.preventDefault();
		var delCommentUrl = "/api/v1/comments/"+ this.id;
		var data = {};
		data["_id"] = this.value;
		ajaxCall(data, "DELETE", delCommentUrl).then(function(resp){
			drawNewsList();
		}).then(function(){
			$("div#commentModal").dialog("close");
		});

	});
	
	
});