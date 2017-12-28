/**
 * 帖子楼层信息
 * @author zct
 */
var http = require('../../../utils/xysHttp.js');
Page({
	data:{
		pid:null,//楼层pid
		stage:null,//楼层数
		item:null,//楼层数据
		commentList:[],//评论列表
		inputValue:null,//回复内容
		replyName:'楼主',//被回复者名字
		spid:null,//spid
	},
	onLoad:function(options){
		// this.getStorageSync();
		this.setData({
			pid:options.pid,
			stage:options.stage
		})
		this.getFloorHead();
		this.getCommentList();
	},
	onReady:function(){
	    var that = this;
		wx.setNavigationBarTitle({
    		title: '第'+that.data.stage+'楼'
	  	})
	},
	// getStorageSync:function(){
	// 	var that = this;
	// 	try{
	// 		var floorData = wx.getStorageSync('floorData');
	// 		that.setData({
	// 			item:floorData,
	// 			owner:floorData.author
	// 		})
	// 	}catch(e){
	// 	  //do something when catch err
	// 	}
	// },
	getFloorHead:function(){
		//获取楼层头部信息
		var that = this;
		http.post({
			data:{
				action:'xys_forum_comment_info',
				pid:that.data.pid,
			},
			success:function(res){
				that.setData({
					item:res.fthreadInfo
				})
			}
		})
	},
	getCommentList:function(){
		//获取楼层评论列表
		var that = this;
		http.post({
			data:{
				action:'xys_forum_comment_list',
				pid:that.data.pid
			},
			success:function(res){
				that.setData({
					commentList:that.data.commentList.concat(res.fthreadInfotwo)
				})
			}
		})
	},
	thumbUp:function(e){
	  // 点赞
	  var that = this
	     ,thumbUpStatus = that.data.item.isPfav;
	  if(thumbUpStatus>0){
	    wx.showToast({
	      title: '您已经点过赞了',
	      duration: 2000
	    })
	  }else{
	    http.post({
	      data:{
	        action:'xys_home_recommend',
	        type:1,
	        id:that.data.item.pid
	      },
	      success:function(res){
	        if(res.status==1){
	          var obj = {};
          	  obj['item.isPfav'] = 1;
          	  obj['item.pfavCount'] = ++that.data.item.pfavCount;
	          that.setData(obj);
	        }
	      }
	    })
	  }
	},
	replyHost:function(){
		//回复人为楼主
		this.setData({
			replyName:'楼主'
		})
	},
	replyOther:function(event){
		//回复人为其它角色		
		this.setData({
			replyName:event.currentTarget.dataset.name,
			spid:event.currentTarget.dataset.spid
		})
	},
	getInputValue:function(event){
		//获取回复内容
		this.setData({
			inputValue:event.detail.value
		})
	},
	sendMessage:function(){
		//发送信息
		var that = this
			,replyData;
		if(that.data.replyName=='楼主'){
			//回复本楼层
			replyData = {
				action:'xys_forum_post_reply',
				fid:that.data.item.fid,
				tid:that.data.item.tid,
				pids:that.data.item.pids,
				message:that.data.inputValue
			}
		}else{
			//回复本楼层其他人
			replyData = {
				action:'xys_forum_post_reply',
				fid:that.data.item.fid,
				tid:that.data.item.tid,
				pids:that.data.item.pids,
				spid:that.data.spid,
				message:that.data.inputValue
			}
		}
		if(that.data.inputValue.trim()){
			http.post({
				data:replyData,
				success:function(res){
					if(res.status==1){
						that.setData({
							commentList:[]
						})
						that.getCommentList();
					}
				}
			})
		}
	}
})