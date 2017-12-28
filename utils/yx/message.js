var nim = getApp().globalData.nim;
var message = {
	sendText:function(sessionId,text){
		account = sessionId.split('-')[1];
		nim.sendText({
			scene:'p2p',
			to:account,
			text:text,
			done:function(error,msg){
				if(!error){
					console.info(msg);
				}else{
					console.info(error);
				}
			}
		})
	}
}

module.exports = message;