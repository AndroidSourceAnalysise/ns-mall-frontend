// pages/qrCode/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendQRcodeUrl: 'http://ns-1256668373.cos.ap-chengdu.myqcloud.com/dimen/23571102-6f72-4aa4-aaf9-24b443f4ffc5.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    
    this.getQRCodeTemplates().then(function(d) {
      self.getQRCode(d);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getQRCodeTemplates: function () {
    return new Promise(function(resolve, reject) {
      var list;

      wx.request({
        url: interfacePrefix + '/qrcode/getQrBgmList',
        method: 'POST',
        success: function (res) {
          resolve(res.data[0].id);
        }
      })
    });
  },
  getQRCode: function (templateId) {
    var self = this;

    wx.request({
      url: interfacePrefix + '/qrcode/getQrcode',
      method: 'POST',
      data: {
        type: 1,
        bgmTemplateId: templateId
      },
      success: function (res) {
        self.setData({ recommendQRcodeUrl: res.data.codeImageUrl });
        console.log(self.data.recommendQRcodeUrl);
      }
    });
  }
})