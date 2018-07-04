// pages/productDetail/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {
      // img: '',
      // name: '咪之猫-夏威夷果200gx3袋',
      // desc: '坚果零食组合大礼包',
      // price: 98,
      // isExpressFree: true,
      // salesCount: 6888,
      // coupons: [],
      // services: ['订单险', '7天无理由退货'],
      // commentCount: 128345,
      // commentTags: [
      //   { id: '001', tagName: '物流速度快', tagCount: 999},
      //   { id: '001', tagName: '质量好', tagCount: 689 },
      //   { id: '001', tagName: '味道不错', tagCount: 1200 }
      // ]
    },
    commentList: [
      { id: '001', img: '', commentator: '响叮当', content: '好吃非常划算，店家很有耐心', time: '2018-05-14 10:44:08' },
      { id: '002', img: '', commentator: '花似梦', content: '味道非常棒，服务很贴心，真的很有顾客是上帝的感觉', time: '2018-05-15 18:22:08' }
    ],
    services: [],
    isCommentLastPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var params = util.getCurrentPageInfo().params,
        pId = params.id;

    if (!pId) {
      return;
    }
    this.setData({'pId': pId, curPage: 1});
    this.getProductDetail(pId);
    this.getServices();
    this.getProductCommentList(pId, this.data.curPage);
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
    !this.data.isCommentLastPage && this.getProductCommentList(this.data.pId, this.data.curPage);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getProductDetail: function (pId) {
    var self = this,
        p;

    wx.request({
      url: interfacePrefix + '/pnt/getProductById',
      method: 'POST',
      data: {
        pnt_id: pId
      },
      success: function (res) {
        p = util.toLowerCaseForObjectProperty(res.data.product);
        p.product_num = 1;
        self.setData({ product:  p });
      }
    });
  },
  getProductCommentList: function(pId, curPage) {
    var self = this,
        list = this.data.commentList;

    wx.request({
      url: interfacePrefix + '/pntcmt/getPntCmtList',
      method: 'POST',
      data: {
        pnt_id: pId,
        page_size: 20,
        page_number: curPage
      },
      success: function (res) {
        if(!res.data.lastPage) {
          list = list.concat(res.data.list);
          self.setData({ commentList: list });
        }else {
          self.setData({ isCommentLastPage: true });
        }
      }
    });
  },
  buyProduct: function () {
    wx.setStorageSync('ns-products', [this.data.product]);
    wx.navigateTo({
      url: '../orderConfirm/index'
    });
  },
  getServices: function () {
    var self = this;

    wx.request({
      url: interfacePrefix + '/sys/dict/getByParamKey',
      method: 'POST',
      data: {
        paramKey: 'service_desc'
      },
      success: function (res) {
        self.setData({services: res.data.split('@')});
      }
    });
  },
  putShoppingCart: function () {
    var self = this,
        product = self.data.product;

    wx.request({
      url: interfacePrefix + '/cart/add',
      method: 'POST',
      data: {
        product_id: product.id,
        product_name: product.product_name,
        image_url: product.image_url,
        product_num: product.product_num,
        sal_price: product.sal_price
      },
      success: function (res) {
        wx.showToast({
          title: '添加到购物车成功，在购车里等你哦~',
          icon: 'none',
          duration: 2000,
          mask: true
        });
      }
    });
  }
})