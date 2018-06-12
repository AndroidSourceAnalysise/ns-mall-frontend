// pages/orderConfirm/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distributionInfo: {
      name: '殷紫萍',
      phone: '15837692389',
      address: '广东省  深圳市福田区  福民新村小区  24栋502C'
    },
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