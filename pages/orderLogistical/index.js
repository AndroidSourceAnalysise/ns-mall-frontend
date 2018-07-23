// pages/orderLogistical/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {
      productName: '卡通版奶油味夏威夷果200g',
      num: 6,
      logisticalCompany: '圆通快递',
      logisticalNo: '95685368376945732',
      status: 1,
      statusStr: '派送中',
      receiveAddress: '深圳市福田区保利国际大厦3层206'
    },
    logistMessageList: [
      {
        time: '05-16 12:30',
        message: '福田区李子村店已收入，派件员：李二正在为您派件，联系电话：15336882863'
      },
      {
        time: '05-15 11:22',
        message: '四川省成都市已收入，已到深圳市福田区收纳站'
      },
      {
        time: '05-14 08:02',
        message: '成都装运中心公司已发出，下一站四川省成都市碧县'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this,
        params = util.getCurrentPageInfo().params,
        orderId = params.orderId,
        logistArr;

    if (!orderId) {
      return;
    }
    this.getExpressInfo(orderId).then(function (expressNo) {
      self.getLogisticalInfo(expressNo);
    });
    logistArr = this.data.logistMessageList.concat();
    logistArr.unshift({ time: '', message: this.data.order.receiveAddress});
    this.setData({
      logistMessageList: logistArr
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
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  getExpressInfo: function (orderId) {
    return new Promise(function (resolve, reject) {
      if (!orderId) {
        reject('订单号不能为空!');
      }
      wx.request({
        url: interfacePrefix + '/order/getOrderSplit',
        method: 'POST',
        data: {
          order_id: orderId
        },
        success: function (res) {
          resolve(util.toLowerCaseForObjectProperty(res.data[0]).waybill);
        }
      });
    });
  },
  getLogisticalInfo: function (expressNo) {
    var self = this;

    if(!expressNo) {
      return;
    }
    wx.request({
      url: interfacePrefix + '/order/getWaybill',
      method: 'POST',
      data: {
        billNo: expressNo
      },
      success: function (res) {
        console.log(res);
        return;
        self.setData({
          logistMessageList: res.data
        });
      }
    })
  }
})