// pages/refund/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        productList: [],
        refundType: 0,
        remark: '',
        refundDescMap: {
            0: '退货原因说明',
            1: '备注'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var self = this,
            params = util.getCurrentPageInfo().params,
            orderId = params.orderId;

        if (!orderId) {
            return;
        }
        this.setData({
            orderId: orderId
        });
        this.getOrderDetail();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    getOrderDetail: function() {
        var self = this,
            data;

        wx.request({
            url: interfacePrefix + '/order/getOrderItems',
            method: 'POST',
            data: {
                order_id: self.data.orderId
            },
            success: function(res) {
                data = util.toLowerCaseForObjectProperty(res.data);
                data.items = data.items.map(function(item) {
                    return util.toLowerCaseForObjectProperty(item);
                });
                self.setData({
                    productList: data.items
                });
            }
        })
    },
    radioChange: function(evt) {
        this.setData({
            refundType: parseInt(evt.detail.value)
        });
    },
    updateRefundRemark: function(evt) {
        this.setData({
            remark: evt.detail.value
        });
    },
    chooseImgs: function() {
        var self = this,
            data;

        wx.chooseImage({
            count: 3,
            success: function(res) {
                self.setData({
                    imgs: []
                });
                res.tempFilePaths.forEach(function(item) {
                    self.uploadImage(item);
                });
            }
        });
    },
    uploadImage: function(filePath) {
        var self = this,
            data,
            arr;

        wx.uploadFile({
            url: interfacePrefix + '/file/upload',
            filePath: filePath,
            name: 'file',
            formData: {
                type: 'comment'
            },
            success: function(res) {
                data = JSON.parse(res.data);
                data = data.data.map(function(item) {
                    return item.url;
                });
                arr = self.data.imgs;
                arr = arr.concat(data);
                self.setData({
                    imgs: arr
                });
            }
        });
    },
    submitRefund: function() {
        var self = this,
            d = self.data;

        if (!d.orderId) {
            return;
        }

        wx.request({
            url: interfacePrefix + '/request/applyForRefund',
            method: 'POST',
            data: {
                order_id: d.orderId,
                return_reason: d.refundType,
                pic1: d.imgs[0] || '',
                pic2: d.imgs[1] || '',
                pic3: d.imgs[2] || '',
                remark: d.remark
            },
            success: function(res) {
                wx.showToast({
                    title: '退货申请提交成功!',
                    icon: 'none',
                    mask: true,
                    duration: 2000,
                    success: function() {
                        wx.switchTab({
                            url: '../orderCenter/index'
                        });
                    }
                });
            }
        });
    }
})