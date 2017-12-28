// pages/login/verification/verification.js
var http = require('../../../utils/xysHttp.js');
Page({
  data: {
    correct: 0,
    id: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  bindIdInput: function (e) {
    var v = e.detail.value;
    if (v.length == 11) {
      if (!(/^1[34578]\d{9}$/.test(v))) {
        console.log('重新输入')
      }
      this.setData({
        correct: 1,
        id: v
      })
    } else {
      this.setData({
        correct: 0
      })
    }
  },
  login: function () {
    var that = this;
    if (!(/^1[34578]\d{9}$/.test(that.data.id))) {
      return;
    } else {
      http.post({
        url: 'https://wtf.xys.ren/261/interface/interface.php',
        data: {
          action: 'xys_sms',
          username: that.data.id,
          type: 3
        },
        success(res) {
          wx.navigateTo({
            url: '../sms/sms?id='+that.data.id
          })
        }
      })
    }

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