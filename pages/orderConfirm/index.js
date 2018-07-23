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
    addressList: [],
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
    recommenderNo: '',
    isShowCouponPop: false
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

  getProductList: function () {
    var list = wx.getStorageSync('ns-products'),
        counter = 0,
        productNum,
        totalMoney = 0;

    list.forEach(function(item, idx) {
      productNum = item.product_num || 1;
      counter += productNum;
      totalMoney = util.accAdd(totalMoney, parseFloat((productNum * item.sal_price).toFixed(2)));
      list[idx].id = item.product_id || item.id;
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
          if(res.data) {
            info = util.toLowerCaseForObjectProperty(res.data);
            info.addressDetail = info.province + info.city + info.district + info.address;
            self.setData({ distributionInfo: info });
          }
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
        list;

    list = self.filterCanUseCouponList();

    return list.length > 0 ? list[0].disabled ? {} : list[0] : {};
  },
  filterCanUseCouponList: function () {
    //从已领取并有效的优惠券列表中筛选出满足减免条件的优惠券并将优惠金额进行倒序排列
    var self = this,
        list = self.data.useableCouponList,
        money = 0,
        index,
        orderMoney = self.data.order.money,
        use = [],
        disabled = [];

    list.forEach(function (item, idx) {
      if (item.coupon_type == 1) {
        //safety_amount为满多少钱
        if (item.safety_amount <= orderMoney) {
          use.push(item);
        }else {
          item.disabled = true;
          disabled.push(item);
        }
      } else {
        //直减券
        if (orderMoney >= item.discount_amount) {
          use.push(item);
        }else {
          item.disabled = true;
          disabled.push(item);
        }
      }
    });
    use.sort(function(a, b) {
      return a.discount_amount >= b.discount_amount ? -1 : 1;
    });
    use = use.concat(disabled);
    self.setData({ useableCouponList: use });

    return use;
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
    //计算抵扣积分金额
    var val = evt.detail.value,
        money,
        orderMoney = this.data.order.money,
        couponDiscountMoney = this.data.order.availableCoupon.discount_amount;

    if(!couponDiscountMoney) {
      money = orderMoney;
    }else {
      money = util.accSub(orderMoney, couponDiscountMoney);
    }
    val = val && parseInt(val, 10);
    if (val > money) {
      wx.showToast({
        title: '积分抵现金额超过订单优惠应付金额，请重新输入!',
        icon: 'none',
        mask: true,
        duration: 2000
      });
      this.setData({ useIntegral: 0 });
      return;
    }
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
      obj['order.money'] = util.accSub(this.data.order.money, price);
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
    obj['order.money'] = util.accAdd(this.data.order.money, price);
    obj['order.productsAmount'] = this.data.order.productsAmount + 1;
    this.setData(obj);
    this.setData({ 'order.availableCoupon': this.getMaxDiscountCoupon() });
    this.getFreight();
  },
  couponRadioChange: function (evt) {
    var index = evt.detail.value,
        list = this.data.useableCouponList;

    this.setData('order.availableCoupon', list[index]);
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
    if (!self.data.distributionInfo) {
      wx.showToast({
        title: '请添加收货地址',
        icon: 'none',
        mask: true,
        duration: 2000
      });
      return;
    }
    if (!self.validRecommender()) {
      wx.showToast({
        title: '请填写推荐人会员号',
        icon: 'none',
        mask: true,
        duration: 2000
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
        distributeInfo = self.data.distributionInfo,
        items = '',
        orderData;

    list.forEach(function (item) {
      items += item.id + '&null&' + item.product_num + '|';
    });
    items = items.substr(0, items.length - 1);
    Object.assign(params, {
      country: distributeInfo.country,
      province: distributeInfo.province,
      city: distributeInfo.city,
      district: distributeInfo.district,
      address: distributeInfo.address,
      postal_code: distributeInfo.postal_code,
      mobile: distributeInfo.mobile,
      recipients: distributeInfo.recipients,
      freight: self.data.order.distributionMoney
    }, {
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
            self.goPayResult(orderData.orderId);
          },
          fail: function (_res) {
            if(!/\s+cancel$/.test(_res.errMsg)) {
              //用户取消支付不跳转，只有支付失败才跳转
              self.goPayResult(orderData.orderId);
            }
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
  },
  selectCoupon: function () {
    this.filterCanUseCouponList();
    this.setData({ isShowCouponPop: true });
  },
  submitSelectedCoupon: function () {
    this.setData({ isShowCouponPop: false });
  },
  getAddressList: function () {
    var self = this,
        list;

    wx.request({
      url: interfacePrefix + '/address/getAddressList',
      method: 'POST',
      success: function (res) {
        list = res.data.map(function (item) {
          util.toLowerCaseForObjectProperty(item);
          item.addressDetail = item.province + item.city + item.district + item.address;

          return item;
        });
        self.setData({
          addressList: list
        });
      }
    })
  },
  goAddAddress: function () {
    wx.navigateTo({
      url: '../address/index'
    });
  },
  showAddressPop: function () {
    this.getAddressList();
    this.setData({ isShowAddressPop: true });
  },
  addressRadioChange: function (evt) {
    var index = evt.detail.value,
        list = this.data.addressList,
        rs;

    rs = list[index];
    rs.addressDetail = rs.province + rs.city + rs.district + rs.address;
    this.setData({'distributionInfo': rs});
  },
  submitSelectedAddress: function () {
    this.setData({ isShowAddressPop: false });
  }
})