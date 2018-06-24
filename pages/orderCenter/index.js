// pages/orderCenter/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [
      // {orderId: '01', status: 1, statusStr: '已发货', products: [
      //   {pid: '01', productName: '夏威夷果奶油味，入口爽滑奶香四溢200g', productPrice: 50, productNum: 3}
      // ], num: 3, money: 150, transportMoney: 6},
      // { orderId: '02', status: 2, statusStr: '已完成', products: [
      //   { pid: '01', productName: '夏威夷果奶油味，入口爽滑奶香四溢150g', productPrice: 45, productNum: 2},
      //   { pid: '02', productName: '夏威夷果原味，入口爽滑奶香四溢150g', productPrice: 55, productNum: 4 }
      // ], num: 6, money: 310, transportMoney: 0 }
    ],
    pageSize: 20,
    pageNum: 1,
    isLastPage: false,
    orderStatus: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList(this.data.pageNum, this.data.orderStatus);
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
    console.log('=====');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var pageNum = this.data.pageNum;

    if (!this.data.isLastPage) {
      pageNum += 1;
      this.setData({ pageNum: pageNum});
      this.getOrderList(pageNum, this.data.orderStatus);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  filterOrder: function (evt) {
    var target = evt.target,
        status = target.dataset.filterType;

    if (this.data.orderStatus != status) {
      if(status) {
        status = parseInt(status, 10);
      }else {
        status = null;
      }
      this.getOrderList(1, status);
    }
  },
  getOrderList: function (pageNum, orderStatus) {
    var self = this,
        list = self.data.orderList;

    if (self.data.orderStatus != orderStatus) {
      pageNum = 1;
      this.setData({ pageNum: 1, orderStatus: orderStatus});
      list = [];
    }
    wx.request({
      url: interfacePrefix + '/order/getOrderList',
      method: 'POST',
      data: {
        page_number: pageNum,
        status: orderStatus,
        page_size: self.data.pageSize
      },
      success: function (res) {
        list = list.concat(res.data.list);
        list = list.map(function (item) {
          item = util.toLowerCaseForObjectProperty(item);
          item.items = item.items.map(function(t){
            return util.toLowerCaseForObjectProperty(t);
          });
          
          return item;
        });
        self.setData({ orderList: list, isLastPage: res.data.lastPage });
      }
    });
  },
  queryLogistical: function (orderId) {
    wx.navigateTo({url: '../orderLogistical/index'});
  }
})