var _$encode = function(_map,_content){
    _content = ''+_content;
    if (!_map||!_content){
        return _content||'';
    }
    return _content.replace(_map.r,function($1){
        var _result = _map[!_map.i?$1.toLowerCase():$1];
        return _result!=null?_result:$1;
    });
};
/**
 * 日期格式化
 * @return string
 */
var dateFormat = (function(){
    var _map = {i:!0,r:/\byyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w|ct|et\b/g},
        _12cc = ['上午','下午'],
        _12ec = ['A.M.','P.M.'],
        _week = ['日','一','二','三','四','五','六'],
        _cmon = ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
        _emon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
    var _fmtnmb = function(_number){
        _number = parseInt(_number)||0;
        return (_number<10?'0':'')+_number;
    };
    var _fmtclc = function(_hour){
        return _hour<12?0:1;
    };
    return function(_time,_format,_12time){
        if (!_time||!_format)
            return '';
        _time = new Date(_time);
        _map.yyyy = _time.getFullYear();
        _map.yy   = (''+_map.yyyy).substr(2);
        _map.M    = _time.getMonth()+1;
        _map.MM   = _fmtnmb(_map.M);
        _map.eM   = _emon[_map.M-1];
        _map.cM   = _cmon[_map.M-1];
        _map.d    = _time.getDate();
        _map.dd   = _fmtnmb(_map.d);
        _map.H    = _time.getHours();
        _map.HH   = _fmtnmb(_map.H);
        _map.m    = _time.getMinutes();
        _map.mm   = _fmtnmb(_map.m);
        _map.s    = _time.getSeconds();
        _map.ss   = _fmtnmb(_map.s);
        _map.ms   = _time.getMilliseconds();
        _map.w    = _week[_time.getDay()];
        var _cc   = _fmtclc(_map.H);
        _map.ct   = _12cc[_cc];
        _map.et   = _12ec[_cc];
        if (!!_12time){
            _map.H = _map.H%12;
        }
        return _$encode(_map,_format);
    };
})();

/**
 * 日期格式化
 */
var dateFormat2 = function (time,fmt) {
	var date = new Date(time);
    var o = {
        "M+": date.getMonth() + 1,  // 月份
        "d+": date.getDate(),		// 日
        "h+": date.getHours(),		// 小时
        "m+": date.getMinutes(),	// 分
        "s+": date.getSeconds(),	// 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var util = {
	transTime2: function(time){
        var check = this.getDayPoint(new Date());
        if (time>=check[0]){
            return dateFormat(time,"HH:mm")
        }else if(time>=check[0]-60*1000*60*24){
            return "昨天";
        }else if(time>=(check[0]-2*60*1000*60*24)){
            return "前天";
        }else if(time>=(check[0]-7*60*1000*60*24)){
            return "星期"+dateFormat(time,"w");
        }else if(time>=check[1]){
            return dateFormat(time,"MM-dd")
        }else{
            return dateFormat(time,"yyyy-MM-dd")
        }
	},
	getDayPoint: function(time){
		time.setMinutes(0);
		time.setSeconds(0);
		time.setMilliseconds(0);
		time.setHours(0);
		var today = time.getTime();
		time.setMonth(1);
		time.setDate(1);
		var yearDay = time.getTime();
		return [today,yearDay];
	},
	sessionsTrans:function(sessions){
        if(sessions.length<=0) return sessions;
		var self = this;
		var sessionsSplit = {
				personSessions:[],
				teamSessions:[],
				teamSessionsUnread:0,
			}; 
		sessions.forEach(function(value,index,arr){
			sessions[index].updateTime = self.transTime2(value.updateTime);
			if(value.lastMsg.fromClientType == 'Server'){
				// sessionsSplit.teamSessions.push(value);
				if(value.id!='p2p-4806'){
					value.lastMsg.content = JSON.parse(value.lastMsg.content);
					value.lastMsg.content.data.message = JSON.parse(value.lastMsg.content.data.message);
					sessionsSplit.teamSessions.push(value);
					sessionsSplit.teamSessionsUnread += value.unread;
				}
			}else{
				sessionsSplit.personSessions.push(value);
			}
		})
		return sessionsSplit;
	},
	usersTrans:function(users){
        if(users.length<=0) return users;
		for(var user in users){
			users[user].custom = JSON.parse(users[user].custom);
		}
		return users;
	},
	msgsTrans:function(msgs){
        if(msgs.length<=0) return msgs;
		msgs.forEach(function(value,index,arr){
			msgs[index].time = dateFormat2(value.time,'yyyy-MM-dd hh:mm');
			msgs[index].content = JSON.parse(msgs[index].content);
			msgs[index].content.data.message = JSON.parse(msgs[index].content.data.message);
		})
		msgs.reverse();
		return msgs;
	},
	toPersonMsgsTrans:function(msgs){
        if(msgs.length<=0) return msgs;
        msgs.forEach(function(value,index,arr){
            msgs[index].timeTrans = dateFormat2(value.time,'yyyy-MM-dd hh:mm');
        })
        return msgs;
    }
}

module.exports = util;
