// miniprogram/pages/buy/bug.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    total:0,
    addressList:[],
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let data = JSON.parse(options.data);
  console.log(data)
    this.setData({ 
      goods:data.goods,
      total:data.total
     });
     this.getAddress()
  },
  getAddress() {
    let that = this
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'address',
      data: { action: 'getAddress' },
      success: res => {
        console.log('[云函数] [getAddress] : ', res.result)
        let data=res.result.data.map(item=>{
          return `${item.name} ${item.phone} ${item.region.join('-')} ${item.detail }`
        })
        that.setData({
          addressList: data
        })
      },
      fail: err => {
        console.error('[云函数] [getAddress] 调用失败', err)
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },
  bindPickerChange: function (e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  handleAddOrder(){
    wx.showLoading({ title: '付款中' });
    let data={
      goods:this.data.goods,
      total:this.data.total,
      address:this.data.addressList[this.data.index],
      createTime: new Date().getTime()
    }
    const db = wx.cloud.database();
    db.collection('orders').add({
      data: data
    }).then(result => {
      console.log('购物成功', result)
      wx.hideLoading()
      wx.showToast({ title: '购物成功', icon: 'success', duration: 2000 })
      wx.switchTab({
        url: '/pages/index/index',
      })
    }).catch((e) => {
      console.log(e)
      wx.hideLoading()
      wx.showToast({ title: '购物成功', icon: 'none' })
    })
  },
  handleAddAddress(){
    wx.navigateTo({
      url: '/pages/address/addAddress',
    })
  }
})