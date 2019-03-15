/* WeTypecho-微信小程序版Typecho
   使用教程：www.2012.pro
   有任何使用问题请联系作者QQ 294351525
*/
var API = require('../../utils/api');
var Net = require('../../utils/net');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "share",
  /**
   * 页面的初始数据
   */

  data: {
    nickName: '',
    thumb: '',
    title: '',
    path: '',
    painting: {},
    notification: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (e) {
    var that = this;
    that.setData({
      nickName: e.nickName,
      thumb: e.thumb,
      title: e.title,
      path: e.path+"?item="+e.cid,
    })
    that.share();
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
    this.share();
  },
  share: function() {
    var that = this;
    Net.request({
      url: API.GetAccessCode(this.data.path),
      success: function(res) {
        wx.showToast({
          title: '图片生成中',  //标题
          icon: 'loading',  //图标，支持"success"、"loading"
          duration: 10000, //提示的延迟时间，单位毫秒，默认：1500
          mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
        })
        var actoken = res.data.data;
        if(actoken = 'qrcode.png')
          {
            var qrcodeurl = API.GetDomain() + 'qrcode.png';
            that.setData({
              painting: {
                width: 375,
                height: 555,
                clear: true,
                views: [
                  {
                    type: 'image',
                    url: '/resources/cvbg.jpeg',
                    top: 0,
                    left: 0,
                    width: 375,
                    height: 555
                  },
                  {
                    type: 'text',
                    content: '您的好友【' + app.Data.userInfo.nickName + '】',
                    fontSize: 16,
                    color: '#402D16',
                    textAlign: 'left',
                    top: 33,
                    left: 29,
                    bolder: true
                  },
                  {
                    type: 'text',
                    content: '分享了一篇文章，快来看看吧',
                    fontSize: 15,
                    color: '#563D20',
                    textAlign: 'left',
                    top: 59.5,
                    left: 29
                  },
                  {
                    type: 'image',
                    url: that.data.thumb,
                    top: 136,
                    left: 42.5,
                    width: 290,
                    height: 186
                  },
                  {
                    type: 'image',
                    url: qrcodeurl,
                    top: 443,
                    left: 85,
                    width: 68,
                    height: 68
                  },
                  {
                    type: 'text',
                    content: that.data.title,
                    fontSize: 24,
                    lineHeight: 30,
                    color: '#383549',
                    textAlign: 'left',
                    top: 336,
                    left: 44,
                    width: 287,
                    MaxLineNumber: 2,
                    breakWord: true,
                    bolder: true
                  },
                  {
                    type: 'text',
                    content: '长按识别图中二维码查看文章',
                    fontSize: 18,
                    color: '#383549',
                    textAlign: 'left',
                    top: 460,
                    left: 165.5,
                    lineHeight: 20,
                    MaxLineNumber: 2,
                    breakWord: true,
                    width: 125
                  }
                ]
              }
            })
          }
      }
    })
  },
  eventGetImage (event) {
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
      wx.hideToast();
      this.Saveimg();
      this.setData({
        notification: '图片已保存到相册，快去朋友圈分享吧~'
      })
    }
  },
  Saveimg () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success (res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
  })
  },
})
