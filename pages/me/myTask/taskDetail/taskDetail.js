// pages/me/myTask/taskDetail/taskDetail.js
var http = require('../../../../utils/xysHttp.js');
Page({
  data:{
    url:'http://api.xys.ren/interface/html.php',
    missionText:{
        45:{rulename:'在线打卡',url:'./index.html',text:'每30分钟打卡1次，累计打卡3次，即可完成该任务'},
        55:{rulename:'发表帖子',url:'/pages/community/index',text:'当天发表帖子并审核通过3篇，即可完成该任务'},
        46:{rulename:'参与话题',url:'xys://taskgotoapp/?type=theme',text:'参与话题U赏，进行发帖并通过，即可完成该任务'},
        105:{rulename:'帖子点赞',url:'/pages/community/index',text:'对他人的帖子进行点赞达到10次，即可完成该任务'},
        106:{rulename:'社区评论',url:'/pages/community/index',text:'对他人的帖子进行评论达到5次，即可完成该任务'},
        107:{rulename:'帖子分享',url:'/pages/community/index',text:'社区帖子分享1篇，即可完成该任务'},
        47:{rulename:'好友送礼',url:'/pages/sayu/index',text:'对关注的好友送礼累计达到30U币，即可完成该任务'},
        48:{rulename:'送礼狂魔',url:'/pages/sayu/index',text:'系统随机抽取（鲜花、黄瓜、去污粉）x1作为今日任务条件， 赠送他人对应的礼物，即可完成该任务'},
        49:{rulename:'电聊达人',url:'/pages/sayu/index',text:'每天累计通话30分钟，即可完成该任务'},
        53:{rulename:'超级打卡',url:'./taskprocess.html',text:'每30分钟打卡1次，累计打卡6次，即可完成该任务'},
        51:{rulename:'无限吐槽',url:'/pages/community/index',text:'对他人的帖子进行评论达到20次，即可完成该任务'},
        52:{rulename:'最爱分享',url:'/pages/community/index',text:'社区帖子分享5篇，即可完成该任务'},
        50:{rulename:'你唱我听',url:'xys://taskgotoapp/?type=thread&fid=',text:'在“你唱我听“社区中发表一篇带录音的帖子并成功通过，即可完成该任务'},
        44:{rulename:'浏览帖子',url:'/pages/community/index',text:'在任意圈子游览不同帖子30篇，即可完成该任务'},
        108:{rulename:'新人我带',url:'xys://taskgotoapp/?type=im&uid=',text:'点击去完成打开指定ID的聊天界面，男用户分配女用户id，女用户分配男用户id。总共30个，发送消息即可作为打招呼记录'},
    },
    data:null,
    rid:null,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      rid: options.rid
    })
    this.missionDeatil();
  },
  onReady:function(){
    // 页面渲染完成
  },
  missionDeatil:function(){
      var that = this;
      http.post({
        url:that.data.url,
        data:{
              action:'my_missionone',
              rid:that.data.rid
          },
        success:function(res){
              if(res.status==1){
                that.setData({
                  data: res.data
                })
              }
          }
      })
  },
  goFinish:function(){
      var that = this,
          url;
      if(that.data.rid==108){
          return;
          // url = that.missionText[that.rid].url+that.data.otherData+'&nickname='+that.data.nameData;
          // window.open(url);
      }else if(that.data.rid==50){
          wx.switchTab({
            url:'/pages/community/index',
            success:function(){
              wx.navigateTo({
                url: '/pages/categories/categories?fid=127&title=想把我唱给你听'
              })
            }
          })
      }else if(that.data.rid==46){
          wx.switchTab({
            url:'/pages/community/index',
            success:function(){
              wx.navigateTo({
                url: '/pages/topics/index'
              })
              // wx.navigateTo({
              //   url:'/pages/postdetail/postdetail?tid=159892'
              // })
            }
          })
      }else{
          if(that.data.rid==45||that.data.rid==53){
              wx.navigateBack({
                delta: 1
              })
          }else{
              // window.open(that.missionText[that.rid].url);
              wx.switchTab({
                url:that.data.missionText[that.data.rid].url
              })
          }
      }
  }
})