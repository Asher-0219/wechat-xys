var cache = {
	getSessions:function(){
		//获取会话
		try {
		  var sessions = wx.getStorageSync('nim_sessions')
		  if(sessions){
			return sessions;
		  }else{
		  	return [];
		  }
		} catch (e) {
		  // Do something when catch error
		}
	},
	setSessions:function(sessions,callback){
		//保存会话
		wx.setStorage({
		  key: 'nim_sessions',
		  data: sessions,
		  success: function(res) {
		  	console.log('保存会话成功');
		  	callback&&callback();
		  } 
		})
	},
	setSessionUnread:function(sessionId){
		var sessions = this.getSessions();
		sessions.forEach(function(value,index,arr){
			if(value.id==sessionId){
				sessions[index].unread = 0;
			}
		})
		this.setSessions(sessions,null);
	},
	getUsers:function(){
		//获取用户名片
		var users = this.getUsersDeal(),
			arr = [];
		for(var user in users){
			arr.push(users[user]);
		}
		return arr;
	},
	getUsersDeal:function(){
		try{
			var users = wx.getStorageSync('nim_users');
			if(users){
				return users;
			}else{
				return {};
			}
		}catch(e){
			
		}
	},
	setUsers:function(users,callback){
		//存储用户名片
		var obj = this.setUserDeal(users);
		wx.setStorage({
			key: 'nim_users',
			data: obj,
			success:function(res){
				console.info('保存用户名片成功');
				callback&&callback();
			}
		})
	},
	setUserDeal:function(users){
		var obj = {};
		for(var i=0;i<users.length;i++){
			var account = 'p2p-'+users[i].account;
			obj[account] = users[i];
		}
		return obj;
	},
	findUser:function(sessionId){
		var users = this.getUsersDeal();
		return users.hasOwnProperty(sessionId);
	},
	getMsgs:function(sessionId){
		var key = 'nim_msgs_'+sessionId,
			msgs = [];
		try{
			msgs = wx.getStorageSync(key);
			return msgs;
		}catch(e){}
	},
	setMsgs:function(msgs,callback){
		var key = 'nim_msgs_'+msgs[0].sessionId;
		wx.setStorage({
			key:key,
			data:msgs,
			success:function(res){
				console.info('保存用户消息成功');
				callback&&callback(msgs[0].sessionId);
			}
		})
	}
}

module.exports = cache;