var app = getApp()
// var step = 1 // 当前操作的step  
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）  
var interval = null
var hintMsg = null // 提示  

var check = require("../../utils/check.js")
var webUtils = require("../../utils/registerWebUtil.js")
var step_g = 1
var http = require('../../utils/xysHttp.js');
var phoneNum = null, identifyCode = null, password = null, rePassword = null;

Page({
  data: {
    windowWidth: 0,
    windoeHeight: 0,
    icon_phone: "../../img/icon_phone.png",
    input_icon: "../../img/input_icon.png",
    icon_password: "../../img/icon_password.png",
    location: "中国",
    nextButtonWidth: 0,
    step: step_g,
    time: currentTime,
    password: true,
    id: null,
    pw: null,
    correct: 0
  },
  onLoad: function () {
    var that = this
  },
  showPassword: function () {
    this.setData({
      password: false
    })
  },
  hidePassword: function () {
    this.setData({
      password: true
    })
  },
  bindIdInput: function (e) {
    var v = e.detail.value;
    this.setData({
      id: v
    })
    console.log(v)
    if (!(/^1[34578]\d{9}$/.test(v))) {
      console.log('重新输入')
    }
  },
  bindPwInput(e) {
    var v = e.detail.value;
    if (v.length > 0 && this.data.id.length == 11) {
      this.setData({
        correct: 1
      })
    } else {
      this.setData({
        correct: 0
      })
    }
    this.setData({
      pw: v
    })
  },
  //点击登录
  login() {
    var that = this;
    http.post({
      url: 'https://wtf.xys.ren/261/interface/interface.php',
      data: {
        action: 'xys_login_bypwd',
        mobile: that.data.id,
        pwd: that.data.pw
      },
      success(res) {
        console.log(res)
        if (res.status == 1) {
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
        }
      }
    })
  },
  //短信验证
  verification(){
    wx.navigateTo({
      url: 'verification/verification'
    })
  },
})