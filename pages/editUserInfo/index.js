// pages/editUserInfo/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        originMobile: '',
        codeBtnText: '获取验证码'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var self = this;

        util.getPersonInfo().then(function(d) {
            self.setData({ userInfo: d, originMobile: d.mobile });
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    selectImg: function () {
        var self = this,
            data;

        wx.chooseImage({
            count: 1,
            success: function (res) {
                self.uploadImage(item);
            }
        });
    },
    uploadImage: function (filePath) {
        var self = this,
            data;

        wx.uploadFile({
            url: interfacePrefix + '/file/upload',
            filePath: filePath,
            name: 'file',
            formData: {
                type: 'avatar'
            },
            success: function (res) {
                data = JSON.parse(res.data);
                data = data.data.map(function (item) {
                    return item.url;
                });
                self.setData({ 'userInfo.pic': data[0] });
            }
        });
    },
    updateNickName: function (evt) {
        this.setData({ 'userInfo.con_name': evt.detail.value });
    },
    updateMobile: function (evt) {
        this.setData({ 'userInfo.mobile': evt.detail.value });
    },
    getPhoneCode: function (evt) {
        var self = this,
            mobile = self.data.userInfo.mobile;

        if (self.data.disabledCode) {
            return;
        }
        if (!self.validMobile(mobile)) {
            wx.showToast({
                title: '请输入正确的手机号!',
                icon: 'none',
                mask: true,
                duration: 2000
            });
            return;
        }
        wx.request({
            url: interfacePrefix + '/identifycode/getCode',
            method: 'POST',
            data: {
                mobile: mobile,
                type: 0
            },
            success: function () {
                wx.showToast({
                    title: '验证码发送成功，请查收。',
                    icon: 'none',
                    duration: 2000
                });
                self.countDown();
            }
        });
    },
    countDown: function () {
        var self = this,
            originText = self.data.codeBtnText,
            time = 59,
            timer;

        self.setData({ codeBtnText: (time--) + 's', disabledCode: true });
        timer = setInterval(function() {
            if(time < 0) {
                clearInterval(timer);
                self.setData({ codeBtnText: originText, disabledCode: false });
                return;
            }
            self.setData({ codeBtnText: (time--) + 's' });
        }, 1000);
    },
    validMobile: function (mobile) {
        return mobile && /^1[34578]\d{9}$/.test(mobile);
    },
    updateCode: function (evt) {
        this.setData({ 'code': evt.detail.value });
    },
    saveUserInfo: function () {
        var self = this,
            u = self.data.userInfo;

        return new Promise(function(resolve, reject) {
            wx.request({
                url: interfacePrefix + '/customer/updateBaseInfo',
                method: 'POST',
                data: {
                    avatar: u.pic,
                    nickname: u.con_name
                },
                success: function (res) {
                    resolve();
                }
            });
        });
    },
    savePhone: function () {
        var self = this,
            m = self.data.userInfo.mobile,
            code = self.data.code;

        return new Promise(function (resolve, reject) {
            wx.request({
                url: interfacePrefix + '/customer/update',
                method: 'POST',
                data: {
                    mobile: m,
                    code: code,
                    type: '0'
                },
                success: function (res) {
                    resolve();
                }
            });
        });
    },
    saveInfo: function() {
        var self = this,
            info = self.data.userInfo;

        if (!info.con_name) {
            wx.showToast({
                title: '请输入昵称!',
                icon: 'none',
                mask: true,
                duration: 2000
            });
            return;
        }
        if (self.data.originMobile === info.mobile) {
            self.saveUserInfo().then(function() {
                wx.showToast({
                    title: '修改昵称成功!',
                    icon: 'none',
                    mask: true,
                    duration: 2000
                });
            });
            return;
        }
        if (!self.validMobile(info.mobile)) {
            wx.showToast({
                title: '请输入正确的手机号!',
                icon: 'none',
                mask: true,
                duration: 2000
            });
            return;
        }
        if(!self.data.code) {
            wx.showToast({
                title: '请输入验证码!',
                icon: 'none',
                mask: true,
                duration: 2000
            });
            return;
        }
        self.savePhone().then(function() {
            return self.saveUserInfo();
        }).then(function () {
            wx.showToast({
                title: '修改信息成功!',
                icon: 'none',
                mask: true,
                duration: 2000
            });
        });
    },
    cancel: function () {
        wx.navigateBack();
    }
})