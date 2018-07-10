// pages/myMember/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curFilterType: 0,
    memberList: [
      { nickName: '响叮当', memberId: '6788', memberImg: '', registerTiem: '2018-05-25 20:12:34', status: 1 },
      { nickName: '当时明月在', memberId: '6789', memberImg: '', registerTiem: '2018-05-04 16:12:45', status: 1 },
      { nickName: '花似梦', memberId: '6800', memberImg: '', registerTiem: '2018-01-15 20:12:34', status: 1 },
      { nickName: '赵晓芳', memberId: '6899', memberImg: '', registerTiem: '2018-10-25 20:44:34', status: 0 }
    ],
    pageNum: 1,
    pageSize: 20,
    isLastPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMemberList();
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
    this.getMemberList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getMemberList: function () {
    var self = this,
        data,
        list;

    wx.request({
      url: interfacePrefix + '/ext/myCustomer',
      method: 'POST',
      data: {
        type: self.data.curFilterType,
        page_num: self.data.pageNum,
        page_size: self.data.pageSize
      },
      success: function (res) {
        list = res.data.list.map(function(item) {
          return util.toLowerCaseForObjectProperty(item);
        });
        self.setData({ memberList: list, isLastPage: res.data.lastPage, pageNum: pageNum + 1 });
      }
    })
  },
  filterMember: function(evt) {
    var target = evt.target,
        filterType = parseInt(target.dataset.filterType, 10),
        obj = {};

    if (filterType !== this.data.curFilterType) {
      obj.pageNum = 1;
    }
    obj.curFilterType = filterType;
    this.setData(obj);
    this.getMemberList();
  }
})