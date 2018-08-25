var requestHandler = {
    url: '',
    data: {},
    method: '',
    success: function (res) {
    },
    fail: function () {
    },
    complete: function () {
    }
  }
   
  function request(requestHandler) {
    var data = requestHandler.data;
    var url = requestHandler.url;
    var method = requestHandler.method;
    var showloading = requestHandler.showloading;
    if(showloading != false) {
      wx.showLoading({
        title: '加载中',
        mask: false
      })
    }
    wx.request({
      url: url,
      data: data,
      method: method,
      success: function (res) {
        wx.hideLoading();        
        requestHandler.success(res)
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误请刷新',
          image: '../../resources/error1.png',
          duration: 2000
        })
        requestHandler.fail();
      },
      complete: function () {                                      
      }
    })
  }
   
  module.exports = {
    request: request
  }