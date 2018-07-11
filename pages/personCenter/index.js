// pages/personCenter/index.js
//获取应用实例
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: {},
    servicePhone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPersonInfo();
    this.getServicePhone();
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
    this.onLoad();
    wx.stopPullDownRefresh();
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
  getPersonInfo: function () {
    var self = this;

    wx.request({
      url: interfacePrefix + '/customer/getCustomerBaseInfo',
      method: 'POST',
      success: function (res) {
        self.setData({ userInfo: util.toLowerCaseForObjectProperty(res.data) });
      }
    });
  },
  getServicePhone: function () {
    var self = this;

    wx.request({
      url: interfacePrefix + '/sys/dict/getByParamKey',
      method: 'POST',
      data: {
        paramKey: 'service_phone '
      },
      success: function (res) {
        self.setData({ servicePhone: res.data });
      }
    });
  },
  seeRankOfIntegral: function () {
    wx.navigateTo({
      url: '../rankIntegral/index'
    })
  },
  seeRankOfPromotion: function () {
    wx.navigateTo({
      url: '../rankPromotion/index'
    });
  },
  goQRCode: function () {
    wx.navigateTo({
      url: '../qrCode/index'
    });
  },
  goCouponCenter: function () {
    wx.navigateTo({
      url: '../coupon/index'
    });
  },
  goAddress: function () {
    wx.navigateTo({
      url: '../address/index'
    });
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.servicePhone
    });
  },
  goMyMember: function() {
    wx.navigateTo({
      url: '../myMember/index'
    });
  }
})