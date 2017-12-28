var http = require('../../utils/xysHttp.js');
var app=getApp();
Page({
  data: {
    data: null, //个人信息
    online: null,//在线状态
    isMe: 1,
    input:null
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    this.setData({
      input:app.globalData.input
    })
    http.post({
      data: {
        action: 'xys_home_info'
      },
      success: function (res) {
        if (res.status == 1) {
          // console.log(res)
          that.setData({
            data: res.data
          })
        }
      }
    })
    //获取用户状态
    http.post({
      url: 'https://wtf.xys.ren/260/interface/interface.php',
      data: {
        action: 'xys_seiyuu_get_online'
      },
      success: function (res) {
        // console.log(res)
        if (res.status == 1) {
          that.setData({
            online: res.type
          })
        }
      }
    })

  },
  showMore: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id == 8) {
      wx.navigateTo({
        url: 'achievements/achievements'
      })
    }
    if (id == 3) {
      wx.navigateTo({
        url: 'myTask/myTask'
      })
    }
    if (id == 2) {
      wx.navigateTo({
        url: 'members/members'
      })
    }
    if (id == 5) {
      wx.navigateTo({
        url: 'myWallet/myWallet'
      })
    }
  },
  showAction: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../sayu/means/means?uid=' + id + '&title=' + this.data.isMe
    })
  },
  //登录
  login:function(){
    wx.navigateTo({
      url: '../login/login'
    })
  },
  // 查看我的关注
  myFocus: function () {
    wx.navigateTo({
      url: 'myFocus/myFocus?type=' + 1
    })
  },
  //查看我的访客
  visitor: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'visitor/visitor?uid=' + id
    })
  },
  //查看我的动态
  showMyDynamic: function (e) {
    wx.navigateTo({
      url: 'myDynamic/myDynamic'
    })
  },
  // 查看我的粉丝
  myFans: function () {
    wx.navigateTo({
      url: 'myFocus/myFocus?type=' + 2
    })
  },
  // 设置在线状态
  setOnline: function (e) {
    var onl = e.currentTarget.dataset.online,
      that = this;
    if (onl == 0) {
      http.post({
        url: 'https://wtf.xys.ren/260/interface/interface.php',
        data: {
          action: 'xys_seiyuu_set_online',
          type: 1
        },
        success: function (res) {
          if (res.status == 1) {
            that.setData({
              online: 1
            })
          }
        }
      })
    }
    if (onl == 1) {
      http.post({
        url: 'https://wtf.xys.ren/260/interface/interface.php',
        data: {
          action: 'xys_seiyuu_set_online',
          type: 0
        },
        success: function (res) {
          if (res.status == 1) {
            that.setData({
              online: 0
            })
          }
        }
      })
    }

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    console.log(1)
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