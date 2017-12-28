/**
 * http请求
 * @author zct
 */
var appGlobal = getApp().globalData;

function post(obj){
	let url;

	if(!obj.url){
		url = appGlobal.url+'?input='+appGlobal.input;
	}else{
		if(obj.url.indexOf('http')<0){
			url = appGlobal.url.replace('discuz',obj.url)+'?input='+appGlobal.input;
		}else{
			url = obj.url+'?input='+appGlobal.input;
		}
	}

	wx.request({
		url:url,
		data:json2Form(obj.data),
		header:{
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		method:'post',
		success:function(res){
			obj.success&&obj.success(res.data);
		},
		fail:function(res){
			obj.fail&&obj.fail(res.data);
		}
	})
}

function json2Form(json) {
    var str = [];
    for(var p in json){
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
}

module.exports = {  
  post:post,
}