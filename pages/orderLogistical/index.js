// pages/orderLogistical/index.js
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
    var logistArr = this.data.logistMessageList.concat();

    logistArr.unshift({ time: '', message: this.data.order.receiveAddress});
    console.log(logistArr);
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
  
  }
})