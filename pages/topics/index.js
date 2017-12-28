var http = require('../../utils/xysHttp.js');
Page({
    data: {
        pag: 1
    },
    showAction: function (e) {
        this.setData({
            id: e.currentTarget.dataset.id
        })
        wx.navigateTo({
            url: '../show/show?tid=' + this.data.id
        })
    },
    refresh: function (e) {
        var that = this;
        console.log(1)
        http.post({
            data: {
                action: 'xys_forum_forum',
                page: that.data.pag++,
                threadtype: 2
            },
            success: function (res) {
                console.log(res)
                if (res.status == 1) {
                    res.threadInfo.forEach(function (v) {
                        that.data.list.push(v)
                    })
                    that.setData({
                        list: that.data.list
                    })
                }
            }
        });
    },
    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    height: res.windowHeight
                })
            }
        })

        // 页面初始化 options为页面跳转所带来的参数
        http.post({
            data: {
                action: 'xys_forum_forum',
                page: 1,
                threadtype: 2
            },
            success: function (res) {
                console.log(res)
                if (res.status == 1) {
                    // console.log(res)
                    that.setData({
                        list: res.threadInfo
                    })
                }
            }
        });
    },
    onReady: function () {
        // 页面渲染完成

    },
    onShow: function () {
        // 页面显示

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭

    }
})