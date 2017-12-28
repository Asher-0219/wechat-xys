//index.js
var http = require('../../utils/xysHttp1.js');
//获取应用实例
var app = getApp()
Page({
  data:{

  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var that = this;
    http.post({
      data: ({
        action: "banner"
      }),
      success: function (res) {
        console.log(res)
        // success
        that.setData({
          bannerList: res.bannerlist
        })
      },
    });
    http.post({
      data: ({
        action: "parentCatList"
      }),
      success: function (res) {
        // success
        that.setData({
          catList: res.data
        })
      },
    });
    http.post({
      data: ({
        action: "superBenefit"
      }),
      success: function (res) {
        console.log(res)
        var first = res.data.splice(0,1)  
        console.log(first)      
        // success
        that.setData({
          bennefit: res.data,
          first:first
        })
      },
    });
    http.post({
      data: ({
        action: "adList",
        width:750
      }),
      success: function (res) {
        console.log(res)
        // success
        that.setData({
          bar: res.data
        })
      },
    });
    http.post({
      data: ({
        action: "limitRush"
      }),
      success: function (res) {
        console.log(res)
        // success
        that.setData({
          fale: res.rush,
          newProduct:res.newProduct,
          youMayLike:res.youMayLike
        })
      },
    });
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    var that=this;
    http.post({
      data: ({
        action: "bbshow"
      }),
      success: function (res) {
        console.log(res)
        // success
        that.setData({
          bbshow:res.data
        })
      },
    });
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
