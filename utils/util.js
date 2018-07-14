function toLowerCaseForObjectProperty(obj) {
  var p;

  for(p in obj) {
    if(obj.hasOwnProperty(p)) {
      obj[p.toLowerCase()] = obj[p];
      p.toLowerCase() !== p && delete obj[p];
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
/*
    鉴于js的浮点型数字计算会出现精度问题，加以下方法。
    accAdd函数：加法的精准计算。example: ulit.accAdd(arg1,arg2); arg1: 被加数 ， arg2: 加数
    accSub函数: 减法的精准计算。example：ulit.accSub(arg1,arg2); arg1: 被减数 ， arg2: 减数
    accMul函数：乘法的精准计算。example: ulit.accMul(arg1,arg2); arg1: 被乘数 ， arg2: 乘数
    accDiv函数: 除法的精准计算。example：ulit.accDiv(arg1,arg2); arg1: 被除数 ， arg2: 除数
 */
function accAdd(arg1, arg2) {
  var r1,
    r2,
    m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) { r1 = 0 }

  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) { r2 = 0 }

  m = Math.pow(10, Math.max(r1, r2))

  return accDiv((accMul(arg1, m) + accMul(arg2, m)), m);
}

function accSub(arg1, arg2) {
  var r1,
    r2,
    m,
    n;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) { r1 = 0 }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) { r2 = 0 }

  m = Math.pow(10, Math.max(r1, r2));

  n = (r1 >= r2) ? r1 : r2;

  return +((arg1 * m - arg2 * m) / m).toFixed(n);
}

function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();

  try {
    m += s1.split(".")[1].length
  } catch (e) { }

  try {
    m += s2.split(".")[1].length
  } catch (e) { }

  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

function accDiv(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) { }
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) { }

  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));

  return accMul((r1 / r2), Math.pow(10, t2 - t1));
}

module.exports = {
  toLowerCaseForObjectProperty: toLowerCaseForObjectProperty,
  getCurrentPageInfo: getCurrentPageInfo,
  interfacePrefix: 'https://m.nashengbuy.com/ns-api/api',
  accAdd: accAdd,
  accSub: accSub,
  accMul: accMul,
  accDiv: accDiv
}
