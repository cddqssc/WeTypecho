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
  name: "cat",
  /**
   * 页面的初始数据
   */

  data: {
    allcatslist:[],
    catpostlist:[],
    windowHeight: 100,
    current_cat_mid: -1,
    searchkeyword: ''
  },

  fetchallcats() {
    var that = this;
    Net.request({
      url: API.GetCat(),
      success: function(res) {
        var datas = res.data.data;
        that.data.allcatslist = datas.map(function (item){
          return item;
        });
        if(that.data.allcatslist.length>0) {
          that.data.allcatslist[0].active = true;
          that.changeCatex(that.data.allcatslist[0].mid);
        }
        that.setData({
          allcatslist: that.data.allcatslist
        })
      }
    })
  },
  changeCat(e) {
    this.data.current_cat_mid = e.target.dataset.mid;
    this.changeCatex(this.data.current_cat_mid);
  },

  changeCatex(mid) {
    this.setData({
      catpostlist: []
      })
    this.data.allcatslist = this.data.allcatslist.map(function (item){
      if(item.mid == mid) 
        item.active = true;
      else
        item.active = false;
      return item;
    })
    this.setData({
      allcatslist: this.data.allcatslist
    })
    this.fetchpostbymid(mid);
  },

  fetchpostbymid(mid) {
    var that = this;
    Net.request({
      url: API.GetPostsbyMID(mid),
      success: function(res) {
        var datas = res.data.data;
        if(datas != null && datas!=undefined) {
          that.setData({
            catpostlist: datas.map(function (item){
              item.posttime = API.getcreatedtime(item.created);
              return item;
            })
          })
        } else {
          wx.showToast({
              title: '该分类没有文章',
              image: '../../resources/error1.png',
              duration: 2000
          })
        }
      }
    })
  },

  searchBtn: function(e) {
    var that = this;
    if(that.data.searchkeyword.length > 0)  {
      wx.navigateTo({
        url: '../list/list?keyword=' + that.data.searchkeyword,
      })
    } else {
      wx.showToast({
        title: '请输入关键字',
        image: '../../resources/error1.png',
        duration: 2000
      })
    }
  },
  searchinput(e) {
    this.setData({
      searchkeyword: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    this.fetchallcats();
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
    this.fetchallcats();
  },


  //以下为自定义点击事件
  
})

