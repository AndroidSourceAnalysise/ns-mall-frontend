// pages/orderCenter/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [
      {orderId: '01', status: 1, statusStr: '已发货', products: [
        {pid: '01', productName: '夏威夷果奶油味，入口爽滑奶香四溢200g', productPrice: 50, productNum: 3}
      ], num: 3, money: 150, transportMoney: 6},
      { orderId: '02', status: 2, statusStr: '已完成', products: [
        { pid: '01', productName: '夏威夷果奶油味，入口爽滑奶香四溢150g', productPrice: 45, productNum: 2},
        { pid: '02', productName: '夏威夷果原味，入口爽滑奶香四溢150g', productPrice: 55, productNum: 4 }
      ], num: 6, money: 310, transportMoney: 0 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  queryLogistical: function (orderId) {
    wx.navigateTo({url: '../orderLogistical/index'});
  }
})