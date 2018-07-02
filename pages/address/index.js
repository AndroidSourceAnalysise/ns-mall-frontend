// pages/adress/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdd: false,
    address: {
      receiver: '',
      phone: '',
      region: [],
      detailAddress: '',
      isDefault: false
    },
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressList();
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getSelectedAddress: function (evt) {
    var val = evt.detail.value;

    this.setData({'address.region': val});
  },
  getAddressList: function () {
    var self = this,
        list;

    wx.request({
      url: interfacePrefix + '/address/getAddressList',
      method: 'POST',
      success: function (res) {
        list = res.data.map(function(item) {
          return {
            id: item.ID,
            receiver: item.RECIPIENTS,
            phone: item.MOBILE,
            region: [item.PROVINCE, item.CITY, item.DISTRICT],
            detailAddress: item.ADDRESS,
            isDefault: item.IS_DEFAULT == 1
          };
        });
        self.setData({
          addressList: list
        });
      }
    })
  },
  addNewAddress: function () {
    this.setData({
      address: {
        receiver: '',
        phone: '',
        region: [],
        detailAddress: '',
        isDefault: false
      },
      isAdd: true
    });
  },
  editAddress: function (evt) {
    var target = evt.currentTarget,
        idx = target.dataset.index;

    this.setData({
      address: this.data.addressList[idx],
      isAdd: true
    });
  },
  deleteAddress: function (evt) {
    var self = this,
        target = evt.currentTarget,
        idx = target.dataset.index,
        list = this.data.addressList,
        addId;

    addId = list[idx].id;
    wx.request({
      url: interfacePrefix + '/address/deleteAddress',
      method: 'POST',
      data: {
        id: addId
      },
      success: function (res) {
        wx.showToast({
          title: '删除成功!',
          icon: 'none',
          duration: 2000,
          mask: true,
          success: function () {
            list.splice(idx, 1);
            self.setData({
              addressList: list
            });
          }
        });
      }
    });
  },
  saveAddress: function (evt) {
    var self = this,
        add = evt.detail.value,
        url,
        param;

    param = {
      MOBILE: add.phone,
      IS_DEFAULT: add.isDefault ? 1 : 0,
      RECIPIENTS: add.receiver,
      COUNTRY: '中国',
      PROVINCE: add.region[0],
      CITY: add.region[1],
      DISTRICT: add.region[2],
      ADDRESS: add.detailAddress
    };
    if(self.data.address.id) {
      url = '/address/updateAddress';
      param.ID = self.data.address.id;
    }else {
      url = '/address/createAddress';
    }
    wx.request({
      url: interfacePrefix + url,
      method: 'POST',
      data: param,
      success: function (res) {
        wx.showToast({
          title: '操作成功!',
          icon: 'none',
          duration: 2000,
          mask: true,
          success: function () {
            self.getAddressList();
            self.setData({
              isAdd: false
            });
          }
        });
      }
    });
  }
})