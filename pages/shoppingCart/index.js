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
    isSelectAll: false,
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
    var self = this,
        target = evt.target,
        index = target.dataset.index,
        pro,
        key,
        obj = {};

    index = parseInt(index, 10);
    if (!(pro = this.data.productList[index])) {
      return;
    }
    if (pro.product_num > 1) {
      key = 'productList[' + index + '].product_num';
      obj[key] = pro.product_num - 1;
      this.setData(obj);
      this.updateTotalMoney();
    }else {
      wx.showModal({
        title: '提示',
        content: '确认从购物车中删除宝贝吗？',
        success: function (res) {
          if(res.confirm) {
            self.deleteProduct(pro.cart_id).then(function () {
              self.data.productList.splice(index, 1);
              self.setData({ productList: self.data.productList });
              self.updateTotalMoney();
            });
          }
        }
      });
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
      total += (item.product_num * item.sal_price);
    });
    
    this.setData({ totalMoney: total});
  },
  deleteProduct: function (cartId) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: interfacePrefix + '/cart/delete',
        method: 'POST',
        data: {
          cart_id: cartId
        },
        success: function (res) {
          resolve();
        }
      });
    });
  },
  checkboxChange: function (evt) {
    var target = evt.target,
        dataset = target.dataset,
        index = dataset.index,
        list = this.data.productList,
        isSelect = !!evt.detail.value.length,
        flag = true;

    list[index].checked = isSelect;
    if(isSelect) {
      list.some(function(item) {
        flag = item.checked;

        return !flag;
      });
    }else {
      flag = false;
    }
    this.setData({ productList: list, isSelectAll: flag });
  },
  sellAllChange: function (evt) {
    var list = this.data.productList,
        isSelect;

    isSelect = !!evt.detail.value.length;
    list = list.map(function (item) {
      item.checked = isSelect;
      return item;
    });

    this.setData({ productList: list});
  },
  updateShoppingCart: function () {
    
  },
  goSettlement: function () {
    var list = [];

    this.data.productList.forEach(function (item) {
      item.checked && list.push(item); 
    });
    if(!list.length) {
      wx.showToast({
        title: '你还没选择宝贝哦~',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return;
    }
    wx.setStorageSync('ns-products', list);
    wx.navigateTo({
      url: '../orderConfirm/index'
    });
  }
})