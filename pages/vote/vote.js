
var http = require('../../utils/xysHttp.js');
Page({
  data: {
    windowHeight: null,//页面高度
    windowWidth: null,//页面宽度
    close: true,
    title: null,
    dir: 'right',
    comment: "允许",
    shut: true,
    yes: 0,
    alert: false,
    value: "",
    inputArr: [{ id: 0 }, { id: 1 }],
    inputLength: 1,
    inputValue: {},
    check: false,
    index: 2,
    alert1: false,
    checked: 0,
    vals: []
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      title: options.title,
      fid: options.fid
    })
    http.post({
      data: {
        action: "xys_forum_thread_info",
        fid: that.data.fid
      },
      success: function (res) {
        // success
        console.log(res)
        that.setData({
          hereCircle: res.threadInfo
        })
      },
    });
    // 生命周期函数--监听页面加载
    this.getSystemInfo();
    //全部圈子
    http.post({
      data: {
        action: "xys_forum_forum",
        threadtype: 1,
        type: 1
      },
      success: function (res) {
        console.log(res)
        that.data.qzList = res.threadInfo;
        that.setData({
          len: res.threadInfo.length,
          qzList: res.threadInfo
        })
      },
    });
    //我的圈子
    http.post({
      data: {
        action: "xys_forum_forum",
        threadtype: 1,
        type: 0
      },
      success: function (res) {
        // success
        that.data.myList = res.threadInfo;
        that.setData({
          mylen: res.threadInfo.length,
          myList: res.threadInfo
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
// @人
at:function(){
  wx.navigateTo({
      url: '../vote/focus/focus'
    })
} , 
  getValue: function (e) {
    //获取发帖信息
    this.setData({
      value: e.detail.value
    })
  },
  addVote: function () {
    // 添加投票选项
    var that = this,
      num = ++that.data.inputLength;
    that.data.inputArr.push({ id: num });
    that.setData({
      inputLength: num,
      inputArr: that.data.inputArr
    })
  },
  // 支持多选按钮
  switchChange: function (e) {
    console.log(e.detail.value)
    if (e.detail.value == true) {
      this.setData({
        checked: 1
      })
      return;
    }
    if (e.detail.value == false) {
      this.setData({
        checked: 0
      })
      return;
    }
  },
  removeVote: function (event) {
    // 删除投票选项
    var that = this,
      id = event.currentTarget.dataset.index;
    if (that.data.inputArr.length <= 2) {
      that.setData({
        alert1: true
      })
      setTimeout(function () {
        that.setData({
          alert1: false
        })
      }, 2000)
    } else {
      that.data.inputArr.some(function (element, index, array) {
        if (element.id == id) {
          that.data.inputArr.splice(index, 1);
          return true;
        }
      })
      that.setData({
        inputArr: that.data.inputArr
      })
    }
  },
  // 发起投票
  post: function () {
    var that = this;
    var val = that.data.value.trim();
    var arr = [],
      obj = that.data.inputValue;
    that.data.inputArr.map(function (element, index, array) {
      arr.push(obj[element.id]);
    });
    if (that.data.value == '' || that.data.value.trim().length < 10) {
      that.setData({
        alert: true
      })
      setTimeout(function () {
        that.setData({
          alert: false
        })
      }, 2000)
    } else {
      http.post({
        data: {
          action: "xys_forum_post_newthread",
          fid: that.data.fid,
          multiple: that.data.checked,
          closed: that.data.yes,
          polloption: arr,
          at: '',
          message: that.data.value
        },
        success: function (res) {
          // success
          if (res.status == 1) {
            wx.showToast({
              title: res.content,
              icon: 'success',
              duration: 2000
            })
          }
          wx.navigateBack();
        },
        fail: function () {
          // fail
        }
      })
    }

  },
  // 选择圈子
  change: function (e) {
    if (this.data.dir == "right") {
      this.setData({
        dir: 'down'
      })
      return;
    }
    if (this.data.dir == "down") {
      this.setData({
        dir: 'right'
      })
      return;
    }
  },
  //关闭右测
  shut: function () {
    this.setData({
      shut: false
    })
  },
  //上传照片
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
  },
  // 评论权限
  comment: function (e) {
    if (this.data.yes == 0) {
      this.setData({
        comment: '不可',
        yes: 1
      })
      return;
    }
    if (this.data.yes == 1) {
      this.setData({
        comment: '允许',
        yes: 0
      })
      return;
    }
  },
  getInputValue: function (event) {
    // 投票input内容
    var id = event.currentTarget.dataset.index,
      obj = {};
    obj['inputValue[' + id + ']'] = event.detail.value;
    this.setData(obj);
  },
  getSystemInfo: function () {
    /**
     * 获取系统信息
     */
    var that = this;
    var systemInfo = wx.getSystemInfoSync();
    that.setData({
      windowHeight: systemInfo.windowHeight,
      windowWidth: systemInfo.windowWidth,
      navigatorTop: (210 * (systemInfo.windowWidth / 750))
    })
  },
  closeShade: function () {
    this.setData({
      close: false
    })
  },
  //选择圈子
  chooseCircle: function (e) {
    var that = this;
    var fid = e.currentTarget.dataset.fid;
    var name = e.currentTarget.dataset.name;
    console.log(name)
    this.setData({
      title: name,
      dir: 'right',
      fid: fid
    })
    console.log(that.data.fid)
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