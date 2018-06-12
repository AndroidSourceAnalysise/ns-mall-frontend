// pages/productDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {
      img: '',
      name: '咪之猫-夏威夷果200gx3袋',
      desc: '坚果零食组合大礼包',
      price: 98,
      isExpressFree: true,
      salesCount: 6888,
      coupons: [],
      services: ['订单险', '7天无理由退货'],
      commentCount: 128345,
      commentTags: [
        { id: '001', tagName: '物流速度快', tagCount: 999},
        { id: '001', tagName: '质量好', tagCount: 689 },
        { id: '001', tagName: '味道不错', tagCount: 1200 }
      ]
    },
    commentList: [
      { id: '001', img: '', commentator: '响叮当', content: '好吃非常划算，店家很有耐心', time: '2018-05-14 10:44:08' },
      { id: '002', img: '', commentator: '花似梦', content: '味道非常棒，服务很贴心，真的很有顾客是上帝的感觉', time: '2018-05-15 18:22:08' }
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
  buyProduct: function () {
    wx.navigateTo({
      url: '../orderConfirm/index'
    });
  },
  putShoppingCart: function () {

  }
})