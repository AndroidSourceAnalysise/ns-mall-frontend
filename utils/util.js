const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function toLowerCaseForObjectProperty(obj) {
  var p;

  for(p in obj) {
    if(obj.hasOwnProperty(p)) {
      obj[p.toLowerCase()] = obj[p];
      delete obj[p];
    }
  }

  return obj;
}
/*获取当前页Info*/
function getCurrentPageInfo() {
  //获取加载的页面
  var pages = getCurrentPages(),
      //获取当前页面的对象
      currentPage = pages[pages.length - 1],
      //当前页面url
      url = currentPage.route,
      options = currentPage.options;

  return {
    url: url,
    params: options
  };
}

module.exports = {
  formatTime: formatTime,
  toLowerCaseForObjectProperty: toLowerCaseForObjectProperty,
  getCurrentPageInfo: getCurrentPageInfo,
  interfacePrefix: 'https://m.nashengbuy.com/ns-api/api'
}
