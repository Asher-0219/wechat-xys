var http = require('../../../utils/xysHttp.js'),
    imageUtil = require('../../../utils/imageUtil.js');

Page({
    data: {
        uid: null,
        tid: null,//帖子ID
        voicePlayOrPause: ['/img/community_the_play.png', '/img/community_play.png'], //声音图标
        voiceState: '/img/community_the_play.png', //初始声音状态
        showImg: false,//是否显示放大的图片
        showImgs: false,//是否显示放大的图片
        imgSrc: '',//放大图片的地址
        like: null,     //是否关注
        addlike: false,   //关注成功
        removelike: false, //取关成功
        threadList: null,  //动态列表
        imgUrls: {},//放大图片的地址
        windowHeight: null, //页面高度+100
        windowWidth: null, //页面宽度
        windowHeight1: null, //页面高度
        currentImgChoose: 0,//初始选择图片
        currentImgIndex: 1,//当前显示图片
        imageWidth: 0,//放大图片宽度
        imageHeight: 0,//放大图片高度
        imageMarginLeft: 0,//放大图片边距
        imageMarginTop: 0,//放大图片边距
        alert: false,   //没有关注点相册提示
        zan: 0,//点赞数
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var that = this;
        this.setData({
            uid: options.uid
        })

        http.post({
            url: 'https://wtf.xys.ren/260/interface/discuz.php',
            data: {
                action: 'xys_seiyuu_home_album',
                lzuid: options.uid
            },
            success: function (res) {
                var imgs = res.homeAlbumInfo.slice(0, 4)
                if (res.status == 1) {
                    that.setData({
                        imgUrls: res.homeAlbumInfo,
                        imgs: imgs
                    })
                }
            },
        });
        // 楼主个人中心
        http.post({
            url: 'https://wtf.xys.ren/260/interface/discuz.php',
            data: {
                action: 'xys_home_lzhead_info',
                lzuid: options.uid
            },
            success: function (res) {
                // console.log(res)
                if (res.status == 1) {
                    if (res.data.charm > 1000) {
                        res.data.charm = parseInt(res.data.charm / 1000).toFixed(1) + "k"
                    }
                    if (res.data.tuhao > 1000) {
                        res.data.tuhao = parseInt(res.data.tuhao / 1000).toFixed(1) + "k"
                    }
                    that.setData({
                        data: res.data,
                        like: res.data.isFav
                    })
                }
            },
        });
        // 楼主动态
        http.post({
            url: 'https://wtf.xys.ren/260/interface/discuz.php',
            data: {
                action: 'xys_home_mythread',
                lzuid: options.uid
            },
            success: function (res) {
                if (res.status == 1) {
                    if(res.mythreadInfo.length!=0){
                        var tid=res.mythreadInfo[0].tid
                    }
                    that.setData({
                        thread: res.mythreadInfo,
                        tid:tid
                    })
                }
            },
        });

        //  礼物列表
        http.post({
            url: 'https://wtf.xys.ren/260/interface/interface.php',
            data: {
                action: 'sendFlowerList',
                uid: options.uid
            },
            success: function (res) {
                // console.log(res)
                if (res.status == 1) {
                    var giftList = res.data.splice(0, 4)
                    that.setData({
                        giftList: giftList
                    })
                }
            },
        })     
         //获取帖子头部信息
       
        this.getSystemInfo();
    },
       
    //  动态跳到相应的圈子
    goCircle: function (e) {
        var fid = e.currentTarget.dataset.fid;
        wx.navigateTo({
            url: '../../categories/categories?fid=' + fid
        })
    },
    // 跳到相应的帖子
    showTid: function (e) {
        var tid = e.currentTarget.dataset.tid;
        wx.navigateTo({
            url: '../../postdetail/postdetail?tid=' + tid
        })
    },
    // 我知道啦
    hideAlert: function () {
        this.setData({
            alert: false
        })
    },
    // 查看更多照片
    showMore: function () {
        var that = this;
        if (that.data.like == 0) {
            that.setData({
                alert: true
            })
        } else {
            wx.navigateTo({
                url: '../photos/photos?uid=' + that.data.uid
            })
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
    // 播放结束
    playEnd: function () {
        var that = this;
        that.setData({
            voiceState: that.data.voicePlayOrPause[0]
        })
    },
    voicePlay: function (event) {
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
    // 查看大图
    imageView: function (event) {
        var that = this,
            src = event.currentTarget.dataset.imgSrc;
        if (that.data.showImg) {
            that.setData({
                showImg: false,
                imgSrc: ''
            })
        } else {
            that.setData({
                showImg: true,
                imgSrc: src
            })
        }
    },
    imageViews: function (event) {
        var that = this,
            src = event.currentTarget.dataset.imgSrc,
            urls = event.currentTarget.dataset.imgObj,
            index = event.currentTarget.dataset.imgIndex;
        if (that.data.showImgs) {
            that.setData({
                showImgs: false,
                imgUrls: {},
                currentImgChoose: 0,
                currentImgIndex: 1
            })
        } else {
            that.setData({
                showImgs: true,
                imgUrls: urls,
                currentImgChoose: index,
            })
        }
    },
    imageLoad: function (event) {
        var that = this;
        var imageSize = imageUtil.imageUtil(event, that.data.windowWidth, that.data.windowHeight1);
        var marginLeft = (imageSize.windowWidth - imageSize.imageWidth) / 2;
        var marginTop = (imageSize.windowHeight - imageSize.imageHeight) / 2;
        this.setData({
            imageWidth: imageSize.imageWidth,
            imageHeight: imageSize.imageHeight,
            imageMarginLeft: marginLeft,
            imageMarginTop: marginTop
        })
    },
    imageIndexChage: function (event) {
        var index = event.detail.current + 1;
        this.setData({
            currentImgIndex: index,
            currentImgChoose: index - 1,
        })
    },
    //   添加关注
    addLike: function () {
        var that = this;
        http.post({
            url: 'https://wtf.xys.ren/260/interface/discuz.php',
            data: {
                action: 'xys_home_attention',
                rel: that.data.uid,
                isFav: 1
            },
            success: function (res) {
                if (res.status == 1) {
                    that.setData({
                        like: 1,
                        addlike: true,
                        removelike: false
                    })
                }
                setTimeout(function () {
                    that.setData({
                        addlike: false
                    })
                }, 1000)
            },
        })
    },
    // 取关
    removeLike: function () {
        var that = this;
        http.post({
            url: 'https://wtf.xys.ren/260/interface/discuz.php',
            data: {
                action: 'xys_home_attention',
                rel: that.data.uid,
                isFav: 0
            },
            success: function (res) {
                if (res.status == 1) {
                    that.setData({
                        like: 0,
                        addlike: false,
                        removelike: true
                    })
                }
                setTimeout(function () {
                    that.setData({
                        removelike: false
                    })
                }, 1000)
            },
        })
    },
    // 查看所有的礼物
    allGift: function (e) {
        var uid = e.currentTarget.dataset.uid;
        var that = this;
        wx.navigateTo({
            url: '../gift/gift?uid=' + uid
        })
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
        var that=this;
         http.post({
            data: {
                action: 'xys_forum_viewthread_info',
                tid: that.data.tid
            },
            success: function (res) {
                if (res.status == 1) {
                    that.setData({
                        zan: res.threadInfo.favCount
                    })
                }
            }
        })
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
    },
    goChatPage:function(){
        wx.navigateTo({
            url:'../../message/xysChat/xysChat?sessionId=p2p-'+this.data.uid
        })
    }
})