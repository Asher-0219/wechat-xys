var http = require('../../utils/xysHttp.js');

Page({
    data: {
        tid: null,  //帖子ID
        rewardList: null,
        page: 1
    },
    //获取设备信息
    getSystemInfo: function() {
        
        var that = this;
        var systemInfo = wx.getSystemInfoSync();
        this.setData({
            windowHeight: systemInfo.windowHeight + 100,
            windowWidth: systemInfo.windowWidth,
            navigatorTop: (210 * (systemInfo.windowWidth / 750))
        })
    },
    onLoad: function (options) {
        this.setData({
            tid: options.tid
        })
        var that = this;
        // 生命周期函数--监听页面加载
        http.post({
            data: {
                action: 'xys_forum_threadsend_list',
                tid: that.data.tid,
                page: this.data.page
            },
            success: function (res) {
                if (res.status == 1) {
                    that.setData({
                        rewardList: res.threadsendList,
                        all: res.threadsendTotal
                    })
                }
            }
        })
        this.getSystemInfo();
    },
        // 下滑
    lower: function() {
        console.log(1)
        var that=this;
        that.data.page++;
        http.post({
            data: {
                action: 'xys_forum_threadsend_list',
                tid: that.data.tid,
                page: that.data.page
            },
            success: function (res) {
                if (res.status == 1) {
                    res.threadsendList.forEach(function (v) {
                        that.data.rewardList.push(v)
                    })
                    that.setData({
                        rewardList: that.data.rewardList
                    })
                }
            }
        })
    },
    
    onReady: function () {
        var that = this;
        // 生命周期函数--监听页面初次渲染完成
        http.post({
            data: {
                action: 'xys_forum_threadsend_list',
                tid: that.data.tid,
                page: 2
            },
            success: function (res) {
                if (res.status == 1) {
                    res.threadsendList.forEach(function (v) {
                        that.data.rewardList.push(v)
                    })
                    that.setData({
                        rewardList: that.data.rewardList,
                        page:2
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
})