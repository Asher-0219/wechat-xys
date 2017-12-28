var http = require('../../../utils/xysHttp.js');

Page({
  data:{
  },
  onLoad:function(options){
    var that=this;

    // 生命周期函数--监听页面加载
    http.post({
            url: 'https://wtf.xys.ren/260/interface/interface.php',
            data: {
                action: 'sendFlowerList',
                uid: options.uid
            },
            success: function (res) {
                console.log(res)
                if (res.status == 1) {
                    that.setData({
                        giftList:  res.data
                    })
                }
            },
        })
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  }
})