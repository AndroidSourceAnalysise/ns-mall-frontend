// pages/orderConfirm/index.js
var app = getApp(),
    util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    distributionInfo: "",
    order: {
      productsAmount: 0,
      productList: [],
      distributionMoney: 0,
      money: 0,
      availableCoupon: {},
      realPayment: 0
    },
    useableCouponList: [],
    //总可用积分
    integral: 0,
    //抵扣积分
    useIntegral: 0,
    //积分抵扣金额
    deductMoney: 0,
    //1积分抵扣多少钱
    deuctRule: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReceiverAddress();
    this.getProductList();
    this.getUseableCouponList();
    this.getUseableIntegral();
    this.getDeuctRuleIntegral();
    this.getFreight();
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
  getProductList: function () {
    var list = wx.getStorageSync('ns-products'),
        counter = 0,
        productNum,
        totalMoney = 0;

    list.forEach(function(item, idx) {
      productNum = item.num || 1;
      counter += productNum;
      totalMoney += parseFloat((productNum * item.sal_price).toFixed(2));
      list[idx].num = productNum;
      list[idx].amount = (productNum * item.sal_price).toFixed(2);
    });
    if(list) {
      this.setData({ 'order.productList': list, 'order.productsAmount': counter, 'order.money': totalMoney });
    }
  },
  getReceiverAddress: function () {
    //获取默认收货地址
    var self = this,
        info;

    wx.request({
      url: interfacePrefix + '/address/getDefault',
      success: function (res) {
        info = util.toLowerCaseForObjectProperty(res.data);
        info.addressDetail = info.province + info.city + info.district + info.address;
        self.setData({ distributionInfo: info});
      }
    });
  },
  getFreight: function () {
    //获取运费
    var self = this;

    wx.request({
      url: '/order/getFreight',
      method: 'POST',
      data: {
        province: self.data.distributionInfo.province,
        num: self.data.productsAmount
      },
      success: function (res) {
        self.setData({ 'order.distributionMoney': res.data });
      }
    });
  },
  showAddressPop: function () {
    this.setData({showAddressPop: true});
  },
  getUseableCouponList: function () {
    var self = this,
        list,
        typeMap = {
          1: '满额优惠券',
          0: '立减券'
        },
        maxCoupon;

    wx.request({
      url: interfacePrefix + '/coupon/getTldCouponList',
      method: 'POST',
      data: {
        status: 0
      },
      success: function (res) {
        list = res.data.map(function (item) {
          item = util.toLowerCaseForObjectProperty(item);
          item.type_str = typeMap[item.coupon_type];
          item.desc = item.coupon_type == 1 ? '满' + item.safety_amount + '元减' + item.discount_amount + '元' : '立减' + item.discount_amount + '元';
          return item;
        });
        self.setData({ useableCouponList: list });
        maxCoupon = self.getMaxDiscountCoupon();
        self.setData({ 'order.couponId': maxCoupon.id || '', 'order.availableCoupon': maxCoupon });
      }
    });
  },
  getMaxDiscountCoupon: function () {
    var self = this,
        list = self.data.useableCouponList,
        money = 0,
        index,
        orderMoney = self.data.order.money;

    list.forEach(function(item, idx) {
      if (item.coupon_type == 1) {
        if (item.safety_amount <= orderMoney && money < item.discount_amount) {
          money = item.discount_amount;
          index = idx;
        }
      }else {
        //直减券
        if (orderMoney >= item.discount_amount && money < item.discount_amount) {
          money = item.discount_amount;
          index = idx;
        }
      }
    });

    return typeof index !== 'undefined' ? list[index] : {};
  },
  getUseableIntegral: function () {
    var self = this;

    wx.request({
      url: interfacePrefix + '/ext/getMyPoints',
      method: 'POST',
      success: function (res) {
        self.setData({ integral: res.data.points_enabled });
      }
    });
  },
  getDeuctRuleIntegral: function () {
    var self = this;

    wx.request({
      url: interfacePrefix + '/ext/pointsDeduction',
      method: 'POST',
      data: {
        point: 1
      },
      success: function (res) {
        self.setData({ deuctRule: res.data });
      }
    });
  },
  getDeuctMoney: function (evt) {
    var val = evt.detail.value;

    this.setData({ useIntegral: val, deductMoney: val * this.data.deuctRule });
  },
  reduceNum: function (evt) {
    var target = evt.target,
        index = target.dataset.index,
        num,
        price,
        key,
        obj = {};

    num = this.data.order.productList[index].num;
    price = this.data.order.productList[index].sal_price;
    if (num > 1) {
      key = 'order.productList[' + index + '].num';
      obj[key] = num - 1;
      key = 'order.productList[' + index + '].amount';
      obj[key] = ((num - 1) * price).toFixed(2);
      obj['order.money'] = this.data.order.money - price;
      obj['order.productsAmount'] = this.data.order.productsAmount - 1;
      this.setData(obj);
      this.setData({ 'order.availableCoupon': this.getMaxDiscountCoupon() });
      this.getFreight();
    }
  },
  addNum: function (evt) {
    var target = evt.target,
        index = target.dataset.index,
        num,
        price,
        key,
        obj = {};

    num = this.data.order.productList[index].num;
    price = this.data.order.productList[index].sal_price;
    key = 'order.productList[' + index + '].num';
    obj[key] = num + 1;
    key = 'order.productList[' + index + '].amount';
    obj[key] = ((num + 1) * price).toFixed(2);
    obj['order.money'] = this.data.order.money + price;
    obj['order.productsAmount'] = this.data.order.productsAmount + 1;
    this.setData(obj);
    this.setData({ 'order.availableCoupon': this.getMaxDiscountCoupon() });
    this.getFreight();
  },
  toFixed: function (num, precis) {
    return num.toFixed(precis || 2);
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