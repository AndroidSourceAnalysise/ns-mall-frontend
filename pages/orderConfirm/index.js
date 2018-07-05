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
      remark: '',
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
    deuctRule: 0,
    canBindRecommender: false,
    recommenderType: 'manual',
    recommenderNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    this.getReceiverAddress().then(function () {
      self.getFreight();
    });
    this.getProductList();
    this.getUseableCouponList();
    this.checkHasRecommender();
    Promise.all([this.getUseableIntegral(), this.getDeuctRuleIntegral()]).then(function (vals) {
      self.getDeuctMoney({ detail: { value: self.data.integral }});
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
  getProductList: function () {
    var list = wx.getStorageSync('ns-products'),
        counter = 0,
        productNum,
        totalMoney = 0;

    list.forEach(function(item, idx) {
      productNum = item.product_num || 1;
      counter += productNum;
      totalMoney += parseFloat((productNum * item.sal_price).toFixed(2));
      list[idx].product_num = productNum;
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

    return new Promise(function(resolve, reject) {
      wx.request({
        url: interfacePrefix + '/address/getDefault',
        success: function (res) {
          info = util.toLowerCaseForObjectProperty(res.data);
          info.addressDetail = info.province + info.city + info.district + info.address;
          self.setData({ distributionInfo: info});
          resolve();
        }
      });
    });
  },
  getFreight: function () {
    //获取运费
    var self = this;

    wx.request({
      url: interfacePrefix + '/order/getFreight',
      method: 'POST',
      data: {
        province: self.data.distributionInfo.province,
        num: self.data.order.productsAmount
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
    var self = this,
        o;

    return new Promise(function(resolve, reject) {
      wx.request({
        url: interfacePrefix + '/ext/getMyPoints',
        method: 'POST',
        success: function (res) {
          o = util.toLowerCaseForObjectProperty(res.data['points_enabled'.toUpperCase()]);
          self.setData({ integral: o.points_enabled });
          resolve();
        }
      });
    });
  },
  getDeuctRuleIntegral: function () {
    var self = this;

    return new Promise(function(resolve, reject) {
      wx.request({
        url: interfacePrefix + '/ext/pointsDeduction',
        method: 'POST',
        data: {
          point: 1
        },
        success: function (res) {
          self.setData({ deuctRule: res.data });
          resolve();
        }
      });
    });
  },
  getDeuctMoney: function (evt) {
    var val = evt.detail.value;

    this.setData({ useIntegral: val, deductMoney: val * this.data.deuctRule });
  },
  checkHasRecommender: function () {
    //检测是否已经有绑定推荐人了
    var self = this;

    wx.request({
      url: interfacePrefix + '/customer/checkReferee',
      method: 'POST',
      success: function (res) {
        self.setData({ canBindRecommender: res.data });
      }
    });
  },
  reduceNum: function (evt) {
    var target = evt.target,
        index = target.dataset.index,
        num,
        price,
        key,
        obj = {};

    num = this.data.order.productList[index].product_num;
    price = this.data.order.productList[index].sal_price;
    if (num > 1) {
      key = 'order.productList[' + index + '].product_num';
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

    num = this.data.order.productList[index].product_num;
    price = this.data.order.productList[index].sal_price;
    key = 'order.productList[' + index + '].product_num';
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
        list = self.data.order.productList;

    if(!list.length) {
      return;
    }
    if (!self.validRecommender()) {
      wx.showToast({
        title: '请填写推荐人会员号',
        icon: 'none',
        mask: true,
        duration: 3000
      });
      return;
    }
    if (!self.data.canBindRecommender) {
      self.submitOrder();
      return;
    }
    self.saveRecommender().then(function () {
      self.submitOrder();
    });
  },
  submitOrder: function () {
    var self = this,
      params = {},
      list = self.data.order.productList,
      items = '',
      orderData;

    list.forEach(function (item) {
      items += item.id + '&null&' + item.product_num + '|';
    });
    items = items.substr(0, items.length - 1);
    Object.assign(params, self.data.distributionInfo, {
      payment_typeid: '0',
      payment_type: '微信支付',
      order_source: '1',
      order_type: '1',
      items: items,
      point: parseInt(self.data.useIntegral, 10),
      remark: self.data.order.remark,
      coupon_grant_id: self.data.order.availableCoupon.coupon_id || ''
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
  },
  radioChange: function (evt) {
    this.setData({ recommenderType: evt.detail.value });
  },
  setRecommender: function (evt) {
    this.setData({ recommenderNo: evt.detail.value });
  },
  getCustomerMessage: function (evt) {
    this.setData({ 'order.remark': evt.detail.value });
  },
  validRecommender: function () {
    var d = this.data,
        flag = true;

    if (d.canBindRecommender) {
      if (d.recommenderType === 'manual') {
        if (!d.recommenderNo.trim()) {
          flag = false;
        }
      }
    }

    return flag;
  },
  saveRecommender: function (recommenderNo) {
    return new Promise(function(resolve, reject) {
      var self = this,
        url = '',
        conf = {};

      if (!recommenderNo) {
        url = '/customer/autoReferee';
      }else {
        url = '/customer/updateReferee';
        conf.data = {
          referee_no: recommenderNo
        };
      }
      Object.assign(conf, {
        url: interfacePrefix + url,
        method: 'POST',
        success: function (res) {
          resolve();
        }
      });
      wx.request(conf);
    });
  }
})