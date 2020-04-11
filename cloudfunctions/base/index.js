// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'getBanner': {
      return getBanner(event)
    }
    case 'getLastRecord': {
      return getLastRecord(event)
    }
    case 'getNearbyRecord': {
      return getNearbyRecord(event)
    }
    case 'getHelp': {
      return getHelp(event)
    }
    default: {
      return
    }
  }
}
async function getBanner(event) {
  let resp = { code: 0, msg: '', data: [] };
  let banners = await db.collection('banners').get({
    success(res){
      console.log(res)
    },
    fail(res){
      console.log(res)
    }
  });
  resp.code = 1;
  resp.data = banners.data;
  return resp;
}

async function getLastRecord(event) {
  let resp = { code: 0, msg: '', data: [] };
  let dbret = await db.collection('goods').where({
  }).orderBy('createTime', 'desc').limit(10).get();
  //console.log(dbret);
  let list = dbret.data;
  // list.forEach((item) => {
  //   item.image = getCdnUrl(item.imgList[0]);
  // })
  resp.code = 1;
  resp.data = list;
  return resp;
}

async function getNearbyRecord(event) {
  let resp = { code: 0, msg: '', data: [] };
  const geo = event.geo;
  //const userInfo = event.userInfo;
  //const openid = userInfo.openId;
  //console.log("geo:", geo)
  const _ = db.command
  let dbret = await db.collection('goods').where({
    geo: _.geoNear({
      geometry: db.Geo.Point(geo.longitude, geo.latitude)
    }),
    published: true,
    deleteTime: ''
  }).orderBy('createTime', 'desc').limit(20).get();
  let list = dbret.data;
  let markers = [];
  list.forEach((item, index) => {
    let marker = {
      id: index,
      _id: item._id,
      latitude: item.location.latitude - ((item.createTime % 100) / 100000),
      longitude: item.location.longitude - ((item.createTime % 100) / 100000),
      width: 40,
      height: 40,
      iconPath: getCdnUrl(item.imgList[0]),
      title: item.title
    }
    markers.push(marker);
  })
  resp.code = 1;
  resp.data = markers;
  return resp;
}
function getCdnUrl(fileID) {
  const url = fileID ? fileID.replace(/cloud:\/\/shop-h80a0.7368-shop-h80a0-1301602414/, "https://7368-shop-h80a0-1301602414.tcb.qcloud.la") : '';
  return url;
}
function getHelp(event) {
  const list = [
    { q: '1.为什么我无法登录?', a: '请尝试升级微信版本后再重新登录。' },
    { q: '2.为什么我头像无法显示?', a: '请尝试升级微信版本后或重新打开。' },
  ];
  return list;
}
