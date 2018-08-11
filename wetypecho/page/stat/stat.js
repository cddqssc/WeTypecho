/* WeTypecho-微信小程序版Typecho
   使用教程：www.2012.pro
   有任何使用问题请联系作者QQ 294351525
*/
var API = require('../../utils/api');
// 获取全局应用程序实例对象
var app = getApp();
var Net = require('../../utils/net');

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "list",
  /**
   * 页面的初始数据
   */

  data: {
    showstat: false,
    genlist:[],
    netlist:[],
    serverlist:[],
    downloadprogress: 0,
    disablebtn: false,
    speedtext: '',
    lastspeed: '0'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (e) {
    this.auth();
  },
  auth() {
    var that = this;
    if( API.loginsuccess(app)) {
      Net.request({
        url: API.MonitorVerfy(app.Data.userInfo.openid),
        showloading: true,
        success: function(res) {
          var datas = res.data.data;
          if(datas == 'true') {
            that.setData({
              showstat: true
            })
            API.Init_speed();
            that.Countdown();
          } else {
            that.setData({
              showstat: false
            })
          }
        }
      })
    } else {
      API.ConfirmAuth();
    }
  },
  getstat() {
    var that = this;
    Net.request({
      url: API.GetServerStat(),
      showloading: false,
      success: function(res) {
        var datas = res.data.data;
        if(datas != null && datas != undefined) {
          var obj = API.ParseStat(datas);
          that.setData({
            genlist: obj.genlist,
            netlist: obj.netlist,
            serverlist: obj.serverlist,
          })
        }
      }
    })
  },

  starttestspeed() {
    var that = this;
    var filelen = 0;
    that.setData({
      disablebtn: true
    })
    var timest = (new Date()).valueOf();
    const downloadTask = wx.downloadFile({
      url: API.GetDomain() + 'usr/plugins/WeTypecho/res/test.bin',
      success: function(res) {
        var timespan = (new Date()).valueOf() - timest;
        var speed = Math.round(( filelen/1024 ) / (timespan/1000) * 100) / 100;
        that.setData({
          speedtext: '文件大小:' + filelen/ (1024 * 1024 ) + 'MB,' + '花费时间:' + timespan/1000 + '秒。\n' + '平均速度:' + speed + 'kb/s,' + '上次测速:' + that.data.lastspeed + 'kb/s。'
        })
        that.setData({
          lastspeed: speed
        })
        wx.showModal({
          tilte: '测速完成',
          content: that.data.speedtext
        })
      },
      fail: function(res) {
        wx.showModal({
          tilte: '测速失败',
          content: '你的网速太不给力了！'
        })
        that.setData({
          speedtext: '测速失败，请重新开始测速'
        })
      },
      complete: function(res) {
        that.setData({
          disablebtn: false
        })
      }
    })
    downloadTask.onProgressUpdate((res) => {
      this.setData({
        downloadprogress: res.progress
      })
      filelen = res.totalBytesExpectedToWrite;
    })
  },

  Countdown() {
    var that = this;
    setTimeout(function () {
      that.getstat();
      that.Countdown();
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {    
    wx.stopPullDownRefresh();
    if( API.loginsuccess(app) ) {
    } else if( !this.data.showstat ) {
      this.auth();
    }
  },


  //以下为自定义点击事件
  
})

