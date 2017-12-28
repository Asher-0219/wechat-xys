/**
 * 帖子详情
 * @author zct
 */

var http = require('../../utils/xysHttp.js'),
    imageUtil = require('../../utils/imageUtil.js');

Page({
    data: {
        tid: null, //帖子id
        tabs: ['默认', '最热', '最新'], //tab类别
        activeIndex: '0', //当前tab Id
        dataHead: null, //帖子头部信息
        dataList: [], //帖子信息
        sort: ['asc', 'desc', 'desc'],
        orderby: ['position', 'recommends', 'dateline'], //tab点击
        currentFilter: 0, //当前tab
        listPage: 1, //当前帖子页数
        repeatRequire: false, //是否重复获取
        isEmpty: false, //是否为空
        voicePlayOrPause: ['../../img/categories/community_the_play@3x.png', '../../img/categories/community_play@3x.png'], //声音图标
        voiceState: '../../img/categories/community_the_play@3x.png', //初始声音状态
        windowHeight: null, //页面高度+100
        windowWidth: null, //页面宽度
        windowHeight1:null, //页面高度
        navigatorTop: null, //标题栏高度
        inputValue:null,//回复内容
        showImg:false,//是否显示放大的图片
        imgUrls:{},//放大图片的地址
        currentImgChoose:0,//初始选择图片
        currentImgIndex:1,//当前显示图片
        imageWidth:0,//放大图片宽度
        imageHeight:0,//放大图片高度
        imageMarginLeft:0,//放大图片边距
        imageMarginTop:0,//放大图片边距
        voteChooseNum:0,
    },
    onShareAppMessage: function() {
        return {
            title: '分享',
            desc: '性用社',
            path: '/page/postdetail?id=tid'
        }
    },
    onLoad: function(options) {
        console.log(options.tid)
        this.setData({
            tid: options.tid
        })
        this.getSystemInfo();
        this.getThreadInfo();
        this.getThreadList(null);
    },
    onReady: function() {

    },
    getSystemInfo: function() {
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
    tabClick: function(e) {
        /**
         * tab切换
         */
        var that = this;
        if (that.data.activeIndex == e.currentTarget.id) return;
        this.setData({
            activeIndex: e.currentTarget.id,
            currentFilter: e.currentTarget.id,
            dataList: [],
            listPage: 1,
            repeatRequire: false
        });
        that.getThreadList(null);
    },
    onPullDownRefresh: function() {
    	//下拉刷新
        var that = this;
        wx.showToast({
            title: '正在加载中',
            icon: 'loading',
            duration: 10000
        })
        that.setData({
            dataList: [],
            listPage: 1,
            repeatRequire: false
        })
        that.getThreadList(function() {
            wx.stopPullDownRefresh();
            wx.hideToast();
        });
    },
    // 进入打赏信息页面
    showReward:function(){
        var that=this;
         wx.navigateTo({
            url: '../reward/reward?tid='+that.data.tid
        })
    },
    getThreadInfo() {
        //获取帖子头部信息
        var that = this;
        http.post({
            data: {
                action: 'xys_forum_viewthread_info',
                tid: that.data.tid
            },
            success: function(res) {
                if (res.status == 1) { 
                    that.setData({
                        dataHead: res
                    })
                    for(var i=0;i<res.pollData.pollList.length;i++){
                        that.setData({
                            ['dataHead.pollData.pollList['+i+'].choose']:0
                        })
                    }
                }
            }
        })
    },
    getThreadList: function(cb) {
        //获取列子列表信息
        var that = this;
        if (that.data.repeatRequire) return;
        this.setData({
            repeatRequire: true
        })
        http.post({
            data: {
                action: 'xys_forum_viewthread_list',
                tid: that.data.tid,
                louzhu: 0,
                sort: that.data.sort[that.data.activeIndex],
                orderby: that.data.orderby[that.data.activeIndex],
                page: that.data.listPage,
                size: 10
            },
            success: function(res) {
                if (res.status == 1) {
                    that.setData({
                        dataList: that.data.dataList.concat(res.fthreadInfo),
                        listPage: ++that.data.listPage,
                        repeatRequire: false
                    });
                    if (that.data.dataList.length == 0) {
                        that.setData({
                            isEmpty: true
                        })
                    }
                    cb && cb();
                }
            }
        })
    },
    voicePlay: function(event) {
        /**
         * 声音播放与暂停
         */
        var that = this;
        this.audioContext = wx.createAudioContext('catel-audio');
        if (that.data.voiceState == that.data.voicePlayOrPause[0]) {
            that.setData({
                voiceState: that.data.voicePlayOrPause[1]
            });
            this.audioContext.play();
        } else {
            that.setData({
                voiceState: that.data.voicePlayOrPause[0]
            });
            this.audioContext.pause();
        }
    },
    lower: function() {
        // 下滑
        var that = this;
        that.getThreadList(null);
    },
    seeComment: function(event) {
    	//跳转楼中楼
        var that = this,
            index = event.currentTarget.dataset.floorIndex;
        // try {
        //     wx.setStorageSync('floorData', that.data.dataList[index])
        // } catch (e) {}
        wx.navigateTo({
            url: '../postdetail/pdpersonal/pdpersonal?pid='+that.data.dataList[index].pid+'&stage='+that.data.dataList[index].lcnumber
        })
    },
    thumbUp: function(e) {
        // 帖子点赞与评论
        var that = this,
            type = 1,
            id = e.currentTarget.dataset.thumbUp,
            thumbUpStatus, tid;
        if (id == 'dataHead') {
        	//帖子点赞
            thumbUpStatus = that.data.dataHead.threadInfo.isRecommend;
            type = 0;
            tid = that.data.dataHead.threadInfo.fid;
        } else {
        	//评论点赞
            thumbUpStatus = that.data.dataList[id].isPfav;
            tid = that.data.dataList[id].pid;
        }
        if (thumbUpStatus > 0) {
            wx.showToast({
                title: '您已经点过赞了',
                duration: 2000
            })
        } else {
            http.post({
                data: {
                    action: 'xys_home_recommend',
                    type: type,
                    id: tid
                },
                success: function(res) {
                    if (res.status == 1) {
                        var obj = {};
                        if (id == 'dataHead') {
                            obj['dataHead.threadInfo.isRecommend'] = 1;
                            obj['dataHead.threadInfo.favCount'] = ++that.data.dataHead.threadInfo.favCount;
                        } else {
                            obj['dataList[' + id + '].isPfav'] = 1;
                            obj['dataList[' + id + '].pfavCount'] = ++that.data.dataList[id].pfavCount;
                        }
                        that.setData(obj);
                    }
                }
            })
        }
    },
    getInputValue:function(event){
    	//获取回复内容
    	this.setData({
    		inputValue:event.detail.value
    	})
    },
    sendMessage:function(){
    	//发送信息
    	var that = this;
    	//如果设置不能评论直接返回
    	if(that.data.dataHead.threadInfo.closed>0) return;
    	//回复内容不为空
    	if(that.data.inputValue.trim()){
    		http.post({
    			data:{
    				action:'xys_forum_post_reply',
    				fid:that.data.dataHead.threadInfo.fid,
    				tid:that.data.tid,
    				message:that.data.inputValue
    			},
    			success:function(res){
    				if(res.status==1){
    					that.setData({
    					    dataList: [],
    					    listPage: 1,
    					    repeatRequire: false
    					})
    					that.getThreadList(null);
    				}
    			}
    		})
    	}
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
    },
    voteChoose:function(event){
        var that = this,
            id = event.currentTarget.dataset.id;
        if(that.data.dataHead.pollData.maxchoices<=that.data.voteChooseNum) return;
        if(that.data.dataHead.pollData.pollList[id].choose==0){
            that.setData({
                ['dataHead.pollData.pollList[id].choose'] : 1,
                voteChooseNum:++that.data.voteChooseNum
            })
        }else{
            that.setData({
                ['dataHead.pollData.pollList[id].choose'] : 0,
                voteChooseNum:--that.data.voteChooseNum
            })
        }
    },
    votePost:function(){
        var that = this,polloption = [];
        for(var i=0;i<that.data.dataHead.pollData.pollList.length;i++){
            if(that.data.dataHead.pollData.pollList[i].choose==1){
                polloption.push(that.data.dataHead.pollData.pollList[i].id);
            }
        }
        http.post({
            data:{
                action:'pollAnswers',
                tid:that.data.tid,
                polloption:polloption
            },
            success:function(res){
                if(res.status==1){
                    that.setData({
                        'dataHead.pollData':res.pollData
                    })
                }else{
                    console.info(res.content);
                }
            }
        })
    }
})
