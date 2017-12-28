/**
 * @author zct
 * 声优界面
 */
var http = require('../../utils/xysHttp.js');

Page({
  data:{
    sayuIndex:false,//是否显示首页/专线
    tabs:['全部', '名优', '人气', '新人'],//tab类别
    activeIndex: '0',//当前tab
    todayStar:null,//今日之星数据
    sayuList:[[],[],[],[]],//所有声优列表的数据
    windowWidth:null,//桌面宽度
    windowHeight:null,//桌面高度
    scrollHeight:null,//scroll高度
    swiperHeight:0,//声优列表swiper高度
    page:[1,1,1,1],//所有声优列表的页数
    repeatRequire:false,//下滑时是否重复下载
    sayuFilterList:null,//声优搜索条件列表
    filterChoose:{title:0,age:0,tariff:0,address:0},//搜索条件选择
    filterChooseOrigin:{title:0,age:0,tariff:0,address:0},//搜索条件是否与上次相同
    sayuFilter:true,//条件搜索是否打开
    sayuSearch:true,//搜索是否打开
    searchInputValue:'',//搜索内容
    searchHot:null,//热门搜索内容
    searchHistory:[],//历史搜索内容
    isOrSearchByInput:true,//是否是从输入框搜索
    searchUserList:[],//搜索结果用户列表
    searchPostList:[],//搜索结果帖子列表
    inputValue:'',//默认的input值
    moreUser:true,//是否显示更多用户
    moreNote:true,//是否显示更多帖子
    todayStarVoice:null,//今日之星声音播放状态
    sayuListVoice:[[],[],[],[]],//声优列表声音播放状态
    zxwindowHeight:null,//声优专线页面高度
    navigatorTop:null,//标题栏高度
    titleList: null,//专线导航
    zxactiveIndex: 0,//导航切换当前页
    num: null,//当前在线人数
    name: null,//声优专线当前tab名字
    tid: null,//跳转帖子id
    voicePlayOrPause: ['/img/sayu_sound_violet@3x.png', '/img/sayu_sound_violet_stop@3x.png'],//声音图标
    voiceState: [],//声音状态
    voiceId: null,//当前播放声音id
    list: null,     //声优列表
    zxpage: 1,//声优专线当前页数
  },
  onLoad:function(options){
    this.getSystemInfo();    
    this.getTodayStar();
    this.getSayuList(0,null);
    this.getSayuList(1,null);
  },
  onReady:function(){
    // 页面渲染完成
    // 首页后两个tab数据获取
    this.getSayuList(2,null);
    this.getSayuList(3,null);
  },
  getSystemInfo: function () {
    //获取系统信息
    //设置scroll，swiper高度
    var that = this,
        systemInfo = wx.getSystemInfoSync(),
        sch = systemInfo.windowHeight-166 * (systemInfo.windowWidth / 750),
        zxwh = systemInfo.windowHeight-266*(systemInfo.windowWidth / 750);
    // var swh = (11*216+270+104)*systemInfo.windowWidth / 750;
    this.setData({
      windowWidth: systemInfo.windowWidth,
      windowHeight: systemInfo.windowHeight,
      scrollHeight: sch,
      zxwindowHeight: zxwh,
      navigatorTop: (210 * (systemInfo.windowWidth / 750))
    })
  },
  getTodayStar:function(){
    //获取今日之星数据
    var that = this;
    http.post({
      url: 'interface',
      data:{
        action:'todayStar',
        type:2
      },
      success:function(res){
        if(res.status==1){
          //声音初始状态
          let arr = [],
              i = 0;
          for(i=0;i<res.data.length;i++){
            arr.push(0);
          }
          that.setData({
            todayStar:res.data,
            todayStarVoice:arr
          })
        }
      }
    })
  },
  getSayuList:function(type,cb){
    //获取声优列表
    var that = this;
    http.post({
       url: 'interface',
       data:{
          action:'xys_seiyuu_list',
          titletype:type,
          page:that.data.page[type],
          title:that.data.filterChoose.title,
          age:that.data.filterChoose.age,
          tariff:that.data.filterChoose.tariff,
          address:that.data.filterChoose.address
       },
       success:function(res){
          if(res.status==1){
            var obj = {};
            obj['sayuList['+type+']'] = that.data.sayuList[type].concat(res.data);
            obj['page['+type+']'] = ++that.data.page[type];
            //声优列表声音状态
            let arr = [],
                i = 0;
            for(i=0;i<res.data.length;i++){
              arr.push(0);
            }
            obj['sayuListVoice['+type+']'] = that.data.sayuListVoice[type].concat(arr);
            that.setData(obj);
            //根据返回数据长度设置swiper高度
            var swh = that.data.swiperHeight+(res.data.length*216+270+104)*that.data.windowWidth / 750;
            that.setData({
              swiperHeight: swh
            })
          }
       }
    })
  },
  getSayuFilterList:function(){
    //声优条件搜索
    var that = this;
    http.post({
      url:'interface',
      data:{
        action:'searchSeiyuu'
      },
      success:function(res){
        if(res.status==1){
          that.setData({
            sayuFilterList:res.data
          })
        }
      }
    })
  },
  tabClick: function (e) {
    // tab切换
    var that = this,
        swh;
    if (that.data.activeIndex == e.currentTarget.id) return;
    // if(e.currentTarget.id!=1){
    //   swh = that.data.swiperHeight-374*that.data.windowWidth/750;
    // }else{
    //   swh = that.data.swiperHeight+374*that.data.windowWidth/750;
    // }
    this.setData({
      activeIndex: e.currentTarget.id,
      // swiperHeight: swh
    });
    this.getSayuList(e.currentTarget.id,null);
  },
  swiperChange:function(event){
    //swiper切换
    var index = event.detail.current;
    this.setData({
      activeIndex: index
    })
  },
  scroll:function(event){
    //页面滚动
    var that = this
      , scrollTop = event.detail.scrollTop;
    // that.setData({
    //   swiperHeight:that.data.swiperHeight+scrollTop
    // })
  },
  lower:function(event){
    //下滑
    var that = this;
    this.getSayuList(that.data.activeIndex,null);
  },
  seeFilter:function(){
    //产看条件搜索页面
    this.getSayuFilterList();
    this.setData({
      sayuFilter:false
    })
  },
  filterChoose:function(event){
    //条件选择
    var that = this,
        status = event.currentTarget.dataset.itemStatus,
        category = event.currentTarget.dataset.itemCategory,
        id = event.currentTarget.dataset.itemId;
    if(status==1){
      var obj = {};
      obj['filterChoose.'+category] = id;
      that.setData(obj);
    }else{
      wx.showModal({
        content: '此功能暂时没有开通',
        showCancel:false,
      })
    }
  },
  getSayuByFilter:function(){
    //获取选择条件
    var that = this,
        obj1 = JSON.stringify(that.data.filterChoose),
        obj2 = JSON.stringify(that.data.filterChooseOrigin);
    //本次选择是否与上次选择相同
    if(obj1!=obj2){
      that.setData({
        sayuList:[[],[],[],[]],
        swiperHeight:0,
        page:[1,1,1,1]
      })
      that.getSayuList(0,null);
      that.getSayuList(1,null);
      that.getSayuList(2,null);
      that.getSayuList(3,null);
      that.setData({
        sayuFilter:true,
        filterChooseOrigin:that.data.filterChoose
      })
    }else{
      this.setData({
        sayuFilter:true,
      })
    }
  },
  seeSearch:function(){
    //查看搜索页面
    var that = this;
    http.post({
      url:'interface',
      data:{
        action:'xys_seiyuu_searchhot',
      },
      success:function(res){
        if(res.status==1){
          that.setData({
            searchHot: res.searchHot
          })
        }
      }
    })
    that.getSearchHistory(that);
    this.setData({
      sayuSearch: false
    })
  },
  backSayuList:function(){
    //返回声优界面
    this.setData({
      sayuSearch: true,
      inputValue: '',
      isOrSearchByInput: true,
      moreUser: true,
      moreNote: true
    })
  },
  getInputValue:function(event){
    //获取输入搜索内容
    var that = this;
    this.setData({
      searchInputValue:event.detail.value
    })
    if(!that.data.searchInputValue){
      that.setData({
        isOrSearchByInput:true
      })
    }
  },
  searchSayuByInput:function(){
    //搜索
    var that = this;
    if(!that.data.searchInputValue.trim()) return;
    http.post({
      url:'interface',
      data:{
        action:'xys_seiyuu_search',
        nickname:that.data.searchInputValue,
      },
      success:function(res){
        if(res.status==1){
          that.setData({
            searchUserList:[],
            searchPostList:[],
          })
          that.setData({
            isOrSearchByInput:false,
            searchUserList: that.data.searchUserList.concat(res.searchList),
            searchPostList: that.data.searchPostList.concat(res.searchpostList),
          })
        }        
      }
    })
    that.saveSearchHistory(that);
  },
  getSearchHistory:function(that){
    //获取搜索历史
    wx.getStorage({
      key: 'searchHistory',
      success: function(res) {
          if(res.data[0]){
            that.setData({
              searchHistory:res.data
            })
          }
      } 
    })
  },
  saveSearchHistory:function(that){
      //保存搜索历史
      //搜索内容是否已存在搜素历史中
      var contains = that.data.searchHistory.some(function(element,index,array){
        if(element==that.data.inputValue){
          return true;
        }
      })
      if(!contains){
        that.data.searchHistory.unshift(that.data.searchInputValue);
        that.setData({
          searchHistory:that.data.searchHistory
        })
        wx.setStorage({
          key:"searchHistory",
          data:that.data.searchHistory
        })
      }
  },
  removeSearchHistory:function(event){
    //移除单个搜索历史
    var that = this,
        id = event.currentTarget.dataset.searchId;
    that.data.searchHistory.splice(id,1);
    that.setData({
      searchHistory: that.data.searchHistory
    })
    wx.setStorage({
      key:'searchHistory',
      data:that.data.searchHistory
    })
  },
  removeAllSearchHistory:function(){
    //移除所有搜素历史
    var that = this;
    that.setData({
      searchHistory:[]
    })
    wx.setStorage({
      key:'searchHistory',
      data:that.data.searchHistory
    })
  },
  searchCurrentHistory:function(event){
    //从当前选择的热门/历史中搜索
    var that = this,
        id = event.currentTarget.dataset.itemId,
        data = event.currentTarget.dataset.source,
        searchText;
    if(data=='searchHot'){
      searchText = that.data[data][id].keywords;
    }else{
      searchText = that.data[data][id];
    }
    that.setData({
      searchInputValue:searchText,
      inputValue:searchText
    })
    that.searchSayuByInput();
  },
  seeMoreSearchUser:function(){
    //查看更多搜索用户
    var that = this;
    this.setData({
      moreNote:!that.data.moreNote
    })
  },
  seeMoreSearchNote:function(){
    //查看更多搜素帖子
    var that = this;
    this.setData({
      moreUser:!that.data.moreUser
    })
  },
  followUser:function(event){
    //关注用户
    var that = this,
        id = event.currentTarget.dataset.itemId;
    http.post({
      data:{
        action:'xys_home_attention',
        isFav:1,
        rel:that.data.searchUserList[id].uid
      },
      success:function(res){
        if(res.status==1){
          var obj = {};
          obj['searchUserList['+id+'].isfriend'] = ++that.data.searchUserList[id].isfriend; 
          that.setData(obj);
        }
      }
    })
  },
  followNote:function(event){
    //关注帖子
    var that = this,
        id = event.currentTarget.dataset.itemId;
    http.post({
      data:{
        action:'xys_home_favorite',
        id:that.data.searchPostList[id].fid,
        idtype:'fid',
        isFav:1
      },
      success:function(res){
        if(res.status==1){
          var obj = {};
          obj['searchPostList['+id+'].favid'] = ++that.data.searchPostList[id].favid;
          that.setData(obj);
        }
      }
    })
  },
  sayuVoiceDataDeal:function(event,cb){
    //声音播放数据
    var that = this,
        voiceId = event.currentTarget.dataset.voiceId,
        voiceSource = event.currentTarget.dataset.voiceSource,
        id = event.currentTarget.id,
        state = that.data,
        key,
        arr;
    arr = voiceSource.split('-');
    key = arr[0];
    arr.forEach(function(value,index,array){
      state = state[value];
      if(index>0){
        key += '['+value+']';
      }
    })
    state = state[voiceId];
    key = key+'['+voiceId+']';
    cb&&cb(state,key,id);
  },
  sayuVoiceSwitch:function(event){
    //切换不同的音频
    var that = this;
    if(that.audioContext){
      that.audioContext.pause();
      that.audioContext.seek(0);
    }
    that.sayuVoiceDataDeal(event,function(state,key,id){
      if(state==0){
        that.audioContext = wx.createAudioContext(id);
        that.audioContext.play();
      }
    })
  },
  sayuVoicePlay:function(event){
    //声音开始播放
    var that = this;
    that.sayuVoiceDataDeal(event,function(state,key,id){
      var obj = {};
      obj[key] = 1;
      that.setData(obj);
    })
  },
  sayuVoicePause:function(event){
    //声音停止播放
    var that = this;
    that.sayuVoiceDataDeal(event,function(state,key,id){
      var obj = {};
      obj[key] = 0;
      that.setData(obj);
    })
  },
  sayuVoiceEnd:function(event){
    //声音播放结束
    var that = this;
    that.sayuVoiceDataDeal(event,function(state,key,id){
      var obj = {};
      obj[key] = 0;
      that.setData(obj);
    })
  },
  sayuSwitchPage:function(){
    //切换首页/专线
    var that = this;
    if(!that.data.sayuIndex){
      http.post({
          url: 'https://wtf.xys.ren/260/interface/interface.php',
          data: {
              action: 'sayuLabel',
              type: 1
          },
          success: function (res) {
              if (res.status == 1) {
                  that.setData({
                      titleList: res.data,
                      name: res.data[0].name,
                      num: res.data[0].num,
                      tid: res.data[0].id
                  })
              }
          },
      });

      http.post({
          url: 'https://wtf.xys.ren/260/interface/interface.php',
          data: {
              action: 'xys_seiyuu_list',
              labelid: that.data.tid
          },
          success: function (res) {
              if (res.status == 1) {
                  res.data.forEach(function (v) {
                      if (v.suggest&&v.suggest.length > 14) {
                          v.suggest = v.suggest.substring(0, 14) + '...'
                      }
                  })
                  let arr = []
                      , i = 0;
                  for (i = 0; i < 10; i++) {
                      arr.push('/img/sayu_sound_violet@3x.png');
                  }
                  that.setData({
                      list: res.data,
                      voiceState: that.data.voiceState.concat(arr),
                  })
              }
          },
      })
    }
    this.setData({
      sayuIndex:!that.data.sayuIndex
    })
  },
  showAction: function (e) {
      //   查看声优资料
      var uid = e.currentTarget.dataset.uid;
      var that = this;
      if(this.audioContext){
        this.audioContext.pause();
        this.audioContext.seek(0);
      }
      wx.navigateTo({
          url: 'means/means?uid=' + uid
      })
  },
  playEnd: function (event) {
      var that = this,
          id = event.currentTarget.dataset.voiceId,
          selfKey = 'voiceState[' + id + ']',
          obj = {};
      obj[selfKey] = that.data.voicePlayOrPause[0];
      that.setData(obj);
  },
  zxlower: function () {
      //下拉加载
      var that = this;
      that.data.zxpage++;
      http.post({
          url: 'https://wtf.xys.ren/260/interface/interface.php',
          data: {
              action: 'xys_seiyuu_list',
              labelid: that.data.tid,
              page: that.data.zxpage
          },
          success: function (res) {
              if (res.status == 1) {
                  res.data.forEach(function (v) {
                      if (v.suggest&&v.suggest.length > 14) {
                          v.suggest = v.suggest.substring(0, 14) + '...'
                      }
                      that.data.list.push(v)
                  })
                  let arr = []
                      , i = 0;
                  for (i = 0; i < 10; i++) {
                      arr.push('/img/sayu_sound_violet@3x.png');
                  }
                  that.setData({
                      list: that.data.list,
                      zxpage: that.data.zxpage,
                      voiceState: that.data.voiceState.concat(arr),
                  })
              }
          },
      })
  },
  voicePlay: function (event) {
      /**
       * 声音播放与暂停
       */
      var that = this,
          id = event.currentTarget.dataset.voiceId,
          selfKey = 'voiceState[' + id + ']',
          obj = {};
      if (id == that.data.voiceId) {
          //点击声音与上次相同
          //判断声音播放状态
          if (that.data.voiceState[id] == that.data.voicePlayOrPause[0]) {
              obj[selfKey] = that.data.voicePlayOrPause[1];
              that.setData(obj);
              this.audioContext.play();
          } else {
              obj[selfKey] = that.data.voicePlayOrPause[0];
              that.setData(obj);
              this.audioContext.pause();
          }
      } else {
          //点击声音与上次不同
          if (that.data.voiceId && that.data.voiceState[that.data.voiceId] == that.data.voicePlayOrPause[1]) {
              //是否存在上一次声音播放，如果存在先关闭上一次声音
              var otherKey = 'voiceState[' + that.data.voiceId + ']';
              obj[otherKey] = that.data.voicePlayOrPause[0];
              that.setData(obj);
              this.audioContext.pause();
          }
          that.setData({
              voiceId: id
          })
          this.audioContext = wx.createAudioContext('catel-audio' + id);
          obj[selfKey] = that.data.voicePlayOrPause[1];
          that.setData(obj);
          this.audioContext.play();
      }
  },
  zxtabClick: function (e) {
      //顶部Tab切换
      var that = this,
          id = e.currentTarget.id,
          name = e.currentTarget.dataset.name,
          num = e.currentTarget.dataset.num,
          tid = e.currentTarget.dataset.id;
      if (that.data.zxactiveIndex == id) return;
      this.setData({
          zxactiveIndex: id,
          name: name,
          num: num,
          tid: tid
      });
      http.post({
          url: 'https://wtf.xys.ren/260/interface/interface.php',
          data: {
              action: 'xys_seiyuu_list',
              labelid: that.data.tid
          },
          success: function (res) {
              if (res.status == 1) {
                  res.data.forEach(function (v) {
                      if (v.suggest&&v.suggest.length > 14) {
                          v.suggest = v.suggest.substring(0, 14) + '...'
                      }
                  })
                  that.setData({
                      list: res.data
                  })
              }
          },
      })
  },
})
