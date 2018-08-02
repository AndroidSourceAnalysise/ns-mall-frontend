// pages/qrCode/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        recommendQRcodeUrl: '',
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var self = this;

        this.getQRCodeTemplates().then(function(d) {
            self.getQRCode(d);
        });
        util.getPersonInfo().then(function (d) {
            self.setData({ userInfo: d });
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
    onShareAppMessage: function() {
        return {
            title: '美味夏威夷果吃不停，女性用户享受永久随机优惠哦，还有各种其他优惠等着你来领!',
            path: '/pages/index/index?refereeNo=' + this.data.userInfo.con_no
        };
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    getQRCodeTemplates: function() {
        return new Promise(function(resolve, reject) {
            var list;

            wx.request({
                url: interfacePrefix + '/qrcode/getQrBgmList',
                method: 'POST',
                success: function(res) {
                    resolve(res.data[0].id);
                }
            })
        });
    },
    getQRCode: function(templateId) {
        var self = this;

        wx.request({
            url: interfacePrefix + '/qrcode/getQrcode',
            method: 'POST',
            data: {
                type: 1,
                bgmTemplateId: templateId
            },
            success: function(res) {
                self.setData({
                    recommendQRcodeUrl: res.data.codeImageUrl
                });
            }
        });
    }
})