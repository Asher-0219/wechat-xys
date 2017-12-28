var http = require('../../../utils/xysHttp.js');
Page({
  data: {
    sayuList: [], //声优成就
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    this.getInfo();
  },
  getInfo: function () {
    var that = this;
    http.post({
      url: 'https://wtf.xys.ren/260/interface/interface.php',
      data: {
        action: 'xys_badge'
      },
      success: function (res) {
        if (res.status == 1) {
          if (res.charm > 1000) {
            res.charm = (res.charm / 1000).toFixed(1) + "k"
          }
          if (res.tuhao > 1000) {
            res.tuhao = (res.tuhao / 1000).toFixed(1) + "k"
          }
          that.setData({
            infoList: res,
            sayuList: res.data.female,
            maleList: res.data.male
          })
        }
      }
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  }
})