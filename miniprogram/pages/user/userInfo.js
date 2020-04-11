var app = getApp();
Page({
  data: {
    isShowAuth: false,
    isAdmin:false,
    userInfo: {},
    count: [{
      id: 0,
      type: '订单',
      icon: 'cuIcon-group_fill',
      color: 'text-orange',
      url:'/pages/user/record',
      num: 0,
      unit: '个'
    }, {
      id: 1,
      type: '收藏',
      icon: 'cuIcon-appreciatefill',
      color: 'text-green',
      num: 0,
      unit: '个'
    }, {
      id: 2,
      type: '积分',
      icon: 'cuIcon-moneybag',
      color: 'text-blue',
      num: 0,
      unit: '分'
    }],
  },
  onShow() {
    var userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      this.getCount();
    } else {
      wx.showToast({
        icon: 'none',
        title: '请登录帐号',
        duration: 1000,
      })
      this.setData({
        isShowAuth: true
      })
    }
  },
  getCount() {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'user',
      data: {
        action: 'getCount'
      },
      success: res => {
        console.log('[云函数] [getCount] : ', res)
        this.setData({
          count: res.result
        });
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '数据加载错误',
          duration: 3000,
        })
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },
  handleTo(e){
    console.log(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  goAuth(e) {
    wx.navigateTo({
      url: '/pages/user/auth'
    })
  },
  goAdmin(e){
    wx.navigateTo({
      url: '/pages/admin/index'
    })
  },
  goRecord(e) {
    wx.navigateTo({
      url: '/pages/user/record'
    })
  },
  goHelp(e) {
    wx.navigateTo({
      url: '/pages/help/help'
    })
  },
  goAddress(e) {
    wx.navigateTo({
      url: '/pages/address/addressList'
    })
  },
  goRecharge(e) {
    var userInfo = app.globalData.userInfo;
    if (userInfo) {
      wx.navigateTo({
        url: '/pages/recharge/recharge',
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请登录帐号',
        duration: 1000,
      })
      this.setData({
        isShowAuth: true
      })
    }
  },
  CopyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '地址已复制',
          duration: 1000,
        })
      }
    })
  },
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  onAuthEvent: function (e) {
    console.log('onAuthEvent', e);
    if (e.detail.mobile) {
      this.setData({
        userInfo: e.detail
      })
      this.getCount();
    }
  },
  onPullDownRefresh() {
    this.getCount();
    wx.stopPullDownRefresh();
    //reload
  },
  onShareAppMessage() {
    return {
      title: '点击打开数码商城',
      path: '/pages/index/index',
      imageUrl: 'https://7368-shop-h80a0-1301602414.tcb.qcloud.la/shareImg.jpg'
    }
  },
})