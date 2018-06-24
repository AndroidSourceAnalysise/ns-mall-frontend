// pages/orderConfirm/index.js
var app = getApp(),
    util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    distributionInfo: {},
    order: {
      distributionMoney: 0,
      productsAmount: 8,
      money: 258,
      productList: [
        {
          id: '001', img: '', name: '咪之猫夏威夷果', desc: '奶油味200g', num: 6, price: 55
        }
      ],
      distributionMoney: 0,
      money: 330,
      availableCoupon: {
        id: '002',
        name: '可用优惠卷满199减35元',
        discountMoney: 35
      },
      realPayment: 295
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var params = util.getCurrentPageInfo().params,
        pId = params.id;

    this.getReceiverAddress();
    if (!pId) {
      return;
    }
    this.setData({ 'pId': pId });
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
  getReceiverAddress: function () {
    //获取默认收货地址
    var self = this;

    wx.request({
      url: interfacePrefix + '/address/getDefault',
      success: function (res) {
        self.setData({ distributionInfo: res.data});
      }
    });
  },
  showAddressPop: function () {
    this.setData({showAddressPop: true});
  },
  goPay: function () {
    var self = this,
        params = {},
        d = this.data,
        orderData;

    Object.assign(params, {
      country: '中国',
      province: '湖南省',
      city: '长沙市',
      district: '雨花区',
      address: '雷锋大道',
      mobile: '13874133322',
      recipients: '张三',
      postal_code: '412000',
      freight: '0'
    }, {
      payment_typeid: '0',
      payment_type: '微信支付',
      order_source: '1',
      order_type: '1',
      items: self.data.pId + '&null&1',
      coupon_grant_id: ''
    });
    for (var p in params) {
      if (params.hasOwnProperty(p)) {
        params[p.toUpperCase()] = params[p];
        delete params[p];
      }
    }
    wx.request({
      url: interfacePrefix + '/order/newOrder',
      method: 'POST',
      data: params,
      success: function (res) {
        orderData = res.data;
        //订单创建成功发起支付请求
        wx.requestPayment({
          appId: orderData.appId,
          timeStamp: orderData.timeStamp,
          nonceStr: orderData.nonceStr,
          package: orderData.package,
          signType: orderData.signType,
          paySign: orderData.paySign,
          success: function (_res) {
            //跳转到支付成功页
            console.log(_res);
            self.goPayResult(res.orderId);
          },
          fail: function (_res) {
            console.log(_res);
          },
          complete: function (_res) {
            console.log(_res);
          }
        });
      }
    });
  },
  goPayResult: function (orderId) {
    wx.navigateTo({
      url: '../payResult/index?orderId=' + orderId
    });
  }
})