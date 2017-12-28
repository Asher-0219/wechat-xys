var http = require('../../../utils/xysHttp.js');
Page({
    data: {
        list:null,  //列表
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var that=this;
        http.post({
            data: {
                action: 'xys_home_mythread',
                type: 1
            },
            success: function (res) {
                console.log(res)
                if (res.status == 1) {
                    that.setData({
                    list:res.mythreadInfo
                    })
                }
            },
        })
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