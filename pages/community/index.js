//logs.js
var http = require('../../utils/xysHttp.js');
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    currentTab: 0,
    show: true,
    animationData: {},
    myList: [],
    qzList: [],
    tabs: ['推荐', '发现', '排行榜'],//tab类别
    activeIndex: '1',//当前tab
  },
  tabClick: function (e) {
    //顶部Tab切换
    var that = this,
        id = e.currentTarget.id;
    if (that.data.activeIndex == id) return;
    if(id==2){
      // 跳转
      wx.navigateTo({
        url:'../community/list/list'
      })
    }else{
      this.setData({
        activeIndex: id,
      });
    }
  },
  //圈子详情
  showCate: function (e) {
    var that = this;
    that.setData({
      fid: e.currentTarget.dataset.id,
      name: e.currentTarget.dataset.name
    })
    wx.navigateTo({
      url: '../categories/categories?fid=' + that.data.fid + '&title=' + that.data.name
    })
  },
  //活动公告
  public: function () {
    var that = this;
    wx.navigateTo({
      url: '../notice/notice'
    })
  },
  //话题
  topics: function () {
    var that = this;
    wx.navigateTo({
      url: '../topics/index'
    })
  },
  //往期话题
  topic: function (e) {
    this.setData({
            id: e.currentTarget.dataset.id
        })
        wx.navigateTo({
            url: '../show/show?id=' + this.data.id
        })
  },
  //帖子详情
  showAction: function (e) {
    if (e.status == 1) {
      this.setData({
        id: e.currentTarget.dataset.id
      }),
        wx.navigateTo({
          url: '../show/show?id=' + this.data.id
        })
    };
  },
  // start: function (e) {
  //   var x=e.changedTouches[0].pageX;
  // },
  // move:function(e){
  //   console.log(e)
  // },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    http.post({
      data: {
        action: "xys_forum_billboard",
        type: "threads",
        page: 1,
        size: 20
      },
      success: function (res) {
        // success
        console.log(res)
        that.setData({
          billList: res.data
        })
      },
    });
    //全部圈子
    http.post({
      data: {
        action: "xys_forum_forum",
        threadtype: 1,
        type: 1
      },
      success: function (res) {
        // console.log(res)
        res.threadInfo.forEach(function (v) {
          if (v.description.length > 17) {
            v.description = v.description.substring(0, 17) + '...'
          }
        })
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
    //声优在线
    http.post({
      data: {
        action: "xys_forum_seiyuulist",
        page: Math.floor(Math.random() * 5),
        size: 10,
        width: 60,
      },
      success: function (res) {
        // success
        // console.log(res)
        that.setData({
          sylist: res.seiyuuList
        })
      },
    })
    //官方通告
    http.post({
      data: {
        action: "xys_forum_bannerios",
        pageT: 1,
        sizeT: 5,
        pageN: 1,
        sizeN: 2
      },
      success: function (res) {
        res.topicList.forEach(function (v) {
          v.lastpost = v.lastpost.substring(0, 18) + '...';
        });
        console.log(res.bannerlist)
        that.setData({
          topicFid: res.topicFid,
          topic: res.topicList,
          huati: res.topicName,
          imgs: res.bannerlist,
          text1: res.notices[0].lastpost,
          text2: res.notices[1].lastpost.substring(0, 25) + '...',
          tid1: res.notices[0].tid,
          tid2: res.notices[1].tid
        })
      },
    })
  },
  thumbUp: function (e) {
    // 点赞
    var that = this
      , id = e.currentTarget.dataset.thumbUp
      , thumbUpStatus = this.data.listInfo[id].isrecommends;
    if (thumbUpStatus > 0) {
      wx.showToast({
        title: '您已经点过赞了',
        duration: 2000
      })
    } else {
      http.post({
        data: {
          action: 'xys_home_recommend',
          type: 0,
          id: id
        },
        success: function (res) {
          if (res.status == 1) {
            var obj = {};
            obj['listInfo.' + id + '.isrecommends'] = 1;
            obj['listInfo.' + id + 'recommends'] = ++that.data.listInfo[id].recommends;
            that.setData(obj);
          }
        }
      })
    }
  },
  //圈子关注
  addLike: function (e) {
    var fid = e.currentTarget.dataset.id;
    var index = parseInt(e.currentTarget.dataset.index);
    var that = this;
    http.post({
      data: {
        action: 'xys_home_favorite',
        id: fid,
        idtype: 'fid',
        isFav: 1
      },
      success: function (res) {
        if (res.status == 1) {
          that.data.myList.push(that.data.qzList[index])
          that.data.qzList.splice(index, 1);
          that.setData({
            qzList: that.data.qzList,
            myList: that.data.myList
          })
        }
      }
    })
    wx.showToast({
      title: '关注成功',
      icon: 'success'
    })

    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  },
  goPostDetail: function (e) {
    // 查看帖子
    var that = this
      , id = e.currentTarget.dataset.postId;
    wx.navigateTo({
      url: '../postdetail/postdetail?tid=' + id
    })
  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    })
    this.setData({
      showLoading: true
    })
    var that = this;
    http.post({
      data: {
        action: "xys_forum_seiyuulist",
        page: Math.floor(Math.random() * 3),
        size: 10,
        width: 60,
      },
      success: function (res) {
        // success
        // console.log(res)
        that.setData({
          sylist: res.seiyuuList
        })
        wx.hideToast();
      },
    })
    wx.stopPullDownRefresh();

  },
  onReady: function (e) {
    // 页面渲染完成


  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.rotateX(90).step()

    this.setData({
      animationData: animation.export()
    })
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})
