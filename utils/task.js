var taskCommon = {
    back:function(id){
        if(id==1){
            window.history.go(-1);
        }else{
            window.open('http://xys/xys_force_back');
        }
    },
    close:function(){
        window.open('http://xys/xys_force_back');
    },
    refresh:function(){
        location.reload();
    },
    goTaskDetail: function (rid) {
        var that = this;
        if($('#tpbody')[0]&&that.taskUnlock==0) return;
        window.location.href = './taskdetail.html?input='+this.input+'&rid='+rid;
    },
    goTaskProcess:function(){
        var that = this;
        window.location.href = './taskprocess.html?input='+this.input;
    },
    formatUrl:function(url){
        var obj = {};
        if(url.split('?')[1]){
            var query = url.split('?')[1].replace(/=/g,':');
            var arr = query.split('&');
            arr.forEach(function(o){
                o = o.split(':')
                obj[o[0]] = o[1];
            })
        }
        return obj;
    },
    formatDate:function(time){
        if(time<10){
            time = '0'+time;
        }
        return time;
    },
    calCountDown:function(distanceTime,cb){
        var that = this;
        var html;
        var time = distanceTime;
        if(distanceTime>=0){
            var intDay,intHour,intMinute,intSecond;
            intDay = Math.floor(distanceTime/86400000);
            intHour = Math.floor(distanceTime/3600000);
            distanceTime-=intHour*3600000;
            intMinute = Math.floor(distanceTime/60000);
            distanceTime-=intMinute*60000;
            intSecond = Math.floor(distanceTime/1000);

            html = that.formatDate(intHour)+':'+that.formatDate(intMinute)+':'+that.formatDate(intSecond);
            cb&&cb(html);
            setTimeout(function(){
                that.calCountDown(time-1000,cb);
            }, 1000);
        }else{
            html = '';
            cb&&cb(html);
        }
    }
}

module.exports = taskCommon;