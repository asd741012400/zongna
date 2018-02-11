//ajax调用
function yDataAjax( url , request , json , htmlFn )
{
	$.ajax({
		url: url,
		type: request,
		data: json,
		success : function(data){
			htmlFn( data )
		},
		error : function(){},
	})
	
}

function jDataAjax( url , request , json , htmlFn )
{
	$.ajax({
		url: url,
		type: request,
		data: json,
		dataType : "jsonp",
		success : function(data){
			htmlFn( data )
		},
		error : function(){},
	})
	
}


function nDataAjax( url , request , htmlFn )
{
	$.ajax({
		url: url,
		type: request,
		success : function(data){
			htmlFn( data );
		},
		error : function(){
			console.log(22222)
		},
	})
	
}


// 截取URL参数
function GetRequest() {
  
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
	var str = url.substr(1);
	strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}



function grtAjaxUrl() {
	return "http://dasuanshop.com/";

}


//图片预加载
function loadImg( obj ) {
	if( obj.eq(0).prop("tagName") == "IMG" )
	{

		var imgs = obj,
			count = 0,
			imgLength = imgs.length;
		$.each(imgs, function(index, val) {
			var imgObj = new Image();
			$(imgObj).on('load',function(){


				if( count >= imgLength - 1){
					$('.loading').hide()
				}
				count++;
			})
			imgObj.src = val.src;

		});
    }
    else
	{
        $('.loading').hide()

	}
}






$('header div a').click(function(){

	var html = $(this).siblings('input').val();
	console.log(html)
	console.log( typeof html)
	console.log( (html != "") && (html != null) )
	if( (html != "") && (html != null) && (html != "null") )
	{
		sessionStorage.text = html;
		window.location.href = "search.html";
	}
	else
	{
		alert("搜索内容不能为空")
	}
	

})

