// pages/me/myWallet/myWalletContent/myWalletContent.js
var http = require('../../../../utils/xysHttp.js');
Page({
  data: {
    list: null,
    id: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id;
    var that = this;
    this.setData({
      id: id
    })
    if (id == 1) {
      wx.setNavigationBarTitle({
        title: '我的充值'
      })
      http.post({
        url: 'https://wtf.xys.ren/260/interface/interface.php',
        data: {
          action: "xys_seiyuu_my_u",
          type: 4
        },
        success: function (res) {
          console.log(res)
          if (res.status == 1) {
            that.setData({
              list: res.message
            })
          }
        }
      })
    };
    if (id == 2) {
      wx.setNavigationBarTitle({
        title: '我的消费'
      })
      http.post({
        url: 'https://wtf.xys.ren/260/interface/interface.php',
        data: {
          action: "xys_seiyuu_my_u",
          type: 6
        },
        success: function (res) {
          console.log(res)
          if (res.status == 1) {
            that.setData({
              list: res.message
            })
          }
        }
      })
    };
    if (id == 3) {
      wx.setNavigationBarTitle({
        title: '我的收入'
      })
      http.post({
        url: 'https://wtf.xys.ren/260/interface/interface.php',
        data: {
          action: "xys_seiyuu_my_u",
          type: 2
        },
        success: function (res) {
          console.log(res)
          if (res.status == 1) {
            that.setData({
              list: res.message
            })
          }
        }
      })
    };
    if (id == 4) {
      wx.setNavigationBarTitle({
        title: '我的礼物'
      })
    };
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