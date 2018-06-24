var originRequest = wx.request,
    skName = 'ns-sk';


function _request(params) {
  var originSuccess,
      sk;

  if (!params || params.constructor === 'Object') {
    return;
  }
  originSuccess = params.success;
  sk = wx.getStorageSync(skName);
  if (sk) {
    params.header ? (params.header.sk = sk) : (params.header = {sk: sk});
  }
  params.success = function (res) {
    var data = res.data;

    if (data.result < 0) {
      if (data.error === 200) {
        //登陆失效
        wx.login({
          success: function (res) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            _request({
              url: 'https://m.nashengbuy.com/ns-api/api/applet/login',
              method: 'POST',
              data: {
                code: res.code
              },
              success: function (d) {
                wx.setStorageSync('ns-sk', d.data.sk);
              }
            });
          }
        });
      } else {
        wx.showToast({
          title: data.errorData || '小猫出现了点小问题，请稍后重试，如果重试多次还是失败请联系客服哦~',
          icon: 'none',
          duration: 2000,
          mask: true
        });
      }
    } else {
      originSuccess(data);
    }
  };
  originRequest(params);
};
(function() {
  Object.defineProperties(wx, {
    'request': {
      get: function() {
        return _request;
      }
    }
  });
})();
