// pages/me/members/renewal/renewal.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id;
    if (id == 1) {
      wx.setNavigationBarTitle({
        title: '开通会员'
      })
    }
    if (id == 2) {
      wx.setNavigationBarTitle({
        title: 'VIP续费'
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