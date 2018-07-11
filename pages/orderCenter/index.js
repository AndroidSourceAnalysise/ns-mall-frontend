// pages/orderCenter/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusMap: {
      1: '待付款',
      2: '已付款',
      3: '申请取消',
      4: '已取消',
      5: '已出货',
      6: '待收货',
      7: '已收货',
      10: '已退款',
      11: '已关闭'
    },
    orderOperateText: {
      1: '去支付',
      2: '取消订单',
      5: '查看物流',
      6: '查看物流',
      11: '删除订单'
    },
    orderOperateUrlMap: {
      1: '/weixin/pay/prePay',
      2: '/order/refund',
      11: '/order/deleteOrder'
    },
    orderList: [],
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
    this.getOrderList(1, null);
    wx.stopPullDownRefresh();
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
        list = self.data.orderList,
        count;

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
          count = 0;
          item = util.toLowerCaseForObjectProperty(item);
          item.items = item.items.map(function(t){
            util.toLowerCaseForObjectProperty(t);
            count += t.quantity;

            return t;
          });
          item.quantity = count;
          return item;
        });
        self.setData({ orderList: list, isLastPage: res.data.lastPage });
      }
    });
  },
  queryLogistical: function (orderId) {
    wx.navigateTo({url: '../orderLogistical/index?orderId=' + orderId});
  },
  operateOrder: function (evt) {
    var self = this,
        target = evt.currentTarget,
        idx = target.dataset.idx,
        status,
        id,
        url;

    status = self.data.orderList[idx].status;
    id = self.data.orderList[idx].order_no;
    url = self.data.orderOperateUrlMap[status];
    if(!url) {
      self.queryLogistical(id);
      return;
    }
    url = interfacePrefix + url;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        order_id: id
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功',
          icon: 'none',
          duration: 3000,
          mask: true,
          success: function () {
            self.getOrderList(1, '');
          }
        });
      }
    })
  },
  deleteOrder: function (orderId) {
    var self = this,
        target = evt.currentTarget,
        id = target.dataset.id,
        idx = target.dataset.idx,
        list = self.data.orderList;

    wx.request({
      url: interfacePrefix + '/order/deleteOrder',
      method: 'POST',
      data: {
        order_id: id
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功',
          icon: 'none',
          duration: 3000,
          mask: true,
          success: function () {
            list.splice(idx, 1);
            self.setData({orderList: list});
          }
        });
      }
    });
  }
})