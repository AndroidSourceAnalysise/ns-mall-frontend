// pages/qrCode/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendQRcodeUrl: ''
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
      }
    });
  }
})