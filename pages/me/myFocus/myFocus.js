var http = require('../../../utils/xysHttp.js');
Page({
    data: {
        list: null,
        page: 1,
        windowHeight: null, //页面高度+100
        windowWidth: null, //页面宽度
        type: null
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        console.log(options)
        var that = this;
        var type = options.type,
            uid = options.uid;
        if (type == 1) {
            wx.setNavigationBarTitle({
                title: '我的关注'
            })
        };
        if (type == 2) {
            wx.setNavigationBarTitle({
                title: '我的粉丝'
            })
        };
        http.post({
            data: {
                action: 'xys_seiyuu_kk_weibo',
                type: type
            },
            success: function (res) {
                console.log(res)
                if (res.status == 1) {
                    that.setData({
                        list: res.weiboInfo,
                        type: type
                    })
                }
            },
        });
        this.getSystemInfo();
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
                                type: that.data.type
                            })
                        }
                    },
                });
            }
        })
    },
    //楼主个人中心
    showAction: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../sayu/means/means?uid=' + id
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
        that.data.page++;
        http.post({
            data: {
                action: 'xys_seiyuu_kk_weibo',
                type: 1,
                page: that.data.page
            },
            success: function (res) {
                console.log(res)
                if (res.status == 1) {
                    res.weiboInfo.forEach(function (v) {
                        that.data.list.push(v)
                    })
                    that.setData({
                        list: that.data.list,
                        page: that.data.page
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