//app.js
var yxInit = require('utils/yxInit.js'),
    json2Form = require('utils/json2From.js'),
    MD5 = require('utils/md5.js'),
    util = require('utils/yx/util.js'),
    cache = require('utils/yx/cache.js');
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs);
        this.xysLogin();
        this.globalData.sessions = cache.getSessions();
        this.globalData.users = cache.getUsersDeal();
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    xysLogin: function () {
        let that = this;
        let obj = {
            action: 'xys_login_bypwd',
            mobile: '18968148694',
            pwd: MD5('547961386')
        }
        wx.request({
            url: 'https://wtf.xys.ren/260/interface/interface.php',
            data: json2Form.json2Form(obj),
            header: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            method: 'post',
            success: function (res) {
                that.init();
            },
            fail: function (res) {

            }
        })
    },
    init:function(){
        this.globalData.yx = new yxInit(this.globalData);
    },
    globalData:{
        userInfo:null,
        input:'8wxdRNUqvK%2BZnVxBakOH06WfpjrbdAEeY5LeDW%2FxwtU6mUGmQpI%2BbD49tQJEp9U2H8%2FywWr8rSorn0Z%2FbId4yli%2BFCgwS2URTBO0LVxt%2B5Yhf42yrn0nfsDJXq9GPMBudyipgFjlZ%2BYC%2FaGlCeuNZhSdoAos78A%2F5Nb6CT8XpJ8ohanRIIWQePNSco%2FyzlMUL7ApngUnqaHULzXStnCB5e%2Fedfs%3D',
        url:'https://wtf.xys.ren/260/interface/discuz.php',
        url1:'https://wtf.xys.ren/260/interface/shop.php',
        yx:null,
        nim:null,
        sessions:[],
        users:{},
        msgs:[]
    }
})