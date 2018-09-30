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
		$("<div title='Result' id='dialog'>"+ message +"</div>").dialog();
	}
	function drawNewsList(){
		var url = "/api/v1/scrapenews";
		var urlComment = "/api/v1/comments/";
		ajaxCall({}, "GET", url).then(function(res){

			var card = $("#news").empty();
			for(var i=0; i< res.length; i++){
				var eachRow = "<div class='card w-75'><div class='card-body'>" + 
					"<img class='images' src='"+res[i].img+"'>" +
					"<h4 class='card-title'>"+res[i].title+"</h4>" +
					"<p class='card-text'>"+res[i].summary+"</p>"+
					"<p >" + res[i].byline + "</p>" +
					"<a class='link' href="+res[i].link+">click here to read more!</a><br>" +
					"<label>comment: </label> &nbsp&nbsp <input type='text' id='"+res[i]._id+"'>"+
					"<button class='submit'>Submit</button>" +
					"<div id='comments'></div>";
					if(res[i].comments.length > 0){	
						for(var j=0; j<res[i].comments.length; j++){

							ajaxCall({}, "GET", urlComment+res[i].comments[j]).then(function(resCom){
								console.log(resCom);
								if(!resCom || !resCom.comment){
									return;
								}
								var comment = $("#comments");
								comment.append("<hr><button class='delComment' id='"+resCom._id+"'>x</button><p>"+resCom.comment+"</p>");
							});

						}
					}
					eachRow += "</div></div>";
					card.append(eachRow);
				
			}
		});
	}
	$("body").on("click", ".submit", function(event){
		createCommentUrl = "/api/v1/comments"
		var data = {};
		data['_id'] = $("input").attr("id");
		data['comment']=$("input").val();
		console.log(data);
		ajaxCall(data,"POST", createCommentUrl).then(function(resp){
			drawNewsList();
		});

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
		var delCommentUrl = "/api/v1/comments/"+ $(this).attr("id");
		var data = {};
		data["_id"] = $("input").attr("id");
		ajaxCall(data, "DELETE", delCommentUrl).then(function(resp){
			drawNewsList();
		});

	});
	
	
});