// miniprogram/pages/admin/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    iconList: [{
      icon: 'upload',
      color: 'red',
      name: '上架商品',
      url:'\post'
    }, {
      icon: 'upblock',
      color: 'orange',
      name: '下架商品'
    }, {
      icon: 'peoplefill',
      color: 'yellow',
      name: '用户管理'
    }, {
      icon: 'formfill',
      color: 'olive',
      name: '订单管理'
    }, {
      icon: 'rankfill',
      color: 'black',
      name: '月销量'
    }, {
      icon: 'goodsnewfill',
      color: 'cyan',
      name: '广告设置'
    }, {
      icon: 'more',
      color: 'mauve',
      name: '更多'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleTo(e){
    console.log(e.currentTarget.dataset.url)
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  }

})