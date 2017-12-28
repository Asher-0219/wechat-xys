// pages/me/members/members.js
var http = require('../../../utils/xysHttp.js');
Page({
  data: {
    banner: null, //banner
    list: [],
    memberInfo: null,
    status: [],  //checked状态
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getBanner();
    this.getMembersInfo();
  },
  renewal:function(e){
    var id=e.currentTarget.id;
    console.log(e)
    wx.navigateTo({
      url: 'renewal/renewal?id='+id
    })
  },
  getBanner: function () {
    var that = this;
    http.post({
      url: 'https://wtf.xys.ren/261/interface/interface.php',
      data: {
        action: 'xys_message_adv',
        type: 23
      },
      success: function (res) {
        if (res.status == 1) {
          that.setData({
            banner: res.data.pic
          })
        }
      }
    })
  },
  getMembersInfo: function () {
    var that = this;
    http.post({
      url: 'https://wtf.xys.ren/261/interface/interface.php',
      data: {
        action: 'xys_user_mymembercenter'
      },
      success: function (res) {
        if (res.status == 1) {
          res.vippower.forEach(function (v) {
            if (v.isopen == 1) {
              v.checked = true;
            } else {
              v.checked = false;
            }
          })
          that.setData({
            memberInfo: res.data,
            list: res.vippower
          })
          console.log(status)
        }
      }
    })
  },
  membersLevel: function () {
    wx.navigateTo({
      url: 'membersLevel/membersLevel'
    })
  },
  switchChange: function (e) {
    var value = e.detail.value;
    var id = e.currentTarget.id;
    console.log(id, value);
    if (id == 2 && value == true) {
      console.log(1)
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