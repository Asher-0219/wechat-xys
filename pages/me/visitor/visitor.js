var http = require('../../../utils/xysHttp.js');
Page({
    data: {
        list: null,
        page: 1,
        size:2,
        windowHeight: null, //页面高度+100
        windowWidth: null, //页面宽度
        type: null,
        uid:null,
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        console.log(options)
        var that = this;
        var type = options.type,
            uid=options.uid;
        http.post({
            url: 'https://wtf.xys.ren/260/interface/interface.php',
            data: {
                action: 'visitorList',
                lzuid: uid,
                page:1,
                size:2
            },
            success: function (res) {
                console.log(res)
                if (res.status == 1) {
                    that.setData({
                        list: res.data,
                        type: type
                    })
                }
            },
        });
        this.getSystemInfo();
    },
    //楼主个人中心
    showAction: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../sayu/means/means?uid=' + id
        })
    },
    //添加关注
    addLike: function (e) {
        var that = this;
        var uid = e.currentTarget.dataset.uid;
        http.post({
            data: {
                action: 'xys_home_attention',
                isFav: 1,
                rel: uid
            },
            success: function () {
                http.post({
                    data: {
                        action: 'xys_seiyuu_kk_weibo',
                        type: that.data.type
                    },
                    success: function (res) {
                        console.log(res)
                        if (res.status == 1) {
                            that.setData({
                                list: res.weiboInfo,
                                type: that.data.type
                            })
                        }
                    },
                });
            }
        })
    },
    removeLike: function (e) {
        var that = this;
        var uid = e.currentTarget.dataset.uid;
        http.post({
            data: {
                action: 'xys_home_attention',
                isFav: 0,
                rel: uid
            },
            success: function () {
                http.post({
                    data: {
                        action: 'xys_seiyuu_kk_weibo',
                        type: that.data.type
                    },
                    success: function (res) {
                        console.log(res)
                        if (res.status == 1) {
                            that.setData({
                                list: res.weiboInfo,
                                type: that.data.type,
                                uid:uid
                            })
                        }
                    },
                });
            }
        })
    },
    getSystemInfo: function () {
        /**
         * 获取系统信息
         */
        var that = this;
        var systemInfo = wx.getSystemInfoSync();
        this.setData({
            windowHeight: systemInfo.windowHeight,
            windowWidth: systemInfo.windowWidth,
            navigatorTop: (210 * (systemInfo.windowWidth / 750))
        })
    },
    lower: function () {
        console.log(1)
        var that = this;
        that.data.size++;
        http.post({
            url: 'https://wtf.xys.ren/260/interface/interface.php',
            data: {
                action: 'visitorList',
                lzuid: that.data.uid,
                page:1,
                size:that.data.size
            },
            success: function (res) {
                console.log(res)
                if (res.status == 1) {
                    
                    that.setData({
                        list: res.data,
                        type: that.data.type,
                        size:that.data.size
                    })
                }
            },
        });
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