
function getPay( payorderId , user_Id , url , payStatus ) {
	var ajaxUrl = grtAjaxUrl();
	
		
		yDataAjax( ajaxUrl+'Home/Wxpay/jsApiCall' , "post" , {
			c_payorder_id : payorderId,
			c_user_id : user_Id,
		} , function( data ){
			console.log( data )
			if( data.status )
			{
				console.log( data )
				var wxpay = JSON.parse(data.data);
				console.log( wxpay )

				function onBridgeReady(){
				   WeixinJSBridge.invoke(
				       'getBrandWCPayRequest', {
				           "appId":wxpay.appId,     //公众号名称，由商户传入     
				           "timeStamp":wxpay.timeStamp,         //时间戳，自1970年以来的秒数     
				           "nonceStr":wxpay.nonceStr, //随机串     
				           "package":wxpay.package,     
				           "signType":wxpay.signType,         //微信签名方式：     
				           "paySign":wxpay.paySign //微信签名 
				       },
				       function(res){     
				           if(res.err_msg == "get_brand_wcpay_request:ok" ) 
				           {
				           		console.log( res.err_msg )

				           		if( payStatus )
				           		{

				           			sessionStorage.payStatus = 2;
				           		}
				           }
				           else
				           {
				           		if( payStatus )
				           		{

				           			sessionStorage.payStatus = 1;
				           		}
				           		
				           }    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
							
							sessionStorage.payStatus = 0;
							window.location.href = url;
				       }
				   ); 
				}
				if (typeof WeixinJSBridge == "undefined"){
				   if( document.addEventListener ){
				       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
				   }else if (document.attachEvent){
				       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
				       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
				   }
				}else{
				   onBridgeReady();
				}
			}
		})
 


}

