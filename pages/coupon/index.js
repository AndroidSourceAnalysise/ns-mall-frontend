// pages/coupon/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curFilterType: 3,
    couponList: [
      { couponName: '新人专享30元优惠', couponTypeStr: '新人专享', discountConsume: 200, reduceMoney: 35, beginDate: '2018-05-21', endDate: '2018-06-21' },
      { couponName: '老顾客专属20元优惠', couponTypeStr: '老客优惠', discountConsume: 200, reduceMoney: 20, beginDate: '2018-04-15', endDate: '2018-06-21' },
      { couponName: '新人专享30元优惠', couponTypeStr: '新人专享', discountConsume: 200, reduceMoney: 35, beginDate: '2018-05-21', endDate: '2018-06-21' },
    ],
    pageNum: 1,
    pageSize: 10,
    isLastPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCouponList(this.data.pageNum, this.data.curFilterType);
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
    //this.getCouponList(this.data.pageNum + 1, this.data.curFilterType);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getCouponList: function (pageNum, status) {
    var self = this,
        list = self.data.couponList,
        typeMap = {
          1: '满额优惠券',
          0: '立减券'
        };

    wx.request({
      url: interfacePrefix + '/coupon/getTldCouponList',
      method: 'POST',
      data: {
        // page_num: pageNum,
        // page_size: self.data.pageSize,
        status: status
      },
      success: function (res) {
        list = list.concat(res.data.map(function (item) {
          item = util.toLowerCaseForObjectProperty(item);
          item.type_str = typeMap[item.coupon_type];
          return item;
        }));
        self.setData({ pageNum: pageNum, couponList: list, curFilterType: status });
      }
    });
  },
  filterCoupon: function (evt) {
    var target = evt.target,
      filterType = parseInt(target.dataset.filterType, 10);

    if (this.data.curFilterType != filterType) {
      this.setData({ couponList: []});
      this.getCouponList(1, filterType);
    }
    this.setData({ curFilterType: filterType });
  },
  receiveCoupon: function (evt) {
    //领取优惠券
    var self = this,
        target = evt.target,
        dataset = target.dataset;

    wx.request({
      url: interfacePrefix + '/coupon/receiveCoupon',
      method: 'POST',
      data: {
        coupon_id: dataset.couponId
      },
      success: function (res) {
        wx.showToast({
          title: '领取成功!',
          icon: 'none',
          duration: 3000,
          mask: true
        });
        self.data.couponList.splice(dataset.idx, 1);
      }
    })
  }
})