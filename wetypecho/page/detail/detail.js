/* WeTypecho-微信小程序版Typecho
   使用教程：www.2012.pro
   有任何使用问题请联系作者QQ 294351525
*/
var API = require('../../utils/api');
var Net = require('../../utils/net');

// 获取全局应用程序实例对象
var app = getApp();

function likemember(name,img) {
  this.nickname = name;
  this.avatarUrl = img;
}
// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "detail",
  /**
   * 页面的初始数据
   */

  data: {
    zannum: 0,
    item: [],
    vcomment: [],
    commentlist: [],
    thispath: 'page/detail/detail',
    cid: 0,
    hiddenmodalput:true,
    replaycoid: '',
    replaycontent: '',
    zanimg: '../../resources/zanoff.png',
    likelist: [],
    createdtime: '1分钟前',
    replytxt: '说点什么吧...',
    cmplaceholder: '说点什么吧...',
    focus: false,
    cmtext: '',
    replyauthor: true,
    qrcode_temp: '',
    painting: {},
    cmbtnclick: false,
    related_post:[],
    display_related: 'none',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.data.cid = options.item;
  },
  __bind_tap (event) {
    var href = event.target.dataset._el.attr.href;
    if(API.IsNull(href)) {
      var cidaddr = href.search('cid=');
      if( -1 != href.search(API.GetDomain()) && -1 != cidaddr ) {

          var end = href.search('.html');
          var cid = href.substring(cidaddr+4,end);
          wx.navigateTo({
            url: '../detail/detail?item=' + cid,
          })
      } else {
      wx.setClipboardData({
          data: href,
          success() {
            wx.hideToast();
            wx.showToast({
              title: '链接已复制',
              duration: 2000
            })
          }
        })
      }
    }
  },
  //获取文章详细
  getdetails(cid) {
    var that = this;
    Net.request({
      url: API.GetPostsbyCID(cid),
      success: function(res) {
        var datas = res.data.data;
        var parsed_item = API.ParseItem(datas[0]);
        var data = parsed_item.text.replace(/!!!/g,"");
        let data_parse = app.towxml.toJson(data,'markdown');
        that.setData({
          content: data_parse,
          item: parsed_item,
        })
        //发布时间
        that.data.createdtime = API.getcreatedtime(parsed_item.created);
        that.setData({
          createdtime: that.data.createdtime
        })
        //获取相关文章
        that.fetchpostbymid(that.data.item.mid)
      }
    })
    //获取文章评论
    this.getcomments(cid);
    //获取点赞列表
    this.getlikelist(cid);
  },
  fetchpostbymid(mid) {
    var that = this;
    Net.request({
      url: API.GetPostsbyMIDLimit(mid,3,that.data.item.cid),
      success: function(res) {
        var datas = res.data.data;
        if(datas != null && datas!=undefined) {
            that.data.related_post = datas.map(function (item){
            item.posttime = API.getcreatedtime(item.created);
            return item;
          });
          if(that.data.related_post.length>0){
          that.setData({
            display_related: 'block',
            related_post: that.data.related_post,
            postheight: that.data.related_post.length * 180 + 'rpx'
          })
        }
        }
      }
    })
  },
  getlikelist(cid) {
    var that = this;
    Net.request({
      url:API.Getuserlikedlist(cid),
      success: function(res) {
        var datas = res.data.data;
        if(datas != null && datas != undefined) {
          if(datas.length < that.data.item.likes)
          {
            var cnt = that.data.item.likes - datas.length;
            for(var i=0; i< cnt; i++)
              {
                var user = new likemember('网页用户','../../resources/chrome.png')
                datas.push(user);
              }
          }
          that.setData({
            likelist: datas.map(function (item){
              return item;
            })
          })
        } else {
          if( that.data.item.likes > 0 ) {
            var m_datas = [];
            for(var i=0; i< that.data.item.likes; i++)
              {
                var user = new likemember('网页用户','../../resources/chrome.png')
                m_datas.push(user);
              }
              that.setData({
                likelist: m_datas.map(function(item) {
                  return item;
                })
              })
          } else {
            that.setData({
              likelist: []
            })
          }
        }
      }
    })
  },
  getcomments(cid) {
    var that = this;
    Net.request({
      url: API.GetPostsCommentbyCID(cid),
      success: function(res) {
        var comments = res.data.data;
        that.setData({
          commentlist: comments.map(function (item){
            if(item.author == null || item.author == 'undefined')
              {
                item.author = '游客';
              }
            if(item.authorImg == null || item.authorImg == 'undefined')
              {
                item.authorImg = 'http://secure.gravatar.com/avatar/';
              }
            item.comcreatedtime = API.getcreatedtime(item.created);
            return item;
          })
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
    var that = this;
    this.getdetails(that.data.cid);
    if( API.loginsuccess(app)) {
      Net.request({
        url: API.Getuserlikedinfo(that.data.cid,app.Data.userInfo.openid),
        success: function(res) {
          var datas = res.data.data;
          if(datas=='false') {
            that.setData({
              zanimg: '../../resources/zanoff.png'
            })
          }
          else {
            that.setData({
              zanimg: '../../resources/zanon.png'
            })
          }
        }
      })
    }
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
    this.getdetails(this.data.cid);
  },
  zanstart: function()
  {
    var that = this;
    if( API.loginsuccess(app)) {
      Net.request({
        url: API.PostLike(that.data.item.cid,app.Data.userInfo.openid),
        success: function(res) {
          var datas = res.data.data;
          var status = datas.status;
          that.data.item.likes = datas[0].likes;
          that.setData({
            item: that.data.item
          })
          if(status=='like') {
            that.setData({
              zanimg: '../../resources/zanon.png'
            })
          }
          else {
            that.setData({
              zanimg: '../../resources/zanoff.png'
            })
          }
          that.getlikelist(that.data.cid);
        }
      })
    }
    else
    {
      API.ConfirmAuth();
    }
  },
  replayto:function(e){
    if( API.loginsuccess(app)) {
      var to = e.target.dataset.author;
      this.data.replaycoid = e.target.dataset.authorid;
      this.setData({
        to: to,
        focus: true,
        cmplaceholder: '回复 ' + to + ":",
        replyauthor: false
      })
    }
    else
    {
      API.ConfirmAuth();
    }
  },

  sendcm: function() {
    var that = this;
    that.setData({
      cmbtnclick: true
    });
    if(this.data.cmtext != '' && this.data.cmtext != undefined && this.data.cmtext != null)
    {
      if( API.loginsuccess(app)) {
        if(this.data.replyauthor) {
          this.data.replaycoid = 0;
        }
        this.data.replyauthor = true;
        Net.request({
          url: API.Postcomment(that.data.item.cid,app.Data.userInfo.nickName,that.data.cmtext,that.data.replaycoid,app.Data.userInfo.avatarUrl),
          success: function(res) {
            that.getcomments(that.data.item.cid);
            that.setData ({
              cmtext: '',
              cmplaceholder: '说点什么吧...'
            })
          }
        })
      }
      else
      {
        API.ConfirmAuth();
      }
    }
    else
    {
      wx.showToast({
        title: '请输入回复文字',
        icon: 'none',
        duration: 2000
      })
    }
  },
  cmfocus: function (e) {
    var that = this;
    if (!that.data.focus) {
      that.setData({
          focus: true
      })
    }
  },
  cminput: function(e) {
    this.setData({
      cmtext: e.detail.value.trim()
    })
  },
  replaycontent: function(e) {
    this.setData({
      replaycontent: e.detail.value
    })
  },
  share: function() {
    var that = this;
    if( API.loginsuccess(app)) {
      wx.navigateTo({
        url: '../share/share?nickName=' + app.Data.userInfo.nickName + "&thumb=" + that.data.item.thumb + "&title=" + that.data.item.title + "&path=" + that.data.thispath + "&cid=" + that.data.cid,
      })
    } else{
      API.ConfirmAuth();
    }
  },
  eventGetImage (event) {
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: this.data.item.title,
      path: this.data.item.thispath,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败

      }
    }
  },
  cmloss: function() {
    this.setData({
      cmplaceholder: '说点什么吧...',
    })
  }
})
