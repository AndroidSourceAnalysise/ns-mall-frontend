//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js'), 
    interfacePrefix = app.globalData.interfacePrefix;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swiperImgs: [],
    productList: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getSwiperImgsList();
    this.getProductList();
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getSwiperImgsList: function () {
    var self = this,
        list;

    wx.request({
      url: interfacePrefix + '/photos/getPhotos',
      success: function (res) {
        list = res.data.data.top.map(function (item) {
          return util.toLowerCaseForObjectProperty(item);
        });
        self.setData({ 'swiperImgs': list});
      }
    });
  },
  getProductList: function () {
    var self = this,
        list;

    wx.request({
      url: interfacePrefix + '/pnt/getProductList',
      success: function (res) {
        list = res.data.data.map(function (item) {
          return util.toLowerCaseForObjectProperty(item);
        });
        self.setData({ 'productList': list});
      }
    });
  },
  goProductDetail: function (evt) {
    var id = evt.target.dataset.proId;

    if(!id) {
      return;
    }
    wx.navigateTo({
      url: '../productDetail/index?id=' + id
    });
  }
})
