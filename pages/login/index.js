// pages/login/index.js
var app = getApp(),
    util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;

    if(!this.data.canIUse) {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: function(res) {
          self.setUserInfo(res);
        }
      })
    }
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
  getUserInfoCb: function (res) {
    console.log(res);
    this.setUserInfo(res.detail);
  },
  setUserInfo: function (res) {
    var pages = getCurrentPages(),
        prevPage = pages.length > 1 ? pages[pages.length - 2] : '../index/index';

    console.log(res);
    app.globalData.userInfo = res.userInfo;
    wx.request({
      url: interfacePrefix + '/applet/saveCustomerInfo',
      method: 'POST',
      data: res,
      success: function (res) {
        wx.reLaunch({
          url: prevPage
        });
      }
    });
  },
})