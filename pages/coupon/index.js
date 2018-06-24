// pages/coupon/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curFilterType: '0',
    couponList: [
      { couponName: '新人专享30元优惠', couponTypeStr: '新人专享', discountConsume: 200, reduceMoney: 35, beginDate: '2018-05-21', endDate: '2018-06-21' },
      { couponName: '老顾客专属20元优惠', couponTypeStr: '老客优惠', discountConsume: 200, reduceMoney: 20, beginDate: '2018-04-15', endDate: '2018-06-21' },
      { couponName: '新人专享30元优惠', couponTypeStr: '新人专享', discountConsume: 200, reduceMoney: 35, beginDate: '2018-05-21', endDate: '2018-06-21' },
    ],
    pageNum: 1,
    pageSize: 20,
    isLastPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCouponList(this.data.pageNum, '');
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
  getCouponList: function (pageNum, status) {
    var self = this,
        list = self.data.couponList;

    wx.request({
      url: interfacePrefix + '/coupon/getTldCouponList',
      method: 'POST',
      data: {
        page_num: pageNum,
        page_size: self.data.pageSize
      },
      success: function (res) {
        console.log(list);
        return;
        list = list.concat(res.data);
        self.setData({ couponList: list });
      }
    });
  },
  filterCoupon: function (evt) {
    var target = evt.target,
      filterType = target.dataset.filterType;

    this.setData({ curFilterType: filterType });
  },
  receiveCoupon: function (evt) {
    //领取优惠券
    var target = evt.target,
        id = target.dataset.couponId;

    console.log(id);
  }
})