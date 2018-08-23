import cfg from "../config.js";

var domain = cfg.getdomain;
var apisec = cfg.getapisecret;
var API_URL = 'https://' + domain + '/api/';
var lastin = 0;
var lastout = 0;
function statmember(title,value,showpr,pr) {
    this.title = title;
    this.value = value;
    this.showpr = showpr;
    this.progress = pr;
}

module.exports = {
    GetDomain: function() {
        return 'https://' + domain + '/';
    },
    GetPosts: function() {
        return this.appendAPISEC(API_URL + 'posts?&pageSize=10');
    },
    GetRankedPosts: function(idx) {
        return this.appendAPISEC(API_URL + 'posts?&pageSize=30' + '&idx=' + idx);
    },
    GetAboutCid: function() {
        return this.appendAPISEC(API_URL + 'getaboutcid?');
    },
    GetSwiperPost() {
        return this.appendAPISEC(API_URL + 'getswiperpost?');
    },
    GetCat: function() {
        return this.appendAPISEC(API_URL + 'getcat?');
    },
    GetAccessCode: function(url) {
        return this.appendAPISEC(API_URL + 'getaccesscode?path=' + url);
    },
    GetPostsbyCID: function(cid){
        return this.appendAPISEC(API_URL + 'posts?cid=' + cid);
    },
    GetPagebyCID: function(cid){
        return this.appendAPISEC(API_URL + 'posts?cid=' + cid + '&getpage=1');
    },
    GetPostsbyMID: function(mid){
        return this.appendAPISEC(API_URL + 'getpostbymid?mid=' + mid);
    },
    GetPostsbyMIDLimit: function(mid,limit,except){
        return this.appendAPISEC(API_URL + 'getpostbymid?mid=' + mid + '&pageSize=' + limit + '&except=' + except);
    },
    PostLike: function(cid,openid){
        return this.appendAPISEC(API_URL + 'likePost?cid=' + cid + '&openid=' + openid);
    },
    GetPostsCommentbyCID: function(cid){
        return this.appendAPISEC(API_URL + 'getcomment?cid=' + cid);
    },
    GetPostsReplybyCID: function(cid, parent){
        return this.appendAPISEC(API_URL + 'getcomment?cid=' + cid + '&parent=' + parent);
    },
    Postcomment: function(cid,author,text,parent,icon) {
        return this.appendAPISEC(API_URL + 'addcomment?cid=' + cid + '&author=' + author + '&text=' + text + '&parent=' + parent + '&icon=' + icon);
    },
    Login: function(userInfo) {
        return this.appendAPISEC(API_URL + 'login?code=' + userInfo.code + '&nickname=' + userInfo.nickName + '&avatarUrl=' + userInfo.avatarUrl + '&city=' + userInfo.city + '&country=' + userInfo.country + '&gender=' + userInfo.gender + '&province=' + userInfo.province);
    },
    Getuserlikedinfo: function(cid,openid) {
        return this.appendAPISEC(API_URL + 'getuserlikedinfo?cid=' + cid+ '&openid=' + openid);
    },
    Getuserlikedlist: function(cid) {
        return this.appendAPISEC(API_URL + 'getuserlikedlist?cid=' + cid);
    },
    GetServerStat: function() {
        return this.appendAPISEC(API_URL + 'get_stat?');
    },
    Search: function(key) {
        return this.appendAPISEC(API_URL + 'search?keyword=' + key);
    },
    MonitorVerfy: function(openid) {
        return this.appendAPISEC(API_URL + 'monitorverfy?openid=' + openid);
    },
    loginsuccess: function(app) {
      return ( app.Data.userInfo != null && typeof(app.Data.userInfo.openid) != 'undefined' && app.Data.userInfo.openid !=undefined && app.Data.userInfo.openid.length >=28 )
    },
    ParseStat: function(ori_list) {
        var genlist = [];
        var netlist = [];
        var serverlist = [];
        //负载
        var load = ori_list['loadAvg'];
        var temp = load.split(" ");
        var pr_temp = temp[temp.length - 1].split('/');
        var pr = pr_temp[0] / pr_temp[1] * 100;
        pr = Math.round(pr*100)/100;
        genlist.push(new statmember('负载',ori_list['loadAvg'],true,pr));
        //磁盘
        var disk = '总空间:' + ori_list['DiskTotal'] + 'GB 空余:' + ori_list['DiskFree'] + 'GB';
        var disk_pr = ( ori_list['DiskTotal'] - ori_list['DiskFree'] ) / ori_list['DiskTotal'] * 100;        
        disk_pr =Math.round(disk_pr * 100)/100;
        genlist.push(new statmember('磁盘',disk,true,disk_pr));
        
        var mem = '已用:'+ Math.round(ori_list['memRealUsed']*100)/100 + 'MB 空余:' + Math.round(ori_list['memRealFree']*100)/100 + 'MB';
        genlist.push(new statmember('内存',mem,true,ori_list['memRealPercent']));
        //网卡
        netlist.push(new statmember('入网',this.speedparse( ori_list['NetInput']),false,0));
        netlist.push(new statmember('出网',this.speedparse( ori_list['NetOut']),false,0));
        var net = '出网:' + this.caculate_spped_in( ori_list['NetOut'] ) + ' 入网:' + this.caculate_spped_out( ori_list['NetInput'] );
        netlist.push(new statmember('实时', net, false, 0));

        var cpu = ori_list['cpu'];
        if(this.IsNull(cpu['model'])) {
            serverlist.push(new statmember('型号', cpu['model'], false, 0))
        }
        if(this.IsNull(cpu['num'])) {
            serverlist.push(new statmember('核心', cpu['num'], false, 0))
        }
        if(this.IsNull(cpu['mhz'])) {
            serverlist.push(new statmember('主频', cpu['mhz'], false, 0))
        }
        if(this.IsNull(cpu['cache'])) {
            serverlist.push(new statmember('缓存', cpu['cache'], false, 0))
        }
        if(this.IsNull(cpu['bogomips'])) {
            serverlist.push(new statmember('bogomips', cpu['bogomips'], false, 0))
        }
        //服务器信息
        return {
            genlist,
            netlist,
            serverlist
        }
    },
    IsNull(obj) {
        return(obj != null && obj != undefined);
    },
    Init_speed() {
        lastin = 0;
        lastout = 0;
    },
    caculate_spped_in(speed) {
        if(lastin != 0) {
            var cur_speed = (speed - lastin) / 1024;
            lastin = speed;
            return Math.round(cur_speed*100)/100 + ' kb/s'
        } else {
            lastin = speed;
            return '0 kb/s'
        }
    },
    caculate_spped_out(speed) {
        if(lastout != 0) {
            var cur_speed = (speed - lastout) / 1024;
            lastout = speed;
            return Math.round(cur_speed*100)/100 + ' kb/s'
        } else {
            lastout = speed;
            return '0 kb/s'
        }
    },
    speedparse(speed) {
        var GB = 1024 * 1024 * 1024;
        var MB = 1024 * 1024;
        var KB = 1024;
        var gb_i = Math.floor(speed / GB);
        speed = speed % GB;
        var mb_i = Math.floor(speed / MB);
        speed = speed % MB;
        var kb_i = Math.floor(speed / KB);
        speed = speed % KB;
        var b_i = Math.floor(speed);
        var gb_str = (gb_i > 0) ? (gb_i+' GB ') : '';
        var mb_str = (mb_i > 0) ? (mb_i+' MB ') : ' ';
        var kb_str = (kb_i > 0) ? (kb_i+' KB ') : ' ';
        var b_str = (b_i > 0) ? (b_i+' B') : ' ';
        return(gb_str + mb_str + kb_str + b_str);
    },
    ParseItem: function(ori_item) {
        var that = this;
        var post_date = {
            year: ori_item.year,
            month: ori_item.month,
            day: ori_item.day
        };
        var post = {
            cid: ori_item.cid,
            title: ori_item.title,
            created: ori_item.created,
            date: post_date,
            text: ori_item.text,
            commentsNum: ori_item.commentsNum,
            link: ori_item.permalink,
            thumb: ori_item.thumb[0].str_value,
            views: ori_item.views[0].views,
            likes: ori_item.likes[0].likes,
            //category: ori_item.categories.length > 0 ? ori_item.categories[0].name : null,
            category: ori_item.categories.map(function (item){
                item.length = item.name.length;
                item.background = that.randomHexColor();
                return item;
            }),
            mid: ori_item.categories.length > 0 ? ori_item.categories[0].mid : null,
            showshare: ori_item.showshare
        };
        return post;
    },
    appendAPISEC: function(url) {
        var request = url+"&apisec="+apisec;
        return (request);
    },
    randomHexColor() { //随机生成十六进制颜色
        var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
        while (hex.length < 6) { //while循环判断hex位数，少于6位前面加0凑够6位
        hex = '0' + hex;
        }
        return '#' + hex; //返回‘#'开头16进制颜色
    },
    ConfirmAuth: function() {
        wx.getSetting({
            success: function(res){
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function(res) {
                  }
                })
              }
              else {
                wx.navigateTo({
                  url: '../../page/auth/auth'　　// 页面 A
                })
              }
            }
          })
    },
    getcreatedtime(created) {
        var now = Date.parse(new Date())/1000;
        var span = (now - created) > 0 ? (now - created) : 0;
        if(span<=3600) {
          var ts = Math.round(span / 60);
          return (ts + '分钟前');
        } else if(span<86400) {
          var ts = Math.round(span / 3600);
          return (ts + '小时前');
        } else {
          var ts = Math.round(span / 86400);
          return (ts + '天前');
        }
      },
}