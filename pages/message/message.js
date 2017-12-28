// pages/message/message.js
var globalData = getApp().globalData,
    authcode = require('../../utils/authcode.js'),
    cache = require('../../utils/yx/cache.js'),
    util = require('../../utils/yx/util.js');

Page({
  data:{
    sessions: null,
    users: null,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // uc_authcode(en, 'ENCODE', 'key');
    // "uid=16653&agent=DFJJERUHJAEUGFDGAS&time=1487077380"
    var time = new Date().getTime();
    console.info(time);
    var data = 'uid=298194&agent=192.168.99.165&time='+time;
    // var key = 'A&X&haql^NJooc197XQGz21!v!#0s24pFQ!nv2lV';
    // var key = '5yq9BxIQBiY5bIJY1lAT';
    var key = 'alNUkn&yPzF7G*puYs6W5nj&5*%2yhva';
    // var en_code = authcode(data,'ENCODE',key);
    var en_code = encodeURIComponent(authcode(data,'ENCODE',key));
    console.info(en_code);
    console.info(authcode(en_code,'DECODE',key));
    var str = '8wxdRNUqvK%2BZnVxBakOH06WfpjrbdAEeY5LeDW%2FxwtU6mUGmQpI%2BbD49tQJEp9U2H8%2FywWr8rSorn0Z%2FbId4yli%2BFCgwS2URTBO0LVxt%2B5Yhf42yrn0nfsDJXq9GPMBudyipgFjlZ%2BYC%2FaGlCeuNZhSdoAos78A%2F5Nb6CT8XpJ8ohanRIIWQePNSco%2FyzlMUL7ApngUnqaHULzXStnCB5e%2Fedfs%3D';
    str = decodeURIComponent(str);
    console.log(str);
    console.info(authcode(str,'DECODE','key'));
  },
  showMessage:function(event){
    wx.navigateTo({
      url: 'messageCenter/messageCenter'
    })
  },
  showChat:function(event){
    var sessionId = event.currentTarget.dataset.sessionId;
    globalData.nim.resetSessionUnread(sessionId);
    cache.setSessionUnread(sessionId);
    wx.navigateTo({
      url: 'xysChat/xysChat?sessionId='+sessionId
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.getSessions();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  getSessions:function(){
    globalData.sessions = util.sessionsTrans(cache.getSessions());
    globalData.users = util.usersTrans(cache.getUsersDeal());
    this.setData({
      sessions: globalData.sessions,
      users: globalData.users
    })
  },
  goUserCenter:function(event){
    var uid = event.currentTarget.dataset.uid.split('-')[1];
    wx.navigateTo({
      url: '../sayu/means/means?uid='+uid
    })
  }
})