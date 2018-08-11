/* WeTypecho-微信小程序版Typecho
   使用教程：www.2012.pro
   有任何使用问题请联系作者QQ 294351525
*/
var API = require('../../utils/api');
var Tips = require('../../utils/tips');
var Net = require('../../utils/net');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "index",
  /**
   * 页面的初始数据
   */
  data: {
  postslist:[],
  swipelist:[],
  topswiper: 'none',
  midposts: 'none'
  },
  fetchposts() {
    var that = this;
    Net.request({
      url: API.GetPosts(),
      success: function(res) {
        var datas = res.data.data;
        if(API.IsNull(datas)) {      
          that.setData({
            midposts: 'block',
            postslist: datas.map(function (ori_item){
              var item = API.ParseItem(ori_item);
              return item;
            })
          })
        }
      }
    })
    Net.request({
      url: API.GetSwiperPost(),
      success: function(res) {
        var datas = res.data.data;
        if(API.IsNull(datas)) {
          that.setData({
            topswiper: 'block',
            swipelist: datas.map(function (ori_item){
              var item = API.ParseItem(ori_item);
              return item;
            })
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    wx.getUserInfo({
      success: function(res) {
        app.Data.userInfo = res.userInfo;
        wx.login({
          success:function(res){
            app.Data.userInfo.code = res.code;
            //Login
            Net.request({
              url: API.Login(app.Data.userInfo),
              success: function(res) {                
                var datas = res.data.data;
                app.Data.userInfo.openid = datas;              
              },
              fail: function() {
              }
            })
          }
        })
      }
    });
    this.fetchposts();
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
    this.setData({
      swipelist: [],
      postslist: [],
      midposts: 'none',
      topswiper: 'none'
    })
    this.onLoad(); 
  },


  //以下为自定义点击事件
  
})

