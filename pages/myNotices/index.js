// pages/myNotices/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curFilterType: '1',
    noticeList: [],
    pageNum: 1,
    pageSize: 20,
    isLastPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNoticeList();
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
    this.setData({ pageNum: 1 });
    this.getNoticeList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    !this.data.isLastPage && this.getNoticeList();
  },
  getNoticeList: function () {
    var self = this,
        data,
        list,
        statusMap = {
          0: '待确认',
          1: '已完成',
          '-1': '已退货'
        };

    wx.request({
      url: interfacePrefix + '/sitemsg/getMsg',
      method: 'POST',
      data: {
        type: self.data.curFilterType,
        page_num: self.data.pageNum,
        page_size: self.data.pageSize
      },
      success: function (res) {
        list = res.data.list.map(function (item) {
          return util.toLowerCaseForObjectProperty(item);
        });;
        self.setData({ noticeList: list, isLastPage: res.data.lastPage, pageNum: self.data.pageNum + 1 });
      }
    })
  },
  filterOrder: function (evt) {
    var target = evt.target,
      filterType = target.dataset.filterType,
      obj = {};

    if (filterType !== this.data.curFilterType) {
      obj.pageNum = 1;
    }
    obj.curFilterType = filterType;
    this.setData(obj);
    this.getNoticeList();
  }
})