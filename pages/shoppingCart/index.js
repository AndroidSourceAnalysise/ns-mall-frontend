// pages/shoppingCart/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalMoney: 0,
    productList: [],
    pageNum: 1,
    pageSize: 20,
    isLastPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList(this.data.pageNum);
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
    console.log('====');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    !this.data.isLastPage && this.getProductList(this.data.pageNum + 1);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getProductList: function (pageNum) {
    var self = this,
        list;

    wx.request({
      url: interfacePrefix + '/cart/list',
      method: 'POST',
      data: {
        page_num: pageNum,
        page_size: self.data.pageSize
      },
      success: function (res) {
        list = self.data.productList;
        list = list.concat(res.data.list);
        self.setData({ productList: list, isLastPage: res.data.lastPage, pageNum: pageNum });
      }
    });
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
      key = 'productList[' + index + '].product_num';
      obj[key] = pro.product_num - 1;
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
    key = 'productList[' + index + '].product_num';
    obj[key] = pro.product_num + 1;
    this.setData(obj);
    this.updateTotalMoney();
  },
  updateTotalMoney: function () {
    var list = this.data.productList,
        total = 0;

    list.forEach(function (item) {
      total += (item.product_num * item.product_price);
    });
    
    this.setData({ totalMoney: total});
  },
  goSettlement: function () {
    wx.setStorageSync('ns-products', [this.data.productList]);
    wx.navigateTo({
      url: '../orderConfirm/index'
    });
  }
})