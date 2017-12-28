// pages/me/myWallet/myWallet.js
var http = require('../../../utils/xysHttp.js');
Page({
  data:{
    list:[{content:'我的充值',img:'/img/myWallet/personal_my_wallet_recharge.png'},{content:'我的消费',img:'/img/myWallet/personal_my_wallet_consumption.png'},{content:'我的收入',img:'/img/myWallet/personal_my_wallet_income.png'},{content:'我的礼物',img:'/img/myWallet/personal_my_wallet_gift.png'},{},{}],
    ub:0,  //U币
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getInfo();
  },
  getInfo:function(){
    var that=this;
    http.post({
      url: 'https://wtf.xys.ren/260/interface/interface.php',
      data:{
        action:"xys_seiyuu_my_u"
      },
      success:function(res){
        console.log(res)
        if(res.status==1){
          that.setData({
            ub:res.message.assetsU
          })
        }
      }
    })
  },
  showAction:function(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'myWalletContent/myWalletContent?id='+id
    })
  },
  
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})