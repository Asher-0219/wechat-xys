// pages/message/messageCenter/systemMessage/systemMessage.js
var globalData = getApp().globalData,
    cache = require('../../../../utils/yx/cache.js'),
    util = require('../../../../utils/yx/util.js');
Page({
  data: {
    sessionId:null,
    msgs:[]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    globalData.msgs = util.msgsTrans(cache.getMsgs(options.sessionId));
    this.setData({
      sessionId:options.sessionId,
      msgs:globalData.msgs,
    })
    console.log(this.data.msgs)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})