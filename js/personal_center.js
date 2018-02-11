$('header span').click(function(){
	window.location.href = "../personal_center.html";
})

var Url = grtAjaxUrl();
// var uId = localStorage.getItem("uId");
var user_Id = localStorage.getItem("userId");


yDataAjax( Url+"Home/User/ucenter" , "get" , {
    user_id : user_Id
},function( data ) {

    if( data.status )
    {
        $('header span img').attr( "src" , data.data.c_image );

    }

})
