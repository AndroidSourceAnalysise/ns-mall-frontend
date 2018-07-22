// pages/productComment/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pId: '',
    commentList: [],
    pageNum: 1,
    pageSize: 30,
    isLastPage: false,
    commentImages: []
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
    this.setData({ 'pId': pId });
    this.getCommentListByProduct();
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
    !this.data.isLastPage && this.getCommentListByProduct();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({ commentList: [], pageNum: 1 });
    this.getCommentListByProduct();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getCommentListByProduct: function () {
    var self = this,
        list = this.data.commentList,
        d = self.data;

    wx.request({
      url: interfacePrefix + '/pntcmt/getPntCmtList',
      method: 'POST',
      data: {
        pnt_id: d.pId,
        page_size: d.pageSize,
        page_num: d.pageNum
      },
      success: function (res) {
        list = list.concat(res.data.list);
        self.setData({ commentList: list, isLastPage: res.data.lastPage,pageNum: d.pageNum + 1 });
      }
    });
  },
  addCommentImg: function () {
    var self = this;
    wx.chooseImage({
      success: function (res) {
        console.log(res.tempFilePaths);
        self.setData({ commentImages: res.tempFilePaths });
      }
    });
  },
  getCommentContent: function (evt) {
    self.setData({ commentContent: evt.detail.value });
  },
  submitComment: function () {
    var self = this;

    wx.request({
      url: interfacePrefix + '/pntcmt/inertCMT',
      method: 'POST',
      data: {
        paramKey: 'service_desc'
      },
      success: function (res) {
        self.getCommentListByProduct();
      }
    });
  }
})