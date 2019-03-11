/* WeTypecho-微信小程序版Typecho
   使用教程：www.2012.pro
   有任何使用问题请联系作者QQ 294351525
*/
var API = require('../../utils/api');
// 获取全局应用程序实例对象
var app = getApp();
var Net = require('../../utils/net');
function ranktype(name,active,idx) {
  this.name = name;
  this.active = active;
  this.idx = idx;
}
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
    ranklist: [],
    active_idx: 0,
    windowHeight: 100,
    current_cat_mid: -1,
    searchkeyword: '',
    allrankpostlist: [null,null,null]
  },

  changeCat(e) {
    this.data.ranklist[this.data.active_idx].active = false;
    this.data.ranklist[e.target.dataset.idx].active = true;
    this.setData({
      active_idx: e.target.dataset.idx,
      ranklist: this.data.ranklist,
    })
    this.fetchrank(e.target.dataset.idx);
  },
  change_finish(e) {
    var that = this;
    if(e.detail.current != this.data.active_idx) {
      this.data.ranklist[this.data.active_idx].active = false;
      this.data.ranklist[e.detail.current].active = true;
      this.setData({
        active_idx: e.detail.current,
        ranklist: this.data.ranklist
      })
    }
    this.fetchrank(e.detail.current);
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
    this.data.ranklist.push(new ranktype('浏览量',1,0));
    this.data.ranklist.push(new ranktype('评论数',0,1));
    this.data.ranklist.push(new ranktype('点赞数',0,2));
    this.setData({
      ranklist: this.data.ranklist,
      active_idx: 0
    })
    this.fetchrank(0);
  },

  fetchrank(idx) {
    var that = this;
    Net.request({
      url: API.GetRankedPosts(idx),
      success: function(res) {
        var datas = res.data.data;
        var rank = 1;
        that.data.allrankpostlist[idx] = datas.map(function (ori_item){
          var item = API.ParseItem(ori_item);
          item.posttime = API.getcreatedtime(item.created);
          item.rank = rank++;
          return item;
        });
        that.setData({
          allrankpostlist: that.data.allrankpostlist,
          postheight: that.data.allrankpostlist[idx].length * 145 + 'rpx',
        })
      }
    })
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
