var http = require('../../../../utils/xysHttp.js');
Page({
    data: {
        date: null,
        tabs: ['日榜', '周榜', '总榜'],//tab类别
        activeIndex: '',//当前tab
        num:null
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var that = this;
        console.log(options)
        this.setData({
            activeIndex: options.date,
            num:options.id,
        })
        if(options.date==0){
            http.post({
                    url: 'https://wtf.xys.ren/260/interface/interface.php',
                    data: {
                        action: "menbersBillboard",
                        type: that.data.num,
                        cycle: 1
                    },
                    success: function (res) {
                        that.data.list = res.data
                        that.setData({
                            list: that.data.list
                        })
                    },
                });
        }
        if(options.date==1){
            http.post({
                    url: 'https://wtf.xys.ren/260/interface/interface.php',
                    data: {
                        action: "menbersBillboard",
                        type: that.data.num,
                        cycle: 2
                    },
                    success: function (res) {
                        that.data.list = res.data
                        that.setData({
                            list: that.data.list
                        })
                    },
                });
        }
        if(options.date==2){
            http.post({
                    url: 'https://wtf.xys.ren/260/interface/interface.php',
                    data: {
                        action: "menbersBillboard",
                        type: that.data.num,
                        cycle: 3
                    },
                    success: function (res) {
                        that.data.list = res.data
                        that.setData({
                            list: that.data.list
                        })
                    },
                });
        }
    },
    tabClick: function (e) {
        //顶部Tab切换
        var that = this,
            id = e.currentTarget.id;
        if (that.data.activeIndex == id) return;
        this.setData({
            activeIndex: id,
        });
        if(id==0){
            http.post({
                    url: 'https://wtf.xys.ren/260/interface/interface.php',
                    data: {
                        action: "menbersBillboard",
                        type: that.data.num,
                        cycle: 1
                    },
                    success: function (res) {
                        that.data.list = res.data
                        that.setData({
                            list: that.data.list
                        })
                    },
                });
        }
        if(id==1){
            http.post({
                    url: 'https://wtf.xys.ren/260/interface/interface.php',
                    data: {
                        action: "menbersBillboard",
                        type: that.data.num,
                        cycle: 2
                    },
                    success: function (res) {
                        that.data.list = res.data
                        that.setData({
                            list: that.data.list
                        })
                    },
                });
        }
        if(id==2){
            http.post({
                    url: 'https://wtf.xys.ren/260/interface/interface.php',
                    data: {
                        action: "menbersBillboard",
                        type: that.data.num,
                        cycle: 3
                    },
                    success: function (res) {
                        that.data.list = res.data
                        that.setData({
                            list: that.data.list
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