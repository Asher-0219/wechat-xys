var NIM = require('NIM_Web_NIM_v3.4.1-beta.js'),
	config = require('config.js'),
	cache = require('yx/cache.js'),
	util = require('yx/util.js'),
	data = {},
	nim,
	globalData;
function yxInit(self){
	globalData = self;
	globalData.sessions = cache.getSessions();
	globalData.users = cache.getUsersDeal();
	self.nim = nim = NIM.getInstance({
		// debug:true,
	  appKey: config.appkey,
	  account: config.userUID,
	  token: config.sdktoken,
	  onconnect: onConnect,
	  onwillreconnect: onWillReconnect,
	  ondisconnect: onDisconnect,
	  onerror: onError,
	  // 会话
	  onsessions: onSessions,
	  onupdatesession: onUpdateSession,
	  // 好友关系
	  onfriends: onFriends,
	  onsyncfriendaction: onSyncFriendAction,
	  // 群组
	  onteams: onTeams,
	  onsynccreateteam: onCreateTeam,
	  onteammembers: onTeamMembers,
	  onsyncteammembersdone: onSyncTeamMembersDone,
	  onupdateteammember: onUpdateTeamMember,
	  // 消息
	  onroamingmsgs: onRoamingMsgs,
	  onofflinemsgs: onOfflineMsgs,
	  onmsg: onMsg,
	  // 用户名片
	  onmyinfo: onMyInfo,
	  onupdatemyinfo: onUpdateMyInfo,
	  onusers: onUsers,
	  onupdateuser: onUpdateUser,
	})
}

function onConnect(){
  console.info('连接成功');
}
function onWillReconnect(obj){
  // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
  console.log('即将重连');
  console.log(obj.retryCount);
  console.log(obj.duration);
}
function onDisconnect(error){
  // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
  console.log('丢失连接');
  console.log(error);
  if (error) {
      switch (error.code) {
      // 账号或者密码错误, 请跳转到登录页面并提示错误
      case 302:
          break;
      // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
      case 417:
          break;
      // 被踢, 请提示错误后跳转到登录页面
      case 'kicked':
          break;
      default:
          break;
      }
  }
}
function onError(error){
  console.log(error);
}
function onFriends(friends){
  console.log('收到好友列表', friends);
}
function onSyncFriendAction(obj){
  console.log(obj);
}
function onTeams(teams) {
    console.log('群列表', teams);
    data.teams = nim.mergeTeams(data.teams, teams);
    onInvalidTeams(teams.invalid);
}
function onInvalidTeams(teams) {
    data.teams = nim.cutTeams(data.teams, teams);
    data.invalidTeams = nim.mergeTeams(data.invalidTeams, teams);
    refreshTeamsUI();
}
function onCreateTeam(team) {
    console.log('你创建了一个群', team);
    data.teams = nim.mergeTeams(data.teams, team);
    refreshTeamsUI();
    onTeamMembers({
        teamId: team.teamId,
        members: owner
    });
}
function onTeamMembers(teamId, members) {
    // console.log('群id', teamId, '群成员', members);
    // var teamId = obj.teamId;
    // var members = obj.members;
    // data.teamMembers = data.teamMembers || {};
    // data.teamMembers[teamId] = nim.mergeTeamMembers(data.teamMembers[teamId], members);
    // data.teamMembers[teamId] = nim.cutTeamMembers(data.teamMembers[teamId], members.invalid);
    // refreshTeamMembersUI();
}
function onSyncTeamMembersDone() {
    console.log('同步群列表完成');
}
function onUpdateTeamMember(teamMember) {
    console.log('群成员信息更新了', teamMember);
    onTeamMembers({
        teamId: teamMember.teamId,
        members: teamMember
    });
}
function refreshTeamsUI() {
    // 刷新界面
}
function refreshTeamMembersUI() {
    // 刷新界面
}
function onRoamingMsgs(obj) {
    console.log('漫游消息', obj);
    pushMsg(obj.msgs);
}
function onOfflineMsgs(obj) {
    console.log('离线消息', obj);
    pushMsg(obj.msgs);
}
function onMsg(msg) {
    console.log('收到消息', msg.scene, msg.type, msg);
    pushMsg(msg);
    // message.doMsg(msg);
}
function refreshSysMsgsUI(sessionId) {
    // 刷新界面
    var that = getCurrentPages(),
    		index = that.length-1;
    if(that[index]){
    	if(that[index].__route__=='pages/message/xysChat/xysChat'){
    		globalData.msgs = util.toPersonMsgsTrans(cache.getMsgs(sessionId));
    		that[index].setData({
    			msgs:globalData.msgs
    		})
    		console.info('消息刷新完成');
    	}
    }
}
function pushMsg(msgs) {
    if (!Array.isArray(msgs)) { msgs = [msgs]; }
    var sessionId = msgs[0].sessionId;
    var old = cache.getMsgs(sessionId) || [];
    old = nim.mergeMsgs(old, msgs);
    cache.setMsgs(old,refreshSysMsgsUI);
}

function onSessions(sessions) {
    console.log('收到会话列表', sessions);
    var old = cache.getSessions();
    globalData.sessions = nim.mergeSessions(old, sessions);
    // getUserByAccountArray(accounts);
    cache.setSessions(globalData.sessions,updateSessionsUI);
}
function onUpdateSession(session) {
    console.log('会话更新了', session);
    var that = getCurrentPages(),
    		index = that.length-1;
    if(that[index]){
    	if(that[index].__route__=='pages/message/xysChat/xysChat'){
    		if(that[index].data.sessionId==session.id){
    			session.unread = 0;
    		}
    	}
    }
    var old = cache.getSessions();
    globalData.sessions = nim.mergeSessions(old, session);
    // getUserByAccountArray(accounts);
    cache.setSessions(globalData.sessions,updateSessionsUI);
}
function updateSessionsUI() {
    // 刷新界面
    var that = getCurrentPages(),
    		index = that.length-1;
    if(that[index]){
    	if(that[index].__route__=='pages/message/message'){
    		globalData.sessions = util.sessionsTrans(cache.getSessions());
    		that[index].setData({
    			sessions:globalData.sessions
    		})
    		console.info('会话刷新成功了');
    	}
    }
}

function onMyInfo(user) {
    console.log('收到我的名片', user);
    dealUsers(user);
}
function onUpdateMyInfo(user) {
    console.log('我的名片更新了', user);
    // data.myInfo = NIM.util.merge(data.myInfo, user);
    dealUsers(user);
}
function updateMyInfoUI() {
    // 刷新界面
    var that = getCurrentPages(),
    		index = that.length-1;
    if(that[index]){
    	if(that[index].__route__=='pages/message/message'||that[index].__route__=='pages/message/xysChat/xysChat'){
    		globalData.users = util.usersTrans(cache.getUsersDeal());
    		that[index].setData({
    			users:globalData.users
    		})
    		console.info('用户信息刷新成功了');
    	}
    }
}
function onUsers(users) {
    console.log('收到用户名片列表', users);
    dealUsers(users);
}
function onUpdateUser(user) {
    console.log('用户名片更新了', user);
    dealUsers(user);
}

function dealUsers(users){
	var old = cache.getUsers(),
			newUser = nim.mergeUsers(old,users);
	cache.setUsers(newUser,updateMyInfoUI);
}

function getUserByAccount(account) {
    console.log(error);
    console.log(user);
    nim.getUser({
        account: account,
        done: function(error,user){
        	console.log('获取用户名片' + (!error?'成功':'失败'));
        	if (!error) {
        	    onUsers(user);
        	}
        }
    });
}

function getUserByAccountArray(accountArr){
	if(accountArr.length>0){
		nim.getUsers({
		    accounts: accountArr,
		    done: function(error,users){
		    	console.log(error);
    	    console.log(users);
    	    console.log('获取用户名片数组' + (!error?'成功':'失败'));
    	    if (!error) {
    	        onUsers(users);
    	    }
		    }
		});
	}
}

yxInit.prototype.getUserByAccount = function(account){
    nim.getUser({
        account: account,
        done: function(error,user){
            console.log('获取用户名片' + (!error?'成功':'失败'));
            if (!error) {
                onUsers(user);
            }
        }
    });
}

yxInit.prototype.sendTextMessage = function (sessionId, text) {
	var account = sessionId.split('-')[1];
    globalData.nim.sendText({
        scene: 'p2p',
        to: account,
        text: text,
        done: function(error,msg){
        	if(!error){
        		pushMsg(msg);
        	}else{
        		console.info(error);
        	}
        }
    });
}

yxInit.prototype.sendFileMessage = function(sessionId,filePath){
	var that = this,
		account = sessionId.split('-')[1];
		// type = /png|jpg|bmp|jpeg|gif/i.test(ext) ? 'image' : 'file';
    globalData.nim.sendFile({
        scene: 'p2p',
        to: account,
		type: 'image',
        wxFilePath: filePath,
        uploadprogress: function (data) {
            console && console.log(data.percentageText);
        },
        uploaderror: function () {
            console && console.log('上传失败');
        },
 		uploaddone: function(error, file) {
        	console.log('上传' + (!error?'成功':'失败'));
    	},
        beforesend: function (msgId) {
            console && console.log('正在发送消息, id=' + msgId);
            pushMsg(msgId);
        },
        done: function(res){

        }
    });
}

module.exports = yxInit;