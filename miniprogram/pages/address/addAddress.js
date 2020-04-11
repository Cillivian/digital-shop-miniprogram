// miniprogram/pages/address/addAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:null,
    detail:"",
    region: ['广东省', '广州市', '海珠区'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindKeyInput(e) {
    const key = e.currentTarget.dataset.key;
    let data = {};
    data[key] = e.detail.value;
    this.setData(data);
  },
  submit(){
    let data = {};
    let errorMsg = "";
    data.name=this.data.name
    data.region=this.data.region
    data.detail=this.data.detail
    data.phone=this.data.phone
    data.deleteTime=""
    data.createTime = new Date().getTime();
    if (data.name=="") {
      errorMsg = '请完善收货人信息';
    }
    if (data.phone == null) {
      errorMsg = '请留下联系方式';
    }
    if (data.detail=="") {
      errorMsg = '请完善详细地址信息';
    }
    if (errorMsg) {
      wx.showToast({
        title: errorMsg,
        icon: 'none'
      })
      return;
    }

    this.saveData(data);
  },
  saveData(data) {
    wx.showLoading({ title: '新增中' });
    const db = wx.cloud.database();
    db.collection('address').add({
      data: data
    }).then(result => {
      console.log('保存成功', result)
      wx.hideLoading()
      wx.showToast({ title: '新增成功', icon: 'success', duration: 2000 })
        wx.navigation({
          url: '/pages/address/addressList',
        })
    }).catch((e) => {
      console.log(e)
      wx.hideLoading()
      wx.showToast({ title: '发布失败', icon: 'none' })
    })
  },
})