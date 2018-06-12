// pages/shoppingCart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalMoney: 0,
    productList: [
      { id: '001', productImg: '', name: '咪之猫-夏威夷果', desc: '奶油味250g', num: 4, price: 55 },
      { id: '002', productImg: '', name: '咪之猫-夏威夷果', desc: '奶油味250g', num: 4, price: 55 },
      { id: '003', productImg: '', name: '咪之猫-夏威夷果', desc: '奶油味200g', num: 1, price: 45 }
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
    this.updateTotalMoney();
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
  reduceNum: function (evt) {
    var target = evt.target,
        index = target.dataset.index,
        pro,
        key,
        obj = {};

    index = parseInt(index, 10);
    if (!(pro = this.data.productList[index])) {
      return;
    }
    if (pro.num > 1) {
      key = 'productList[' + index + '].num';
      obj[key] = pro.num - 1;
      this.setData(obj);
      this.updateTotalMoney();
    }
  },
  addNum: function (evt) {
    var target = evt.target,
      index = target.dataset.index,
      pro,
      key,
      obj = {};

    index = parseInt(index, 10);
    if (!(pro = this.data.productList[index])) {
      return;
    }
    key = 'productList[' + index + '].num';
    obj[key] = pro.num + 1;
    this.setData(obj);
    this.updateTotalMoney();
  },
  updateTotalMoney: function () {
    var list = this.data.productList,
        total = 0;

    list.forEach(function (item) {
      total += (item.num * item.price);
    });
    
    this.setData({ totalMoney: total});
  }
})