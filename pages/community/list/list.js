var http = require('../../../utils/xysHttp.js');
Page({
    data: {
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var that = this;
        http.post({
            data: {
                action: "xys_forum_bannerios"
            },
            success: function (res) {
                that.setData({
                    imgs: res.bannerlist
                })
            },
        });
        http.post({
            url: 'https://wtf.xys.ren/260/interface/interface.php',
            data: {
                action: "billBoard"
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    list: res.data
                })
            },
        })
    },
    showPost:function(e){
        var that=this,
            type=e.currentTarget.dataset.type;
         wx.navigateTo({
            url: 'invitation/invitation?type='+type
        })
    },
    // 查看排行榜
    showAction(e) {
        var that = this
            , date = e.currentTarget.dataset.date,
            id=e.currentTarget.dataset.id;
        wx.navigateTo({
            url: 'classify/classify?date=' + date+'&id='+id
        })
    },
    goPostDetail: function (e) {
        // 查看帖子
        var that = this
            , id = e.currentTarget.dataset.postId;
        wx.navigateTo({
            url: '../postdetail/postdetail?tid=' + id
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