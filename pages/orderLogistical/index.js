// pages/orderLogistical/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        expressInfo: {},
        logistMessageList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var self = this,
            params = util.getCurrentPageInfo().params,
            orderId = params.orderId,
            logistArr;

        if (!orderId) {
            return;
        }
        this.getExpressInfo(orderId).then(function(expressNo) {
            self.getLogisticalInfo(expressNo);
        });

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
        this.onLoad();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    getExpressInfo: function(orderId) {
        var self = this;

        return new Promise(function(resolve, reject) {
            if (!orderId) {
                reject('订单号不能为空!');
            }
            wx.request({
                url: interfacePrefix + '/order/getOrderSplit',
                method: 'POST',
                data: {
                    order_id: orderId
                },
                success: function(res) {
                    var data = util.toLowerCaseForObjectProperty(res.data[0]);
                    self.setData({ expressInfo: data });  
                    resolve(data.waybill);
                }
            });
        });
    },
    getLogisticalInfo: function(expressNo) {
        var self = this;

        if (!expressNo) {
            return;
        }
        wx.request({
            url: interfacePrefix + '/order/getWaybill',
            method: 'POST',
            data: {
                billNo: expressNo
            },
            success: function(res) {
                console.log(res);
                self.setData({
                    logistMessageList: res.data
                });
            }
        })
    }
})