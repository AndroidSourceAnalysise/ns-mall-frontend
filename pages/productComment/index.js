// pages/productComment/index.js
var util = require('../../utils/util.js'),
    interfacePrefix = util.interfacePrefix;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pId: '',
        itemId: '',
        product: {},
        userInfo: {},
        commentList: [],
        pageNum: 1,
        pageSize: 30,
        isLastPage: false,
        commentImages: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var self = this,
            params = util.getCurrentPageInfo().params,
            pId = params.id,
            itemId = params.itemId;

        if (!pId) {
            return;
        }
        this.setData({
            pId: pId,
            itemId: itemId || ''
        });
        this.getCommentListByProduct();
        this.getProductDetail(pId);
        util.getPersonInfo().then(function(d) {
            self.setData({
                userInfo: d
            });
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
        !this.data.isLastPage && this.getCommentListByProduct();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.setData({
            commentList: [],
            pageNum: 1
        });
        this.getCommentListByProduct();
        wx.stopPullDownRefresh();
    },

    getProductDetail: function(pId) {
        var self = this,
            p,
            obj;

        wx.request({
            url: interfacePrefix + '/pnt/getProductById',
            method: 'POST',
            data: {
                pnt_id: pId
            },
            success: function(res) {
                p = util.toLowerCaseForObjectProperty(res.data.product);
                self.setData({
                    product: p
                });
            }
        });
    },
    getCommentListByProduct: function() {
        var self = this,
            list = this.data.commentList,
            d = self.data,
            data;

        wx.request({
            url: interfacePrefix + '/pntcmt/getPntCmtList',
            method: 'POST',
            data: {
                pnt_id: d.pId,
                page_size: d.pageSize,
                page_num: d.pageNum
            },
            success: function(res) {
                data = res.data.list;
                data = data.map(function (item) {
                    item = util.toLowerCaseForObjectProperty(item);
                    item.imgs = [];
                    item.photo_url1 && item.imgs.push(item.photo_url1);
                    item.photo_url2 && item.imgs.push(item.photo_url2);
                    item.photo_url3 && item.imgs.push(item.photo_url3);

                    return item;
                });
                list = list.concat(data);
                self.setData({
                    commentList: list,
                    isLastPage: res.data.lastPage,
                    pageNum: d.pageNum + 1
                });
            }
        });
    },
    previewImgs: function (evt) {
        var target = evt.currentTarget,
            idx = target.dataset.idx,
            imgs = this.data.commentList[idx].imgs;

        wx.previewImage({
            urls: imgs
        });
    },
    addCommentImg: function() {
        var self = this,
            data;

        wx.chooseImage({
            count: 3,
            success: function(res) {
                console.log(res.tempFilePaths);
                self.setData({
                    commentImages: []
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
                arr = self.data.commentImages;
                arr = arr.concat(data);
                self.setData({
                    commentImages: arr
                });
            }
        });
    },
    getCommentContent: function(evt) {
        this.setData({
            commentContent: evt.detail.value
        });
    },
    submitComment: function() {
        var self = this,
            d = self.data,
            params;

        params = {
            SOURCE_ID: d.product.id,
            //   CON_NO: d.userInfo.con_no,
            //   CON_NAME: d.userInfo.con_name,
            //   PIC: d.userInfo.pic,
            PARENT_ID: '0',
            PHOTO_URL1: d.commentImages[0] || '',
            PHOTO_URL2: d.commentImages[1] || '',
            PHOTO_URL3: d.commentImages[2] || '',
            CONTENT: d.commentContent,
            TO_CON_NO: '',
            TO_CON_NAME: '',
            PNT_NAME: d.product.product_name,
            ITEM_ID: d.itemId
        };
        console.log(params);
        wx.request({
            url: interfacePrefix + '/pntcmt/inertCMT',
            method: 'POST',
            data: params,
            success: function(res) {
                self.getCommentListByProduct();
            }
        });
    }
})