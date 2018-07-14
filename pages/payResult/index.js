// pages/payResult/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {
      id: 9354834,
      payStatus: 'success',
      payStatusText: '恭喜您支付成功!',
      integral: 20,
      money: 160,
      payTime: '2018-06-15 12:15:25',
      address: '四川省成都市金融中心财富大厦A座306',
      receiver: '殷紫萍',
      phone: '15832662758'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var params = util.getCurrentPageInfo().params,
        orderNo = params.orderNo;

    //this.getOrderInfo(orderNo);
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
  getOrderInfo: function (orderNo) {
    var self = this;

    if (!orderNo) {
      return;
    }
    wx.request({
      url: interfacePrefix + '',
      method: 'POST',
      data: {
        orderNo: orderNo
      },
      success: function (res) {
        self.setData({ order: res.data });
      }
    });
  },
  goHome: function () {
    wx.redirectTo({
      url: '../index/index'
    });
  }
})