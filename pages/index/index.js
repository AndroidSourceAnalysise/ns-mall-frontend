//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js'), 
    interfacePrefix = util.interfacePrefix;

Page({
  data: {
    swiperImgs: [],
    productList: []
  },
  onLoad: function () {
    this.getSwiperImgsList();
    this.getProductList();
  },
  getSwiperImgsList: function () {
    var self = this,
        list;

    wx.request({
      url: interfacePrefix + '/photos/getPhotos',
      success: function (res) {
        list = res.data.top.map(function (item) {
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
      method: 'POST',
      data: {
        page_number: 1,
        page_size: 20
      },
      success: function (res) {
        list = res.data.map(function (item) {
          return util.toLowerCaseForObjectProperty(item);
        });
        self.setData({ 'productList': list});
      }
    });
  },
  goProductDetail: function (evt) {
    var id = evt.target.dataset.proId,
        url;

    if(!id) {
      return;
    }
    url = '../productDetail/index?id=' + id;
    wx.navigateTo({
      url: url
    });
  }
})
