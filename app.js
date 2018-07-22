//app.js
var requestFilter = require('./utils/requestFilter.js'),
    interfacePrefix = 'https://m.nashengbuy.com/ns-api/api';
    
App({
  onLaunch: function () {
    // 展示本地存储能力
    var self = this,
        skName = 'ns-sk',
        sk = wx.getStorageSync(skName);

    if(!sk) {
      // 登录
      wx.login({
        success: function (res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: interfacePrefix + '/applet/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function (d) {
              console.log(d);
              wx.setStorageSync(skName, d.data.sk);
            }
          });
        }
      });
    }
    // 获取用户信息
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              self.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
            }
          })
        }else {
          wx.redirectTo({
            url: '/pages/login/index'
          });
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})