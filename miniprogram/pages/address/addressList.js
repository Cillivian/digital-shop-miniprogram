// miniprogram/pages/address/addressList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddress()
  },
  handleAdd(){
    wx.navigateTo({
      url: '/pages/address/addAddress',
    })
  },
  getAddress(){
    let that=this
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'address',
      data: { action: 'getAddress'},
      success: res => {
        console.log('[云函数] [getAddress] : ', res.result) 
        that.setData({
          addressList:res.result.data
        })  
      },
      fail: err => {
        console.error('[云函数] [getAddress] 调用失败', err)
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  }
})