var http = require('../../utils/xysHttp.js');
Page({
  data:{
    pag:1,
    fid:null
  },

  onLoad:function(options){
    var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    height: res.windowHeight
                })
            }
        });
    http.post({
      data:{
        action:'xys_forum_topic_notices',
        pageN:1,
        sizeN:10
      },
      success:function(res){
          that.data.fid=res.notices.tid;
        if(res.status==1){
            console.log(res)
          that.setData({
              list:res.notices,
          })
        }
      }
    })
    http.post({
            data: {
                fid: that.data.fid,
                action: 'xys_forum_thread_list',
                orderby: 'lastpost',
                page: 1,
            },
            success: function (res) {
                console.log(res)
                if (res.status == 1) {
                    // console.log(res)
                    that.setData({
                        listInfo: res.threadLists
                    })
                }
            }
        });
  },
  goPostDetail: function (e) {
        // 查看帖子
        var that = this
            , id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../postdetail/postdetail?tid=' + id
        })
    },
  refresh: function (e) {
        var that = this;
        console.log(1)
        http.post({
            data: {
                action: 'xys_forum_topic_notices',
                pageN: that.data.pag++,
                sizeN:10
            },
            success: function (res) {
                if (res.status == 1) {
                    res.notices.forEach(function (v) {
                        that.data.list.push(v)
                    })
                    that.setData({
                        list: that.data.list
                    })
                }
            }
        });
    },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})