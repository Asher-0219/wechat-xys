// pages/message/messageCenter/messageCenter.js
var http = require('../../../utils/xysHttp.js'),
  util = require('../../../utils/yx/util.js'),
  cache = require('../../../utils/yx/cache.js'),
  globalData = getApp().globalData;
// int nUID;
//     if ([msgData.strMsgName isEqualToString:@"支付助手"]) {
//         nUID = 4;
//     }else if ([msgData.strMsgName isEqualToString:@"社区助手"]){
//         nUID = 5;
//     }else if ([msgData.strMsgName isEqualToString:@"商城助手"]){
//         nUID = 6;
//     }else if ([msgData.strMsgName isEqualToString:@"系统消息"]){
//         nUID = 2;
//     }else if ([msgData.strMsgName isEqualToString:@"声优助手"]){
//         nUID = 8;
//     }else if ([msgData.strMsgName isEqualToString:@"任务助手"]){
//         nUID = 9;
//     }
Page({
  data: {
    list: {
      'p2p-5': { id: '5', img: '/img/message/message_center_community@2x.png', name: '社区助手' },
      'p2p-6': { id: '6', img: '/img/message/message_center_mall@2x.png', name: '商城助手' },
      'p2p-4': { id: '4', img: '/img/message/message_center_pay@2x.png', name: '支付助手' },
      'p2p-8': { id: '8', img: '/img/message/message_center_sayu@2x.png', name: '声优助手' },
      'p2p-2': { id: '2', img: '/img/message/message_center_system@2x.png', name: '系统消息' },
      'p2p-9': { id: '9', img: '/img/message/message_list_center@2x.png', name: '任务助手' }
    },
    sessions: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    // that.data.list.sort(this.compare('dateline'));
    that.setData({
      list: that.data.list
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    globalData.sessions = util.sessionsTrans(cache.getSessions());
    this.setData({
      sessions: globalData.sessions
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  showAction: function (e) {
    var id = e.currentTarget.dataset.id,
      sessionId = e.currentTarget.dataset.sessionId;
    globalData.nim.resetSessionUnread(sessionId);
    cache.setSessionUnread(sessionId);
    wx.navigateTo({
      url: 'systemMessage/systemMessage?sessionId=' + sessionId
    })
  },
})