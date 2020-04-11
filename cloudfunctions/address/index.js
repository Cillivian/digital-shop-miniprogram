// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'getAddress': {
      return getAddress(event)
    }
    case 'addAddress': {
      return addAddress(event)
    }
    case 'delAddress': {
      return delAddress(event)
    }
    default: {
      return
    }
  }
}
async function getAddress(event) {
  var resp = { code: 0, msg: '', data: [] };
  const userInfo = event.userInfo;
  const openid = userInfo.openId;
  var dbret = await db.collection('address').where(
  {
    _openid: openid,
    deleteTime: ''
  }).orderBy('createTime', 'desc').get();
  var list = dbret.data;
  resp.code = 1;
  resp.data = list;
  return resp;
}