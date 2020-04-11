import { formatTime } from '../../utils/util'
const app = getApp();
// const category = '生活服务,娱乐休闲';
Page({
  data: {
    isShowSetting: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    markers: [],
    userInfo:{},
    hasUserInfo:false,
    banner: [{
      id: 0,
      type: 'image',
      url: 'https://7368-shop-h80a0-1301602414.tcb.qcloud.la/banners/iphone-11-pro-max-midnight-green-select-2019.jpg'
    }],
    lastRecord: []
  },
  onLoad: function () {
    this.getBanner();
   // this.getLastRecord();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  async onShow(){
    wx.showLoading({
      title: '加载中',
    })
    await this.getLastRecord();
    wx.hideLoading()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  handleTosearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  getBanner(){
    console.log('sss')
    wx.cloud.callFunction({
      name: 'base',
      data: {
        action: 'getBanner',
        // geo: app.globalData.location,
        // version: app.globalData.version
      },
      success: res => {
        console.log('[云函数] [getBanner] : ', res)
        if (res && res.result && res.result.code == 1) {
          this.setData({
            banner: res.result.data
          });
        }
      },
      fail(res){
        console.log('[云函数] [getBanner] : ', res)
      }
    })
  },
  getLastRecord() {
    wx.cloud.callFunction({
      name: 'base',
      data: {
        action: 'getLastRecord',
      },
      success: res => {
        console.log('[云函数] [getLastRecord] : ', res)
        if (res && res.result && res.result.code == 1) {
          let lastRecord = res.result.data;
          lastRecord.forEach((item, index) => {
            item.time = formatTime(item.createTime)
          })
          this.setData({
            lastRecord: lastRecord
          });
        }
      },
      fail(res) {
        console.log('[云函数] [getLastRecord] : ', res)
      }
    })
  },
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/post/detail?id=' + id
    })
  }
})
