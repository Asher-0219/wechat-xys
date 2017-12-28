var http = require('../../../../utils/xysHttp.js');
Page({
    data: {
        tabs: ['周榜', '月榜', '总榜'],//tab类别
        activeIndex: 0,//当前tab
        list: null,
        titleList: null,
        types: null
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var that = this;
        this.setData({
            types: options.type
        })
        http.post({
            url: 'https://wtf.xys.ren/260/interface/discuz.php',
            data: {
                action: "xys_forum_billboard",
                type: options.type,
                cycle: 1
            },
            success: function (res) {
                var titleList = res.data.splice(0, 3)
                that.setData({
                    list: res.data,
                    titleList: titleList,
                })
                console.log(titleList)
                console.log(that.data.list)
            },
        });
    },
    tabClick: function (e) {
        var that = this,
            id = e.currentTarget.id;
        if (that.data.activeIndex == id) return;
        this.setData({
            activeIndex: id,
        });
        if (id == 0) {
            http.post({
                url: 'https://wtf.xys.ren/260/interface/interface.php',
                data: {
                    action: "xys_forum_billboard",
                    type: that.data.types,
                    cycle: 1
                },
                success: function (res) {
                    var titleList = res.data.splice(0, 3)
                    console.log(res)
                    that.setData({
                        list: res.data,
                        titleList: titleList
                    })
                },
            });
        };
        if (id == 1) {
            http.post({
                url: 'https://wtf.xys.ren/260/interface/interface.php',
                data: {
                    action: "xys_forum_billboard",
                    type: that.data.types,
                    cycle: 2
                },
                success: function (res) {
                    console.log(res)
                    var titleList = res.data.splice(0, 3)
                    that.setData({
                        list: res.data,
                        titleList: titleList
                    })
                },
            });
        }
        if (id == 2) {
            http.post({
                url: 'https://wtf.xys.ren/260/interface/interface.php',
                data: {
                    action: "xys_forum_billboard",
                    type: that.data.types,
                    cycle: 3
                },
                success: function (res) {
                    var titleList = res.data.splice(0, 3)
                    that.setData({
                        list: res.data,
                        titleList: titleList
                    })
                },
            });
        }
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