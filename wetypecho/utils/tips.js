var isLoading = false;
/**
 * 弹出提示框
 */
module.exports = {
success(title, duration = 500) {
    setTimeout(() => {
    wx.showToast({
        title: title,
        icon: "success",
        mask: true,
        duration: duration
    });
    }, 300);
    if (duration > 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        resolve();
        }, duration);
    });
    }
},

toast(title, onHide, icon = "success") {
    setTimeout(() => {
    wx.showToast({
        title: title,
        icon: icon,
        mask: true,
        duration: 500
    });
    }, 300);

    // 隐藏结束回调
    if (onHide) {
    setTimeout(() => {
        onHide();
    }, 500);
    }
},

/**
 * 警告框
 */
alert(title) {
    wx.showToast({
    title: title,
    image: "../images/alert.png",
    mask: true,
    duration: 1500
    });
},

/**
 * 错误框
 */

error(title, onHide) {
    wx.showToast({
    title: title,
    image: "../images/error.png",
    mask: true,
    duration: 500
    });
    // 隐藏结束回调
    if (onHide) {
    setTimeout(() => {
        onHide();
    }, 500);
    }
},

loading(title = "加载中") {
    if (isLoading) {
        return;
    }
    isLoading = true;
    wx.showLoading({
    title: title,
    mask: true,
    });
},

loaded() {
    if (isLoading) {
        isLoading = false;
        wx.hideLoading();
    }
},

loadfailed(str) {
    if (isLoading) {
    isLoading = false;
    wx.hideLoading();
    wx.showToast({
        title: str,
        image: '../../resources/error.png',
        mask: true,
        duration: 2000
    });
    }
},

share(title, url, desc) {
    return {
    title: title,
    path: url,
    desc: desc,
    success: function(res) {
        Tips.toast("分享成功");
    }
    };
    }
}
