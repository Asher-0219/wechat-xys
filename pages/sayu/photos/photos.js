var http = require('../../../utils/xysHttp.js'),
    imageUtil = require('../../../utils/imageUtil.js');
Page({
    data: {
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
        showImg: false,//是否显示放大的图片

    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var that = this;
        this.setData({
            uid: options.uid
        })
        this.getSystemInfo();
        http.post({
            url: 'https://wtf.xys.ren/260/interface/discuz.php',
            data: {
                action: 'xys_seiyuu_home_album',
                lzuid: options.uid
            },
            success: function (res) {
                if (res.status == 1) {
                    that.setData({
                        imgUrls: res.homeAlbumInfo
                    })
                }
            },
        });
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
    imageView: function (event) {
        var that = this,
            urls = event.currentTarget.dataset.imgObj,
            index = event.currentTarget.dataset.imgIndex;
        if (that.data.showImg) {
            that.setData({
                showImg: false,
                currentImgChoose: 0,
                currentImgIndex: 1
            })
        } else {
            that.setData({
                showImg: true,
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