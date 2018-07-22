// pages/orderDetail/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var params = util.getCurrentPageInfo().params,
        pId = params.id;

    if (!pId) {
      return;
    }
    this.setData({ 'orderId': pId });
    this.getOrderDetail();
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
  getOrderDetail: function () {
    var self = this,
        data;

    wx.request({
      url: interfacePrefix + '/order/getOrderItems',
      method: 'POST',
      data: {
        order_id: self.data.orderId
      },
      success: function (res) {
        data = util.toLowerCaseForObjectProperty(res.data);
        data.items = data.items.map(function(item) {
          return util.toLowerCaseForObjectProperty(item);
        });
        data.addressDetail = data.province + data.city + data.district + data.address;
        self.setData({ distributionInfo: data, order: data });
      }
    })
  }
})