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
    addressList: [],
    selfMobile: '',
    mobileCode: '',
    isBindMobile: false,
    errorInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressList();
    this.checkBindMobile();
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
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
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
            address: item.ADDRESS,
            isDefault: item.IS_DEFAULT == 1,
            detailAddress: item.PROVINCE + item.CITY + item.DISTRICT + item.ADDRESS
          };
        });
        self.setData({
          addressList: list
        });
      }
    })
  },
  checkBindMobile: function () {
    var self = this;

    wx.request({
      url: interfacePrefix + '/customer/checkMobileBind',
      method: 'POST',
      success: function (res) {
        self.setData({ isBindMobile: res.data });
      }
    });
  },
  getVerifyCode: function () {
    var self = this,
        txt;

    wx.request({
      url: interfacePrefix + '/identifycode/getCode',
      method: 'POST',
      data: {
        mobile: self.data.selfMobile,
        type: 0
      },
      success: function (res) {
        txt = res.data ? '成功' : '失败，请重试';
        wx.showToast({
          title: '验证码发送' + txt,
          icon: 'none',
          mask: true,
          duration: 2000
        });
      }
    });
  },
  bindSelfMobile: function () {
    var self = this,
        data = self.data,
        error = {},
        flag = true;

    return new Promise(function (resolve, reject) {
      if (!data.selfMobile || !/^1[34578]\d{9}$/.test(data.selfMobile)) {
        error.selfMobile = '请输入正确的手机号';
        flag = false;
      }
      if (!data.mobileCode) {
        error.mobileCode = '请输入验证码';
        flag = false;
      }
      self.setData({ errorInfo: error });
      if (!flag) {
        reject();
        wx.showToast({
          title: '请填写正确的信息',
          icon: 'none',
          mask: true,
          duration: 2000
        });
      }else {
        wx.request({
          url: interfacePrefix + '/customer/bindMobile',
          method: 'POST',
          data: {
            mobile: self.data.selfMobile,
            code: self.data.mobileCode,
            type: 0
          },
          success: function (res) {
            resolve();
            self.setData({ isBindMobile: true });
          }
        });
      }
    });
  },
  updateMobile: function (evt) {
    this.setData({ selfMobile: evt.detail.value });
  },
  updateVerifyCode: function (evt) {
    this.setData({ mobileCode: evt.detail.value });
  },
  addNewAddress: function () {
    this.setData({
      address: {
        receiver: '',
        phone: '',
        region: [],
        address: '',
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
  save: function (evt) {
    var self = this;

    if (!this.data.isBindMobile) {
      this.bindSelfMobile().then(function() {
        self.saveAddress(evt);
      });
    }else {
      this.saveAddress(evt);
    }
  },
  saveAddress: function (evt) {
    var self = this,
        add = evt.detail.value,
        url,
        param;

    if (!self.validAddressData()) {
      wx.showToast({
        title: '请填写正确的信息',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      return;
    }
    param = {
      MOBILE: add.phone,
      IS_DEFAULT: add.isDefault ? 1 : 0,
      RECIPIENTS: add.receiver,
      COUNTRY: '中国',
      PROVINCE: add.region[0],
      CITY: add.region[1],
      DISTRICT: add.region[2],
      ADDRESS: add.address
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
  },
  cancel: function () {
    this.setData({ isAdd: false });
  },
  validAddressData: function (address) {
    var flag = true,
        obj = {};

    if(!address.receiver) {
      flag = false;
      obj.receiver = '请输入收货人';
    }
    if (!address.phone) {
      flag = false;
      obj.phone = '请输入收货人联系电话';
    }
    if (!address.region.length) {
      flag = false;
      obj.region = '请选择所在地区';
    }
    if (!address.address) {
      flag = false;
      obj.region = '请输入详细地址';
    }
    this.setData({ errorInfo: obj });

    return flag;
  }
})