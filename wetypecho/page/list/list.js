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
    allpostslist:[],
    title: ''
  },
  fetchposts() {
    var that = this;
    Net.request({
      url: API.GetPosts(),
      success: function(res) {
        var datas = res.data.data;
        that.setData({          
          allpostslist: datas.map(function (ori_item){
            var item = API.ParseItem(ori_item);
            item.posttime = API.getcreatedtime(item.created);            
            return item;
          })
        })        
      }
    })
  },
  fetchserach(keyword) {
    var that = this;
    Net.request({
      url: API.Search(keyword),
      success: function(res) {
        var datas = res.data.data;        
        if(datas != 'none') {
          that.setData({
            allpostslist: datas.map(function (ori_item){
              var item = API.ParseItem(ori_item);
              item.posttime = API.getcreatedtime(item.created);  
              return item;
            })
          })
        } else {
          wx.showToast({
            title: '没有搜索结果',
            image: '../../resources/error1.png',
            duration: 2000,
          })
          setTimeout(function(){
            wx.navigateBack();
          },2000)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (e) {    
    if(JSON.stringify(e) == "{}") {
      this.fetchposts();
      this.setData({
        title:'所有文章列表：',
      })
    }
    else if(e.keyword != undefined) {
      var keyword = e.keyword;
      this.setData({
        title:'搜索关键字 \“' + keyword + '\” 的结果：',
      })
      this.fetchserach(keyword);
    } else if(e.mid != undefined && e.name != undefined) {
        this.setData({
          title:'分类 \“' + e.name + '\” 下的所有文章：',
        })
        this.fetchpostbymid(e.mid)
      }
  },
  fetchpostbymid(mid) {
    var that = this;
    Net.request({
      url: API.GetPostsbyMID(mid),
      success: function(res) {
        var datas = res.data.data;
        if(datas != null && datas!=undefined) {
          that.setData({
            allpostslist: datas.map(function (item){
              item.posttime = API.getcreatedtime(item.created);
              // item.thumb = item.thumb[0].str_value;
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
    this.fetchposts();
  },


  //以下为自定义点击事件
  
})

