// pages/productDetail/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        product: {

        },
        commentList: [],
        services: [],
        photos: {},
        pageSize: 5
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var self = this,
            params = util.getCurrentPageInfo().params,
            pId = params.id;

        if (!pId) {
            return;
        }
        this.setData({
            'pId': pId
        });
        this.getProductDetail(pId);
        this.getServices();
        this.getProductCommentList(pId);
        util.getPersonInfo().then(function(d) {
            self.setData({
                userInfo: d
            });
        });
        //用于打开别人分享的页面时自动绑定推荐人
        util.setRecommenderAuto();
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: '美味夏威夷果吃不停，女性用户享受永久随机优惠哦，还有各种其他优惠等着你来领!',
            path: '/pages/productDetail/index?refereeNo=' + this.data.userInfo.con_no
        };
    },
    getProductDetail: function(pId) {
        var self = this,
            p,
            obj,
            photos = {};

        wx.request({
            url: interfacePrefix + '/pnt/getProductById',
            method: 'POST',
            data: {
                pnt_id: pId
            },
            success: function(res) {
                obj = res.data.photosList;
                photos.top = obj.top.map(function(item) {
                    return util.toLowerCaseForObjectProperty(item);
                });
                photos.detail = obj.detail.map(function(item) {
                    return util.toLowerCaseForObjectProperty(item);
                });
                photos.params = obj.params.map(function(item) {
                    return util.toLowerCaseForObjectProperty(item);
                });
                p = util.toLowerCaseForObjectProperty(res.data.product);
                p.product_num = 1;
                self.setData({
                    product: p,
                    photos: photos
                });
            }
        });
    },
    getProductCommentList: function(pId) {
        var self = this,
            list = this.data.commentList;

        wx.request({
            url: interfacePrefix + '/pntcmt/getPntCmtList',
            method: 'POST',
            data: {
                pnt_id: pId,
                page_size: self.data.pageSize,
                page_num: 1
            },
            success: function(res) {
                list = list.concat(res.data.list);
                list = list.map(function(item) {
                    item = util.toLowerCaseForObjectProperty(item);
                    item.imgs = [];
                    item.photo_url1 && item.imgs.push(item.photo_url1);
                    item.photo_url2 && item.imgs.push(item.photo_url2);
                    item.photo_url3 && item.imgs.push(item.photo_url3);

                    return item;
                });
                self.setData({
                    'product.commentCount': res.data.totalRow,
                    commentList: list
                });
            }
        });
    },
    reduceNum: function(evt) {
        var pro,
            key,
            obj = {};

        if (!(pro = this.data.product)) {
            return;
        }
        if (pro.product_num > 1) {
            key = 'product.product_num';
            obj[key] = pro.product_num - 1;
            this.setData(obj);
        }
    },
    addNum: function(evt) {
        var pro,
            key,
            obj = {};

        if (!(pro = this.data.product)) {
            return;
        }
        key = 'product.product_num';
        obj[key] = pro.product_num + 1;
        this.setData(obj);
    },
    buyProduct: function() {
        wx.setStorageSync('ns-products', [this.data.product]);
        wx.navigateTo({
            url: '../orderConfirm/index'
        });
    },
    getServices: function() {
        var self = this;

        wx.request({
            url: interfacePrefix + '/sys/dict/getByParamKey',
            method: 'POST',
            data: {
                paramKey: 'service_desc'
            },
            success: function(res) {
                self.setData({
                    services: res.data.split('@')
                });
            }
        });
    },
    seeAllComments: function() {
        wx.navigateTo({
            url: '../productComment/index?id=' + this.data.pId,
        });
    },
    previewImgs: function(evt) {
        var target = evt.currentTarget,
            idx = target.dataset.idx,
            imgs = this.data.commentList[idx].imgs;

        wx.previewImage({
            urls: imgs
        });
    },
    putShoppingCart: function() {
        var self = this,
            product = self.data.product;

        wx.request({
            url: interfacePrefix + '/cart/add',
            method: 'POST',
            data: {
                product_id: product.id,
                product_name: product.product_name,
                image_url: product.image_url,
                product_num: product.product_num,
                sal_price: product.sal_price,
                brief_description: product.brief_description
            },
            success: function(res) {
                wx.showToast({
                    title: '添加到购物车成功，在购车里等你哦~',
                    icon: 'none',
                    duration: 2000,
                    mask: true
                });
            }
        });
    }
})