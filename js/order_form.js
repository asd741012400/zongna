// var uId = localStorage.getItem("uId");
var user_Id = localStorage.getItem("userId");
// let uId = 1;
let ajaxUrl = grtAjaxUrl(),
    page = 1,
    pagesize = 4;
indexcart( ajaxUrl , page , pagesize , user_Id );
scrollEv( page , pagesize , user_Id ,indexcart )
function indexcart( ajaxUrl , page , pagesize , user_Id ){

    yDataAjax( ajaxUrl+"Home/Order/indexcart" , "get" , {
        user_id : user_Id,
        pagesize : pagesize,
        p : page
    } , function( data ) {

        if( data.status )
        {
            console.log( data )

            if( data.data )
            {
                $.each( data.data , function(index,val) {

                    $('.commodity ul').append(
                        `<li c_cart_id="${val.c_cart_id}" c_goods_id="${val.c_goods_id}" c_guige_id="${val.c_guige_id}" c_merchant_id="${val.c_merchant_id}">
							<div class="introduce_click">
								<div class="introduce" data-flag='true'>
									<b class="details_img"><img src="${val.c_image}" alt=""></b>
									<div>
										<h2>${val.c_title}</h2>
										<span>规格：${val.c_guige}</span>
										<p class="price">
											<b>¥<i>${val.c_price}</i></b>
											<em>¥<i>${val.c_vipprice}</i></em>
											<strong><img src="images/VIP_price.png" alt=""></strong>
										</p>

									</div>
								</div>
							</div>
							<p class="count">
								<span>-</span>
								<i>${val.c_num}</i>
								<span>+</span>
							</p>
							<span class="delete"><img src="images/icon_delete.png" alt=""></span>
						</li>`)

                })




                //删除
                {
                    $('.delete').click(function(event) {
                        let cartId = $(this).parents("li").attr("c_cart_id"),
                            This = $(this);
                        yDataAjax( ajaxUrl+"Home/Order/delAll" , "post" , {
                            c_cart_id : cartId,
                            c_user_id : user_Id,
                        } , function( data ) {

                            if( data.status )
                            {
                                toDelete( This )
                                deleteHint("删除订单成功")
                            }

                        })



                    });
                }


                //多条删除

                {
                    var liNum = $('.commodity ul li').length;
                    var liIndex = [];
                    var cartIdStr = "";
                    var unselectedNum = 0;
                    $('.multiterm_delete').click(function(event) {
                        liIndex = [];
                        unselectedNum = 0;
                        $.each( $('.commodity ul li') , function(index, val) {

                            if( $(this).find('.introduce').attr("data-flag") == "false" )
                            {
                                liIndex.push( $(this) )
                            }
                            else
                            {
                                unselectedNum++
                            }
                        });

                        if( unselectedNum == liNum )
                        {
                            deleteHint("请选择您要删除的商品")
                        }
                        else
                        {
                            $('.affirm_delete_bg .affirm_delete p span').html( liIndex.length )
                            $('.affirm_delete_bg').show()
                        }
                    });

                    $('.affirm_delete_bg .affirm_delete div span').click(()=>{
                        $('.affirm_delete_bg').hide()
                })

                    $('.affirm_delete_bg .affirm_delete div a').click(()=>{
                        let totalPrices,quantity,price;
                    console.log(liIndex)

                    $.each( liIndex , function(index, val) {
                        cartIdStr += $(this).attr("c_cart_id")+",";
                    });
                    yDataAjax( ajaxUrl+"Home/Order/delAll" , "post" , {
                        c_cart_id : cartIdStr,
                        c_user_id : user_Id,
                    } , function( data ) {

                        if( data.status )
                        {
                            $.each( liIndex , function(index, val) {
                                val.remove()
                                price = val.find('.price').find('i').html();
                                quantity = val.find('.count').find('i').html();
                                totalPrices = quantity * price;
                                valuation( "-",totalPrices )
                            });


                            $('.affirm_delete_bg').hide()
                            if( $('.commodity ul li').length <= 0 )
                            {
                                $('.null').show().siblings(".commodity").hide();
                                $('.total p i em').html(0)
                            }
                        }

                    })


                })
                }




            }
            else
            {
                $('.null').show().siblings(".commodity").hide();
            }



            loadImg(  $('.main div.default ul li img') );
            if( page >= data.totalpage )
            {
                $(window).unbind("scroll");
                $('body').append("<p class='bottom'>到底了</p>")
            }
        }

    })

}


//选中
{
    $('.commodity ul').delegate("li .introduce_click","click" ,function(event) {
        event.stopPropagation();
        pitchOn( $(this) )
    });

}
//计数
{

    $('.commodity ul').delegate('.count span' , "click" , function(event) {
        event.stopPropagation();
        aCount( $(this) )

    });

}


// 全选
{
    $('.total span').click(function(event) {
        let totalPrices = 0;
        event.stopPropagation();
        if( $(this).attr('data-flag') == "true" )
        {

            $(this).attr('data-flag',"false");
            $(this).css({
                "background-image" : "url('images/pitch_on.png')"
            })
            $.each( $('.commodity ul li .introduce_click .introduce') , function(index, val) {
                $(this).css({
                    "background-image" : "url('images/pitch_on.png')"
                })

                $(this).attr('data-flag',"false");

                let unitPrice = $(this).find('.price').find('i').html()*100;
                let quantity = parseInt($(this).parents('li').find('.count').find('i').html());
                totalPrices +=  unitPrice * quantity;
            });

            totalPrices /= 100;
            valuation( "+",totalPrices )

        }
        else if( $(this).attr('data-flag') == "false" )
        {

            $(this).attr('data-flag',"true");
            $(this).css({
                "background-image" : "url('images/pitch_off.png')"
            })
            $.each( $('.commodity ul li .introduce_click .introduce') , function(index, val) {
                $(this).css({
                    "background-image" : "url('images/pitch_off.png')"
                })
                $(this).attr('data-flag',"true");
                let unitPrice = $(this).find('.price').find('i').html()*100;
                let quantity = parseInt($(this).parents('li').find('.count').find('i').html());
                totalPrices +=  unitPrice * quantity;
            });
            totalPrices /= 100;
            valuation( "-",totalPrices )
        }
    });
}



//结算
{
    $('.total a').click(function(event) {
        var flagElement = [],
            oCommodityData = [];
            // aCommodityData = [];
            event.stopPropagation();
        $.each(  $('.introduce') , function(index, val) {
            if( $(this).attr('data-flag') == 'false' )
            {
                flagElement.push( $(this).parents("li") )
            }
        });

        if( flagElement.length < 1 )
        {

            deleteHint( "请选择商品" )
        }
        else
        {
            $.each( flagElement , function(index,val) {
                oCommodityData[index]={};
                oCommodityData[index].goodsId = $(this).attr("c_goods_id");
                oCommodityData[index].merchantId = $(this).attr("c_merchant_id");
                oCommodityData[index].cartId = $(this).attr("c_cart_id");
                oCommodityData[index].guigeId = $(this).attr("c_guige_id");
                oCommodityData[index].num =  $(this).find(".count").find("i").html();
                oCommodityData[index].price = $(this).find(".introduce_click").find(".introduce").find("div").find(".price").find("b").find("i").html();
                oCommodityData[index].vipprice = $(this).find(".introduce_click").find(".introduce").find("div").find(".price").find("em").find("i").html();
                oCommodityData[index].guige = $(this).find(".introduce_click").find(".introduce").find("div").find("span").html();
                oCommodityData[index].image = $(this).find(".introduce_click").find(".introduce").find(".details_img").find("img").attr("src");
                oCommodityData[index].title = $(this).find(".introduce_click").find(".introduce").find("div").find("h2").html();

            })
            var sCommodityData = "";
            $.each( oCommodityData , function(index,val) {

                sCommodityData += JSON.stringify(val)+"^";
            })

            console.log( sCommodityData )
            localStorage.setItem( "sCommodityData" , sCommodityData )
            window.location.href = "confirm_an_order.html";
        }
    });
}



function toDelete( obj )
{
    obj.parent('li').remove();

    if( obj.parents('li').find('.introduce').attr("data-flag") == "false" )
    {
        let price = obj.parent('li').find('.price').find('i').html();
        let quantity = obj.parent('li').find('.count').find('i').html();
        let totalPrices = quantity * price;
        valuation( "-",totalPrices )
    }
}
function pitchOn( obj ) {
    let quantity = obj.parent('li').find('.count').find('i').html();

    // let price = parseInt(obj.parent('li').find('.price').find('i').html());
    let price = parseFloat(obj.parent('li').find('.price').find('i').html());
    let totalPrices = quantity * price;
    if( obj.find('.introduce').attr('data-flag') == "true" )
    {

        obj.find('.introduce').css({
            "background-image" : "url('images/pitch_on.png')"
        })
        obj.find('.introduce').attr('data-flag',"false");

        valuation( "+", totalPrices )

    }
    else
    {
        obj.find('.introduce').css({
            "background-image" : "url('images/pitch_off.png')"
        })
        obj.find('.introduce').attr('data-flag',"true")

        valuation( "-" , totalPrices )
    }
}

function aCount( obj )
{

    let price = obj.parent('.count').find('i').html();

    let	unitPrice = parseFloat(obj.parents('li').find('.price').find('i').html());

    if( obj.parents('li').find('.introduce').attr("data-flag") == "false" )
    {
        console.log(  price  )

        if( obj.html() == "-" )
        {

            price--;
            if( price <= 0 )
            {
                price = 0;
                return;
            }
            valuation( "-",unitPrice )
        }
        else if( obj.html() == "+" )
        {
            price++;
            valuation( "+", unitPrice )
        }
        obj.parent('.count').find('i').html(price)


    }
    else
    {
        if( obj.html() == "-" )
        {

            price--;
            if( price <= 0 )
            {
                price = 0;
            }
        }
        else if( obj.html() == "+" )
        {
            price++;
        }

        obj.parent('.count').find('i').html(price)
    }
}






function valuation( addAndSubtract  ,totalPrices )
{
    let pricesEm = parseFloat($('#total_prices').html())
    totalPrices = parseFloat(totalPrices)
    let totalPrice;
    if( addAndSubtract == "+" ){
        totalPrice = pricesEm + totalPrices
    }
    else if( addAndSubtract == "-" )
    {
        totalPrice = pricesEm - totalPrices
    }
    else
    {
        totalPrice = pricesEm + totalPrices;
    }

    totalPrice = totalPrice.toFixed(2);
    $('#total_prices').html( totalPrice )
}


function deleteHint( str )
{
    $('.succeed span').html( str );
    succeedShow()
}

function succeedShow(){
    $('.succeed').show();
    setTimeout(function(){
        $('.succeed').hide();

    },1000)
}


function scrollEv( page , pagesize , id ,htmlFn )
{
    $(window).unbind("scroll");
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight == scrollHeight)
        {
            page++;
            addAjaxHtml( page , pagesize , id  , htmlFn )
        }
    })
}



function addAjaxHtml(  page , pagesize , id , htmlFn )
{
    Request = GetRequest();
    var ajaxUrl = grtAjaxUrl();
    $('.loading').show()

    setTimeout(function(){
        htmlFn( ajaxUrl , page , pagesize  , id );

    },1000)
}
