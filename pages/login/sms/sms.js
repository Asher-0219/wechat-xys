// pages/login/sms/sms.js
var http = require('../../../utils/xysHttp.js');
Page({
  data: {
    active: 0,
    input: [{}, {}, {}, {}],
    value: '',
    correct: 0,
    id: null,
    time: 60,
    facus: [false, true, false, false]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id;
    var facus = [false, true, false, false]
    var time = 60;
    var that = this;
    this.setData({
      id: id,
      time: 60
    })
    this.setTime();
  },
  setTime() {
    var that = this;
    setInterval(function () {
      that.data.time--;
      that.setData({
        time: that.data.time
      })
    }, 1000)
    if (that.data.time < 0) {
      return
    }
  },
  border(e) {
    var index = e.currentTarget.dataset.active;
    this.setData({
      active: index
    })
  },
  value(e) {
    var v = e.detail.value;
    this.data.value += v;
    this.setData({
      value: this.data.value
    })
    if (this.data.value.length == 4) {
      this.setData({
        correct: 1
      })
    }
    if (this.data.value.length < 4) {
      this.setData({
        correct: 0
      })
    }
  },
  sendAgain() {
    var that = this;
    http.post({
      url: 'https://wtf.xys.ren/261/interface/interface.php',
      data: {
        action: 'xys_sms',
        username: that.data.id,
        type: 3
      },
      success(res) {
        that.setData({
          time: 60
        })
        this.setTime();
      }
    })
  },
  login() {
    var that = this;
    http.post({
      url: 'https://wtf.xys.ren/261/interface/interface.php',
      data: {
        action: 'xys_home_accountchange',
        type: 1,
        mobile: that.data.id,
        verifycode: that.data.value
      },
      success(res) {
        if (res.status == 1) {
          wx.navigateBack({
            delta: 3
          })
        }
      }
    })
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