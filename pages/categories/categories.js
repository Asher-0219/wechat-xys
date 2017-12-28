/**
 * 圈子信息
 * @author zct
 */

var http = require('../../utils/xysHttp.js'),
    imageUtil = require('../../utils/imageUtil.js');

Page({
  data: {
    fid: null,//主题id
    title: null,//页面标题
    threadInfo: null,//主题头部信息
    tabs: ['全部', '最新', '热门', '精华', '声优'],//tab类别
    activeIndex: '0',//当前tab
    listInfo: [],//列子列表信息
    tabswitch: ['lastpost', 'dateline', 'heats', 'digest', 'sayu'],//帖子各种类别获取action
    currentFilter: 0,//当前tab
    listPage: 1,//当前帖子页数
    repeatRequire: false,//是否重复获取
    fresh: [false, false, false, false, false],//tab数据是否放入缓存
    voicePlayOrPause: ['../../img/categories/community_the_play@3x.png', '../../img/categories/community_play@3x.png'],//声音图标
    voiceState: [],//声音状态
    voiceId: null,//当前播放声音id
    windowHeight: null,//页面高度+100
    windowWidth: null,//页面宽度
    windowHeight1:null,//页面高度
    navigatorTop: null,//标题栏高度
    activeScrollTop: false,//当前页面滚动高度
    scrollPadding: 0,//滚动一定位置的页面padding
    seeMore:[],//文本信息是否显示完全
    showImg:false,//是否显示放大的图片
    imgUrls:{},//放大图片的地址
    currentImgChoose:0,//初始选择图片
    currentImgIndex:1,//当前显示图片
    imageWidth:0,//放大图片宽度
    imageHeight:0,//放大图片高度
    imageMarginLeft:0,//放大图片边距
    imageMarginTop:0,//放大图片边距
  },
  onLoad: function (options) {
    this.setData({
      fid: options.fid,
      title: options.title
    })
    this.getSystemInfo();
    this.getHeadListInfo();
    this.getListInfo(0, null);
  },
  onReady: function () {
    var that = this;
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  tabClick: function (e) {
    /**
     * tab切换
     */
    var that = this;
    if (that.data.activeIndex == e.currentTarget.id) return;
    this.setData({
      activeIndex: e.currentTarget.id,
      currentFilter: e.currentTarget.id,
      listInfo: [],
      listPage: 1,
      voiceState: [],
      repeatRequire: false
    });
    if (that.data.fresh[e.currentTarget.id]) {
      that.getStorageSync(e.currentTarget.id);
    } else {
      that.getListInfo(e.currentTarget.id, null);
    }
  },
  getSystemInfo: function () {
    /**
     * 获取系统信息
     */
    var that = this;
    var systemInfo = wx.getSystemInfoSync();
    this.setData({
      windowHeight: systemInfo.windowHeight + 100,
      windowWidth: systemInfo.windowWidth,
      windowHeight1: systemInfo.windowHeight,
      navigatorTop: (210 * (systemInfo.windowWidth / 750))
    })
  },
  getHeadListInfo: function () {
    /**
     * 获取分类头信息
     */
    var that = this;
    http.post({
      data: {
        action: 'xys_forum_thread_info',
        fid: that.data.fid,
        type: 0
      },
      success: function (res) {
        if (res.status == 1) {
          that.setData({
            threadInfo: res.threadInfo
          })
        }
      }
    });
  },
  getListInfo: function (filterId, cb) {
    /**
     * 获取帖子列表
     */
    var that = this;
    if (that.data.repeatRequire) return;
    this.setData({
      repeatRequire: true
    })
    http.post({
      data: {
        action: 'xys_forum_thread_list',
        fid: that.data.fid,
        filter: that.data.tabswitch[filterId],
        orderby: 'lastpost',
        page: that.data.listPage,
        size: 10,
      },
      success: function (res) {
        if (res.status == 1) {
          // 设置每个声音的初始状态
          let arr = []
            ,text = []
            , i = 0;
          for (i = 0; i < 10; i++) {
            arr.push('../../img/categories/community_the_play@3x.png');
            text.push(false);
          }
          that.setData({
            listInfo: that.data.listInfo.concat(res.threadLists),
            voiceState: that.data.voiceState.concat(arr),
            seeMore:that.data.seeMore.concat(text),
            listPage: ++that.data.listPage,
            repeatRequire: false
          });
          //callback
          cb && cb();
          if (that.data.listPage < 3) {
            //如果是第一次请求，将数据放入缓存
            wx.setStorage({
              key: that.data.tabswitch[filterId],
              data: res.threadLists,
              success: function () {
                var obj = {};
                obj['fresh.' + filterId] = true;
                that.setData(obj);
              }
            })
          }
        }
      }
    })
  },
  getStorageSync: function (filterId) {
    /**
     * 同步从缓存中读取切换tab数据
     */
    var that = this;
    try {
      var data = wx.getStorageSync(that.data.tabswitch[filterId]);
      let arr = []
        , i = 0;
      for (i = 0; i < 10; i++) {
        arr.push('../../img/categories/community_the_play@3x.png');
      }
      that.setData({
        listInfo: data,
        voiceState: that.data.voiceState.concat(arr),
        listPage: ++that.data.listPage,
      })
    } catch (e) {
      //do something when catch err
    }
  },
  voicePlay: function (event) {
    /**
     * 声音播放与暂停
     */
    var that = this,
      id = event.currentTarget.dataset.voiceId,
      selfKey = 'voiceState[' + id + ']',
      obj = {};
    if (id == that.data.voiceId) {
      //点击声音与上次相同
      //判断声音播放状态
      if (that.data.voiceState[id] == that.data.voicePlayOrPause[0]) {
        obj[selfKey] = that.data.voicePlayOrPause[1];
        that.setData(obj);
        this.audioContext.play();
      } else {
        obj[selfKey] = that.data.voicePlayOrPause[0];
        that.setData(obj);
        this.audioContext.pause();
      }
    } else {
      //点击声音与上次不同
      if (that.data.voiceId && that.data.voiceState[that.data.voiceId] == that.data.voicePlayOrPause[1]) {
        //是否存在上一次声音播放，如果存在先关闭上一次声音
        var otherKey = 'voiceState[' + that.data.voiceId + ']';
        obj[otherKey] = that.data.voicePlayOrPause[0];
        that.setData(obj);
        this.audioContext.pause();
      }
      that.setData({
        voiceId: id
      })
      this.audioContext = wx.createAudioContext('catel-audio' + id);
      obj[selfKey] = that.data.voicePlayOrPause[1];
      that.setData(obj);
      this.audioContext.play();
    }
  },
  voiceStop:function(event){
    var that = this,
        id = event.currentTarget.dataset.voiceId,
        selfKey = 'voiceState[' + id + ']',
        obj = {};
    obj[selfKey] = that.data.voicePlayOrPause[0];
    that.setData(obj);
  },
  onPullDownRefresh: function () {
    //下拉刷新
    var that = this;
    wx.showToast({
      title: '正在加载中',
      icon: 'loading',
      duration: 10000
    })
    that.setData({
      listInfo: [],
      listPage: 1,
      voiceState: [],
      repeatRequire: false
    })
    that.getListInfo(that.data.currentFilter, function () {
      wx.stopPullDownRefresh();
      wx.hideToast();
    });
  },
  upper: function () {
    // 上滑
  },
  lower: function () {
    // 下滑
    var that = this;
    that.getListInfo(that.data.currentFilter, null);
  },
  scroll: function (e) {
    // 页面滚动
    var that = this
      , scrollTop = e.detail.scrollTop;
    if (that.data.navigatorTop <= scrollTop) {
      that.setData({
        activeScrollTop: true,
        scrollPadding: 40
      })
    } else {
      that.setData({
        activeScrollTop: false,
        scrollPadding: 0
      })
    }
  },
  isOrFollow: function () {
    // 关注或取消关注
    var that = this
      , followStatus = that.data.threadInfo.favid;
    followStatus = followStatus > 0 ? 0 : 1;
    http.post({
      data: {
        action: 'xys_home_favorite',
        id: that.data.fid,
        idtype: 'fid',
        isFav: followStatus
      },
      success: function (res) {
        if (res.status == 1) {
          var obj = {};
          obj['threadInfo.favid'] = followStatus;
          that.setData(obj);
        }
      }
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
          id: that.data.listInfo[id].tid
        },
        success: function (res) {
          if (res.status == 1) {
            var obj = {};
            obj['listInfo[' + id + ']isrecommends'] = 1;
            obj['listInfo[' + id + ']recommends'] = ++that.data.listInfo[id].recommends;
            that.setData(obj);
          }
        }
      })
    }
  },
  postSendIn: function () {
    // 发布帖子
    var that=this;
    wx.showActionSheet({
      itemList: ['投票', '发帖'],
      success: function (res) {
        if (!res.cancel) {
          // console.log(res.tapIndex)
          switch (res.tapIndex) {
            case 0:
            wx.navigateTo({
                url: '../vote/vote?title='+that.data.title+ '&fid=' + that.data.fid
              })
              break;
            case 1:
              wx.navigateTo({
                url: '../post/post?title='+that.data.title+ '&fid=' + that.data.fid
              })
              break;
          }
        }
      }
    })
  },
  goPostDetail: function (e) {
    // 查看帖子
    var that = this
      , id = e.currentTarget.dataset.postId;
    //如果有声音在播放先关闭声音
    if (that.data.voiceId && that.data.voiceState[that.data.voiceId] == that.data.voicePlayOrPause[1]) {
      var obj = {}
        , otherKey = 'voiceState[' + that.data.voiceId + ']';
      obj[otherKey] = that.data.voicePlayOrPause[0];
      that.setData(obj);
      this.audioContext.pause();
    }
    wx.navigateTo({
      url: '../postdetail/postdetail?tid=' + id
    })
  },
  seeMoreText:function(event){
    var that = this,
        obj = {},
        textId = event.currentTarget.dataset.textId;
    if(that.data.seeMore[textId]){
      obj['seeMore['+textId+']'] = false;
    }else{
      obj['seeMore['+textId+']'] = true;
    }
    that.setData(obj);
  },
  imageView:function(event){
    var that = this,
        urls = event.currentTarget.dataset.imgObj,
        index = event.currentTarget.dataset.imgIndex;
    if(that.data.showImg){
      that.setData({
        showImg:false,
        imgUrls:{},
        currentImgChoose:0,
        currentImgIndex:1
      })
    }else{
      that.setData({
        showImg:true,
        imgUrls:urls,
        currentImgChoose:index,
      })
    }
  },
  imageLoad:function(event){
    var that = this;
    var imageSize = imageUtil.imageUtil(event,that.data.windowWidth,that.data.windowHeight1);
    var marginLeft = (imageSize.windowWidth-imageSize.imageWidth)/2;
    var marginTop = (imageSize.windowHeight-imageSize.imageHeight)/2;
    this.setData({
      imageWidth: imageSize.imageWidth,  
      imageHeight: imageSize.imageHeight,
      imageMarginLeft: marginLeft,
      imageMarginTop: marginTop
    })  
  },
  imageIndexChage:function(event){
    var index = event.detail.current+1;
    this.setData({
      currentImgIndex: index,
      currentImgChoose: index-1,
    })
  }
})