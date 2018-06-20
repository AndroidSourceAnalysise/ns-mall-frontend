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
function parseQueryString(str) {
  var regUrl = /^[^\?]+\?([\w\W]+)$/,
    regPara = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
    arrUrl = regUrl.exec(str),
    arrPara,
    strPara,
    rs = {};

  if (arrUrl && arrUrl[1]) {
    strPara = arrUrl[1];
    while ((arrPara = regPara.exec(strPara)) != null) {
      rs[arrPara[1]] = arrPara[2];
    }
  }
  return rs;
};
module.exports = {
  formatTime: formatTime,
  toLowerCaseForObjectProperty: toLowerCaseForObjectProperty,
  parseQueryString: parseQueryString
}
