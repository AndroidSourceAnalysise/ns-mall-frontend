//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js'), 
    interfacePrefix = util.interfacePrefix;

Page({
  data: {
    userInfo: {},
    swiperImgs: [],
    productList: [],
    //女性用户随机立减金额范围
    reduceRange: ''
  },
  onLoad: function () {
    var self = this;

    this.getReduceRandomRange();
    this.getSwiperImgsList();
    this.getProductList();
    util.getPersonInfo().then(function (d) {
      self.setData({ userInfo: d});
    });
    //用于打开别人分享的页面时自动绑定推荐人
    util.setRecommenderAuto();
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function () {
    return {
      title: '美味夏威夷果吃不停，女性用户享受永久随机优惠哦，还有各种其他优惠等着你来领!',
      path: '/pages/index/index?refereeNo=' + this.data.userInfo.con_no
    };
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
  getReduceRandomRange: function () {
    var self = this;

    wx.request({
      url: interfacePrefix + '/sys/dict/getByParamKey',
      method: 'POST',
      data: {
        paramKey: 'random_decrease'
      },
      success: function (res) {
        self.setData({ 'reduceRange': res.data + '元' });
      }
    });
  },
  goProductDetail: function (evt) {
    var id = evt.target.dataset.proId,
      url;

    if (!id) {
      return;
    }
    url = '../productDetail/index?id=' + id;
    wx.navigateTo({
      url: url
    });
  },
  goPage: function () {
    var url = evt.target.dataset.url;

    if (!url) {
      return;
    }
    wx.navigateTo({
      url: url
    });
  }
})
