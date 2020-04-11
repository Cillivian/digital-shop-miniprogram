import { formatTime } from '../../utils/util'
const app = getApp()
var timer = null;
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
}
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    load: true,
    dataList: {},
    type:['手机', '电脑', '平板', '耳机', '游戏机', '摄像机', '其他']
  },
  onShow() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.getAll("手机")
    this.setData({
      TabCur:0
    })
  },
  handleTosearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  tabSelect(e) {
    console.log(e.currentTarget.dataset.name)
    let type = e.currentTarget.dataset.name
    this.getAll(type)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  },
  getAll(type) {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'goods',
      data: { action: 'getAllRecord', type: type },
      success: res => {
        console.log('[云函数] [getAllRecord] : ', res.result)
        if (res.result && res.result.code === 1) {
          if (res.result.data && res.result.data.length > 0) {
            let record = res.result.data;
            this.setData({
              dataList: record
            })

          }
        }
        wx.hideLoading()
      },
      fail: err => {
        console.error('[云函数] [getAllRecord] 调用失败', err)
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },
  goDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/post/detail?id=' + id
    })
  },
})