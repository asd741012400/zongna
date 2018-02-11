var text = sessionStorage.getItem("text");
var ajaxUrl = grtAjaxUrl();
let page = 1,
	pageSize = 6;
$('header div input').val( text )


search(page , pageSize , text)

scrollEv( page , pageSize , text , search )

function search( page , pageSize ,keyWords ) {

	yDataAjax( ajaxUrl+"Home/Goods/search" , "post" , {
		keywords : keyWords,
		p : page,
		pagesize : pageSize
	} , function( data ){

		if( data.status )
		{


			if( data.data )
			{

				$.each( data.data , function(index, val) {
					console.log( val )
					$('.goods_list ul').append(
						`<li goods_id="${val.goods_id}">
							<span><img src="${val.c_image}" alt=""></span>
							<a>${val.c_title}</a>
							<p>
								<b>¥${val.c_price}</b>
								<em>¥${val.c_vipprice}</em>
								<strong><img src="images/VIP_price.png" alt=""></strong>
							</p>
						</li>`)
				});

			}
			loadImg(  $('.goods_list ul li span img') );
			if( page >= data.totalpage )
            {
                $(window).unbind("scroll");
                $('body').append("<p class='bottom'>到底了</p>")
            }
		}
	})
}


function scrollEv( page , pagesize , text ,htmlFn )
{
    $(window).unbind("scroll");
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight == scrollHeight)
        {
            page++;
            addAjaxHtml( page , pagesize , text  , htmlFn )
        }
    })
}



function addAjaxHtml(  page , pagesize , text , htmlFn )
{
    Request = GetRequest();
    $('.loading').show()
    $('.bottom').remove()
    setTimeout(function(){
        htmlFn( page , pagesize  , text );

    },1000)
}


