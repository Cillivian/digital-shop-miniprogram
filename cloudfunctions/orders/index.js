// 云函数入口文件
// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
function formatDate(dateStr, justDate) {
  var str = '';
  if (dateStr && dateStr.length > 7) {
    str += dateStr.slice(0, 4);
    str += '-';
    str += dateStr.slice(4, 6);
    str += '-';
    str += dateStr.slice(6, 8);
    if (!justDate && dateStr.length > 11) {
      str += ' ';
      str += dateStr.slice(8, 10);
      str += ':';
      str += dateStr.slice(10, 12);
    }
  }
  return str;
};

exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {

    case 'getOrder': {
      return getOrder(event)
    }
    case 'getAllRecord': {
      return getAllRecord(event)
    }
    case 'getRecordDetail': {
      return getRecordDetail(event)
    }
    case 'delRecord': {
      return delRecord(event)
    }
    default: {
      return
    }
  }
}
async function getOrder(event) {
  var resp = { code: 0, msg: '', data: [] };
  const userInfo = event.userInfo;
  const openid = userInfo.openId;
  var currentPage = event.currentPage || 0;
  var pageSize = 20;
  var dbret = await db.collection('orders').where({
    _openid: openid
  }).orderBy('createTime', 'desc').skip(currentPage * pageSize).limit(pageSize).get();
  //console.log(dbret);
  var list = dbret.data;
  if (list && list.length) {
    for (var i = 0; i < list.length; i++) {
      list[i].timeText = formatDate(list[i].createTime, false);
      //console.log(list[i].callTime,list[i].timeText)
    }
  }
  resp.code = 1;
  resp.data = list;
  return resp;
}