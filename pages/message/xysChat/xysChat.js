// pages/message/xysChat/xysChat.js
var http = require('../../../utils/xysHttp.js'),
    cache = require('../../../utils/yx/cache.js'),
    imageUtil = require('../../../utils/imageUtil.js'),
    util = require('../../../utils/yx/util.js'),
    globalData = getApp().globalData;
Page({
  data: {
    inputValue: null,
    emotions: null,
    inputValue: '',
    tipList: null,
    giftList1: null,
    giftList2: null,
    giftList3: null,
    zIndex: null,
    show: [false, false, false, false, false,false],
    icons: [
      { src: '/img/message/chat_screen_gift_box@2x.png', sra: '/img/message/chat_screen_gift_box_click@2x.png' },
      { src: '/img/message/chat_screen_expression@2x.png', sra: '/img/message/chat_screen_expression_click@2x.png' },
      { src: '/img/message/chat_screen_say_hello@2x.png', sra: '/img/message/chat_screen_say_hello_click@2x.png' },
      { src: '/img/message/chat_screen_make_a_phone_call@2x.png' },
      { src: '/img/message/chat_screen_about_five_mao@2x.png', sra: '/img/message/chat_screen_about_five_mao_click@2x.png' },
      { src: '/img/message/chat_screen_camera@2x.png', sra: '/img/message/chat_screen_camera_click@2x.png' },
      { src: '/img/message/chat_screen_picture@2x.png', sra: '/img/message/chat_screen_picture_click@2x.png' }
    ],
    imageWidth: 0,//放大图片宽度
    imageHeight: 0,//放大图片高度
    imageMarginLeft: 0,//放大图片边距
    imageMarginTop: 0,//放大图片边距
    imgUrls: {},//放大图片的地址
    windowHeight: null, //页面高度+100
    windowWidth: null, //页面宽度
    windowHeight1: null, //页面高度
    sessionId:null,
    tapId:null,
    scrollH:null,
    giftOtherNum:false,
    giftNum:1,
    inputGiftShow:false,
    inputGiftValue:'',
    giftPlaceholder:'请输入赠送的数量',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let emotions = []
    let names = ['', '发怒', '坏笑', '生气', '蝙蝠侠', '挖鼻屎', '冷汗', '酷', '抓狂', '流泪', '惊讶', '抱抱', '绅士范', '色眯眯', '偷笑', '亲亲', '示爱', '可怜', '海盗', '委屈', '勾引', '哭泣', '闭嘴', '羞涩', '萌萌哒', '傻笑', ' 尴尬', '恶心', '微笑']
    for (let i = 1; i < 29; i++) {
      emotions.push({
        src: '/img/meo/emoji_' + i + '.png',
        id: i,
        name: names[i]
      })
    }
    this.setData({
      emotions: emotions
    })
    this.getTipList();
    this.getFlowerList();
    this.getEmoji();
    this.getSystemInfo();
    globalData.msgs = util.toPersonMsgsTrans(cache.getMsgs(options.sessionId));
    this.setData({
      sessionId:options.sessionId,
      msgs:globalData.msgs,
      users:globalData.users
    })
  },
  showMeo: function () {
    this.setData({
      emotionBox: this.data.emotionBox == false ? true : false
    })
  },
  chooseEmotion: function (e) {
    this.setData({
      inputValue: this.data.inputValue + '[' + e.target.dataset.name + ']',
    })
  },
  getTipList: function () {
    var that = this;
    http.post({
      url: 'https://wtf.xys.ren/261/interface/interface.php',
      data: {
        action: 'randomtipsList',
        size: 4
      },
      success: function (res) {
        if (res.status == 1) {
          that.setData({
            tipList: res.data
          })
        }
      }
    })
  },
  // 随机消息
  getNew: function () {
    this.getTipList();
  },
  // 开启打招呼
  //关闭打招呼
  noHide: function () {
    return;
  },
  hideTips: function () {
    this.setData({
      tips: false
    })
  },
  //选择礼物
  chooseGift: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      zIndex: id
    })
  },
  //获取礼物列表
  getFlowerList: function () {
    var that = this;
    http.post({
      url: 'https://wtf.xys.ren/261/interface/interface.php',
      data: {
        action: 'sendFlowerList',
        tyoe: 'all',
        page: 1,
        size: 8
      },
      success: function (res) {
        if (res.status == 1) {
          var giftList1,
            giftList2,
            giftList3;
          giftList1 = res.data.slice(0, 8);
          giftList2 = res.data.slice(8, 16);
          giftList3 = res.data.slice(16, 22);
          let length = Math.ceil(res.data.length/8);
          that.setData({
            giftList: res,
            giftListSwiper:new Array(length),
            giftList1: giftList1,
            giftList2: giftList2,
            giftList3: giftList3
          })
        }
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
      windowHeight: systemInfo.windowHeight + 100,
      windowWidth: systemInfo.windowWidth,
      windowHeight1: systemInfo.windowHeight,
      navigatorTop: (210 * (systemInfo.windowWidth / 750)),
      scrollH:systemInfo.windowHeight-(100 * (systemInfo.windowWidth / 750))
    })
  },
  //选择图片
  chooseImg() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        for(var i=0;i<res.tempFilePaths.length;i++){
          globalData.yx.sendFileMessage(that.data.sessionId,res.tempFilePaths[i]);
        }
        // var t = this.data.message;
        // t.push({
        //   img: this.data.userInfo.avatarUrl,
        //   imgList: tempFilePaths,
        //   me: true
        // })
        // this.setData({
        //   message: t
        // })
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  changeImg(e) {
    var id = e.currentTarget.dataset.id;
    this.data.icons[id].srb = this.data.icons[id].src
    this.data.icons[id].src = this.data.icons[id].sra
    this.setData({
      icons: this.data.icons
    })
  },
  backImg(e) {
    var id = e.currentTarget.dataset.id;
    this.data.icons[id].src = this.data.icons[id].srb;
    this.setData({
      icons: this.data.icons
    })
    this.data.show[id] = true;
    this.setData({
      show: this.data.show,
      zIndex:null,
      giftNum:1
    })
    if (id == 6) {
      this.chooseImg();
    }
  },
  hide(e) {
    var id = e.currentTarget.dataset.id;
    this.data.show[id] = false;
    this.setData({
      show: this.data.show,
      inputGiftShow:false
    })
    if (id == 0) {
      this.data.show[0] = false;
      this.data.show[1] = false;
      this.setData({
        show: this.data.show
      })
    }

  },
  //查看大图
  imageView: function (event) {
    var that = this,
      src = event.currentTarget.dataset.imgSrc;
    if (that.data.showImg) {
      that.setData({
        showImg: false,
        imgSrc: ''
      })
    } else {
      that.setData({
        showImg: true,
        imgSrc: src
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
  onShow: function () {
    // 页面显示
    this.findUser();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  sendText:function(event){
    var that = this;
    globalData.yx.sendTextMessage(that.data.sessionId,that.data.inputValue);
    that.setData({
      inputValue:'',
      'show[1]':false
    })
  },
  addTipsBac:function(event){
    var that = this,
        index = event.currentTarget.dataset.id;
    that.setData({
      tapId:index
    })
  },
  sendTips:function(){
    var that = this;
    globalData.yx.sendTextMessage(that.data.sessionId,that.data.tipList[that.data.tapId]);
    this.setData({
      'show[2]':false,
      tapId:null,
    })
  },
  goUserCenter:function(event){
    var uid = event.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../../sayu/means/means?uid='+uid
    })
  },
  findUser:function(){
    var that = this;
    if(!cache.findUser(that.data.sessionId)){
      var account = that.data.sessionId.split('-')[1];
      globalData.yx.getUserByAccount(account);
    }
  },
  giftNumber:function(){
    var that = this;
    if(that.data.zIndex||that.data.zIndex==0){
      that.setData({
        giftOtherNum:!that.data.giftOtherNum
      })
    }
  },
  countGiftNum:function(event){
    var giftNum = event.currentTarget.dataset.giftNum;
    this.setData({
      giftNum:giftNum,
      giftOtherNum:!this.data.giftOtherNum
    })
  },
  inputGiftNum:function(){
    var placeholder = Math.floor(this.data.giftList.remainUmony/this.data.giftList.data[this.data.zIndex].worth);
    this.setData({
      'show[0]':!this.data.show[0],
      inputGiftShow:!this.data.inputGiftShow,
      giftPlaceholder:'请输入赠送的数量('+placeholder+')'
    })
  },
  bindGiftInput:function(event){
    this.setData({
      inputGiftValue:event.detail.value
    })
  },
  setGiftNum:function(){
    this.setData({
      giftOtherNum:!this.data.giftOtherNum,
      'show[0]':!this.data.show[0],
      inputGiftShow:!this.data.inputGiftShow,
      giftNum:this.data.inputGiftValue
    })
  },
  givePersonGift:function(){
    var that = this;
    if(that.data.zIndex||that.data.zIndex==0){
      http.post({
        url:'interface',
        data:{
          action:'xys_seiyuu_send_flower',
          incomeUid:that.data.sessionId.split('-')[1],
          amount:that.data.giftList.data[that.data.zIndex].id,
          num:that.data.giftNum
        },
        success:function(res){
          var text = '['+that.data.giftList.data[that.data.zIndex].name+']x'+that.data.giftNum;
          globalData.yx.sendTextMessage(that.data.sessionId,text);
        }
      })
      
    }
  },
  getEmoji:function(){
    http.post({
      url:'interface',
      data:{
        action:'expressionList',
        version:0
      },
      success:function(res){
        if(status==1){
          
        }
      }
    })
  }
})