// pages/me/members/membersLevel/membersLevel.js
var http = require('../../../../utils/xysHttp.js');

Page({
  data: {
    data:null,
    percent:0,
    table1:[{vip:1,exp:0},{vip:2,exp:600},{vip:3,exp:1800},{vip:4,exp:4800}],
    table2:[{vip:5,exp:9000},{vip:6,exp:15000},{vip:7,exp:28800},{vip:8,exp:48000}]    
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getInfo();
  },
  getInfo: function () {
    var that=this;
    http.post({
      url: 'https://wtf.xys.ren/261/interface/interface.php',
      data:{
        action:'xys_user_getmymember'
      },  
      success:function(res){
        var percent=res.data.mygrade/res.data.vipHigherCredit*100
        console.log(percent)
        if(res.status==1){
          that.setData({
            data:res.data,
            percent:percent
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