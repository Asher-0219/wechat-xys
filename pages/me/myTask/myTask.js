var http = require('../../../utils/xysHttp.js'),
	taskCommon = require('../../../utils/task.js'),
	appGlobal = getApp().globalData;

Page({
	data:{
		show: false,
		url: 'http://api.xys.ren/interface/html.php',
		imgs:[
		    "/img/task/personal_my_task_clock@3x.png",
		    "/img/task/personal_my_task_post@3x.png",
		    "/img/task/personal_my_task_topic@3x.png",
		    "/img/task/personal_my_task_thumps@3x.png",
		    "/img/task/personal_my_task_comment@3x.png",
		    "/img/task/personal_my_task_share@3x.png",
		    "/img/task/personal_my_task_gift@3x.png",
		],
		text:[
		    {a:'在线打卡',b:'次'},
		    {a:'发表帖子',b:'篇'},
		    {a:'参与话题',b:'次'},
		    {a:'点赞',b:'篇不同帖子'},
		    {a:'社区帖子参与评论',b:'次'},
		    {a:'分享',b:'篇帖子'},
		    {a:'对好友送礼累计达到',b:'U币'},
		],
		todayInfo:{todayIs:0,todayTimes:0},
		data:[
		    {rulename:'在线打卡',handlenum:3,expnum:50,expu:0,times:0,finish:0},
		    {rulename:'发表帖子',handlenum:3,expnum:10,expu:0,times:0,finish:0},
		    {rulename:'参与话题',handlenum:'1',expnum:5,expu:0,times:0,finish:0},
		    {rulename:'帖子点赞',handlenum:10,expnum:10,expu:0,times:0,finish:0},
		    {rulename:'社区评论',handlenum:5,expnum:5,expu:0,times:0,finish:0},
		    {rulename:'社区分享',handlenum:1,expnum:0,expu:5,times:0,finish:0},
		    {rulename:'好友送礼',handlenum:30,expnum:30,expu:0,times:0,finish:0},
		],
		signInfo:[
		    {un:"/img/task/personal_my_sign_monday_1@3x.png",ed:"/img/task/personal_my_sign_monday@3x.png",text:"一"},
		    {un:"/img/task/personal_my_sign_tuesday@3x.png",ed:"/img/task/personal_my_sign_tuesday_1@3x.png",text:"二"},
		    {un:"/img/task/personal_my_sign_wednesday@3x.png",ed:"/img/task/personal_my_sign_wednesday_1@3x.png",text:"三"},
		    {un:"/img/task/personal_my_sign_thursday@3x.png",ed:"/img/task/personal_my_sign_thursday_1@3x.png",text:"四"},
		    {un:"/img/task/personal_my_sign_friday@3x.png",ed:"/img/task/personal_my_sign_friday_1@3x.png",text:"五"},
		    {un:"/img/task/personal_my_sign_saturday@3x.png",ed:"/img/task/personal_my_sign_saturday_1@3x.png",text:"六"},
		    {un:"/img/task/personal_my_sign_sunday@3x.png",ed:"/img/task/personal_my_sign_sunday_1@3x.png",text:"七"},
		],
		signTodayIs:1,
		signData:null,
		getRepeat:false,
		countDownTime:'',
		special:false,
		specialImgs:[
		    "/img/task/personal_task_process_super@3x.png",
		    "/img/task/personal_task_process_gift@3x.png",
		    "/img/task/personal_task_process_hear@3x.png",
		    "/img/task/personal_task_process_lips@3x.png",
		    "/img/task/personal_task_process_rshare@3x.png",
		    "/img/task/personal_task_process_song@3x.png",
		    "/img/task/personal_task_process_look@3x.png",
		    "/img/task/personal_task_process_new@3x.png",
		],
		specialText:[
		    "每30分钟打卡，累计6次",
		    "去污粉、黄瓜、鲜花x1",
		    "通话累计30分钟",
		    "评论20篇不同帖子",
		    "分享帖子5篇",
		    "你唱我听圈子发表帖子并通过",
		    "浏览不同帖子30篇",
		    "与不同id用户打招呼",
		],
		specialData:{
		    1:{rulename:'超级打卡',handlenum:6,expnum:100,expu:0,times:0,finish:0},
		    2:{rulename:'送礼狂魔',handlenum:1,expnum:50,expu:0,times:0,finish:0},
		    3:{rulename:'电聊达人',handlenum:30,expnum:50,expu:0,times:0,finish:0},
		    4:{rulename:'无限吐槽',handlenum:20,expnum:50,expu:0,times:0,finish:0},
		    5:{rulename:'醉爱分享',handlenum:5,expnum:50,expu:0,times:0,finish:0},
		    6:{rulename:'你唱我听',handlenum:1,expnum:50,expu:5,times:0,finish:0},
		    7:{rulename:'走区观帖',handlenum:30,expnum:30,expu:0,times:0,finish:0},
		    8:{rulename:'新人我带',handlenum:30,expnum:150,expu:0,times:0,finish:0},
		},
		achData:[
		    {rulename:'接通率到65%-70%',handlenum:1,expnum:400,finish:0},
		    {rulename:'接通率到71%-75%',handlenum:6,expnum:600,finish:0},
		    {rulename:'接通率到76%-80%',handlenum:30,expnum:900,finish:0},
		    {rulename:'接通率到81%-85%',handlenum:20,expnum:1600,finish:0},
		    {rulename:'接通率到86%-90%',handlenum:5,expnum:2000,finish:0},
		    {rulename:'接通率到91%-100%',handlenum:1,expnum:3200,finish:0},
		],
		achInfo:{type:0,taskUnlock:0,sum:0,otherySum:0},
		achImgs:[
		    "/img/task/personal_task_process_phone@3x.png",
		    "/img/task/personal_task_process_article@3x.png",
		    "/img/task/personal_task_process_good@3x.png",
		    "/img/task/personal_task_process_time@3x.png",
		],
		finishNum:0,
		taskUnlock:0,
		specialCountDownTime:'',
		specialActive:0
	},
	onLoad:function(options){
		this.myMission();
	},
	onRead:function(){

	},
	myMission:function(){
	    var that = this;
	    http.post({
	    	url:that.data.url,
	    	data:{
	    	    action:'my_mission'
	    	},
	    	success:function(res){
	    		if(res.status==1){
	    			let obj = {};
	    			// res.data[1].finish = 0;
	    			// res.data[1].times = 0;
	    			// res.data[1].dateline = 0;
	    			// res.todayIs = 0;
	    			obj["todayInfo.todayIs"] = res.todayIs;
	    			obj["todayInfo.todayTimes"] = res.todayTimes;
	    			obj['todayIsclick'] = res.todayIsclick;
	    			obj['todayMstimes'] = res.todayMstimes;
	    			obj['data'] = res.data;
	    			that.setData(obj);
	    		    if(res.data['1'].dateline>0){
	    		        let seconds = res.data['1'].dateline*1000;
	    		        that.setCountDown(seconds);
	    		    }
	    		}
	    	}
	    })
	},
	setCountDown:function(dateline){
	    var that = this;
	    if(dateline>0){
	        taskCommon.calCountDown(dateline,function(html){
	            that.setData({
	            	countDownTime:html
	            })
	            if(html==''){
	                // that.data['1'].dateline = 0;
	                let obj = {};
	                obj['data[1].dateline'] = 0;
	                that.setData(obj);
	            }
	        });
	    }
	},
	mySignMission:function(){
	    var that = this;
	    http.post({
	    	url:that.data.url,
	        data:{
	            action:'mysign_mission'
	        },
	        success:function(res){
	            // res = JSON.parse(res);
	            if(res.status==1){
	                // that.signTodayIs = res.todayIs;
	                // that.signData = res.data;
	                that.setData({
	                	signTodayIs: res.todayIs,
	                	signData: res.data
	                })
	            }else{
	                console.info(res.content);
	            }
	        }
	    })
	},
	mtpast:function(event){
	    var that = this,
	    	flag = event.currentTarget.dataset.flag;
	    if(!appGlobal.input){
	        console.info('请先登录!');
	        return;
	    }
	    if(flag){
	        that.mySignMission();
	    }
	    // that.show = !that.show;
	    that.setData({
	    	show: !that.data.show
	    })
	},
	missionPost:function(event){
	    let that = this,
	    	itemData = event.currentTarget.dataset.itemData;
	    itemData = itemData.split('-');
	    let dotype = itemData[0],
	    	rid = itemData[1],
	    	obj = itemData[2],
	    	index = itemData[3];
	    if(that.data.getRepeat) return;
	    // that.data.getRepeat = true;
	    that.setData({
	    	getRepeat:true
	    })
	    http.post({
	    	url:that.data.url,
	        data:{
	            action:'do_mymission',
	            rid:rid,
	            dotype:dotype
	        },
	        success:function(res){
	            // res = JSON.parse(res);
	            that.setData({
	            	getRepeat:false
	            })
	            if(res.status==1){
	                if(obj!='signData'){
	                    if(index!=1){
	                        let objNew = {};
	                        objNew[obj+'.'+index+'.finish'] = 1;
	                        that.setData(objNew);
	                    }else{
	                        if(obj=='data'){
	                            if(that.data[obj][index].times>=that.data[obj][index].handlenum-1){
	                                that.setData({
	                                	[obj+'.'+index+'.times']: parseInt(that.data[obj][index].times)+1,
	                                	[obj+'.'+index+'.finish']: 1
	                                })
	                            }else{
	                                if(that.data[obj][index].times<3){
	                                	let objNew = {};
	                                	objNew['data.'+index+'.dateline'] = 1800;
	                                	that.setData(objNew);
	                                    let seconds = 1800000;
	                                    that.setCountDown(seconds);
	                                }
	                                let objNew = {};
	                                objNew['data.'+index+'.times'] = parseInt(that.data[obj][index].times)+1;
	                                that.setData(objNew);
	                            }
	                        }
	                    }
	                }else{
	                    let objNew = {};
	                    objNew[obj+'.'+index+'.finish'] = 1;
	                    objNew['todayInfo.todayTimes'] = parseInt(that.data.todayInfo.todayTimes)+1;
	                    objNew['todayInfo.todayIs'] = 1;
	                    that.setData(objNew);
	                }
	            }else{
	                console.info(res.content);
	            }
	        }
	    })
	},
	goTaskProcess:function(){
		this.switchTask();
	},
	switchTask:function(){
		this.setData({
			special: !this.data.special
		})
		if(this.data.special){
			this.mySpecialMission();
			this.myachMission(0);
		}else{
			this.myMission();
		}
	},
	mySpecialMission:function(){
	    var that = this;
	    http.post({
	    	url:that.data.url,
	        data:{
	            action:"myspecial_mission"
	        },
	        success:function(res){
	            if(res.status==1){
	                // that.finishNum = res.data.finishNum;
	                // that.taskUnlock = res.data.taskUnlock;
	                // that.data = res.data.dailyQuest;
	                that.setData({
	                	finishNum: res.data.finishNum,
	                	taskUnlock: res.data.taskUnlock,
	                	specialData: res.data.dailyQuest
	                })
	                if(res.data.dailyQuest['1'].dateline>0){
	                    var seconds = res.data.dailyQuest['1'].dateline*1000;
	                    that.specialSetCountDown(seconds);
	                }
	            }
	        }
	    })
	},
	specialSetCountDown:function(dateline){
	    var that = this;
	    if(dateline>0){
	        taskCommon.calCountDown(dateline,function(html){
	            that.setData({
	            	specialCountDownTime: html
	            })
	            if(html==''){
	                // that.data['1'].dateline = 0;
	                let obj = {};
	                obj['specialData[1].dateline'] = 0;
	                that.setData(obj);
	            }
	        });
	    }
	},
	specialMissionPost:function(event){
	    var that = this,
	    	itemData = event.currentTarget.dataset.itemData;
	    if(that.getRepeat) return;
	    that.getRepeat = true;
	    itemData = itemData.split('-');
	    var dotype = itemData[0],
	    	rid = itemData[1],
	    	obj = itemData[2],
	    	index = itemData[3];
	    http.post({
	    	url:that.data.url,
	        data:{
	            action:'do_mymission',
	            rid:rid,
	            dotype:dotype
	        },
	        success:function(res){
	            if(res.status==1){
	                if(index!=1){
	                    // that[obj][index].times = parseInt(that[obj][index].times)+1;
	                    // that[obj][index].finish = 1;
	                    let objNew = {};
	                    objNew[obj+'.'+index+'.finish'] = 1;
	                    that.setData(objNew);
	                }else{
	                    if(that.data[obj][index].times>=that.data[obj][index].handlenum-1){
	                        // that[obj][index].times = parseInt(that[obj][index].times)+1;
	                        // that[obj][index].finish = 1;

	                        let objNew = {};
	                        objNew[obj+'.'+index+'.times'] = parseInt(that[obj][index].times)+1;
	                        objNew[obj+'.'+index+'.finish'] = 1;
	                        that.setData(objNew);
	                    }else{
	                        if(that[obj][index].times<6){
	                            // that[obj][index].dateline = 1800;
	                            let objNew = {};
	                            objNew[obj+'.'+index+'.dateline'] = 1800;
	                            that.setData(objNew);
	                            var seconds = 1800000;
	                            that.setCountDown(seconds);
	                        }
	                        // that[obj][index].times = parseInt(that[obj][index].times)+1;
	                        let objNew = {};
	                        objNew[obj+'.'+index+'.times'] = parseInt(that[obj][index].times)+1; 
	                        that.setData(objNew);
	                    }
	                }
	            }else{
	                console.log(res.content);
	            }
	        }
	    })
	},
	myachMission:function(type){
	    var that = this;
	    http.post({
	    	url:that.data.url,
	        data:{
	            action:"myach_mission",
	            type:type
	        },
	        success:function(res){
	            if(res.status==1){
	                // that.achData = res.data.dataList;
	                // that.achInfo.taskUnlock = res.taskUnlock;
	                // that.achInfo.sum = res.data.sum;
	                // that.achInfo.otherySum = res.data.otherySum;
	                // that.achInfo.type = type;
	                let obj = {};
	                obj['achData'] = res.data.dataList;
	                obj['achiInfo.taskUnlock'] = res.taskUnlock;
	                obj['achInfo.sum'] = res.data.sum;
	                obj['achInfo.otherySum'] = res.data.otherySum;
	                obj['achInfo.type'] = type;
	                that.setData(obj);
	            }
	        }
	    })
	},
	liclick:function(event){
		var type = event.currentTarget.dataset.id;
		this.setData({
			specialActive: type
		})
	    this.myachMission(type);
	},
	goTaskDetail:function(event){
		var that = this,
			rid = event.currentTarget.dataset.rid;
		if(that.data.special&&that.data.taskUnlock==0) return;
		// window.location.href = './taskdetail.html?input='+this.input+'&rid='+rid;
		wx.navigateTo({
		    url: 'taskDetail/taskDetail?rid=' + rid
		})

	}
})