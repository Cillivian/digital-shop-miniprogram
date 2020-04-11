const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    dataList: [],
    checkAll: true,
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let cart = wx.getStorageSync('cart') || [];
    this.setData({
      dataList: cart
    })
    this.calculateTotal();
  },
  selectOne(e) {
    console.log(e.detail.value)
    let state = e.detail.value.length > 0 ? true : false;
    let index = e.currentTarget.dataset.index
    let list = this.data.dataList
    list[index].checked = state
    this.setData({
      dataList: list
    })
    this.calculateTotal();
  },
  changeNum(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    let num = e.detail
    let list = this.data.dataList
    list[index].number = num
    this.setData({
      dataList: list
    })
    this.calculateTotal();
  },
  selectalltap: function (e) {
    console.log(e);
    var value = e.detail.value;
    var checkAll = false;
    if (value && value[0]) {
      checkAll = true;
    }
    var dataList = this.data.dataList;
    for (var i = 0; i < dataList.length; i++) {
      var good = dataList[i];
      good['checked'] = checkAll;
    }
    this.setData({
      'checkAll': checkAll,
      'dataList': dataList
    });
    this.calculateTotal();
  },
  calculateTotal() {
    let list = this.data.dataList
    let total = 0
    list.map(item => {
      if (item.checked == true) {
        total += item.number * item.price
      }
    })
    this.setData({
      total: total
    })
  },
  onDelete(e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.dataList
    let that=this
    wx.showModal({
      title: '注意',
      content: '确认删除改商品吗？',
      confirmText: "删除",
      cancelText: "取消",
      success(res) {
        if (res.confirm) {
          list.splice(index, 1)
          that.setData({
            dataList: list
          })
        } else if (res.cancel) {
          return 
        }
      }
    })
  },
  toBuy() {
    let list = this.data.dataList
    if (list.length <= 0) {
      wx.showToast({ title: '没有选择商品', icon: 'none', duration: 2000 })
      return
    }
    let goods = []
    list.map((item, index) => {
      if (item.checked == true) {
        goods.push(item)
        //list.splice(index,1)
      }
    })
    if (goods.length <= 0) {
      wx.showToast({ title: '没有选择商品', icon: 'none', duration: 2000 })
      return
    }
    let dataList = list.filter(e => e.checked == false)
    let data = {
      goods: goods,
      total: this.data.total
    }
    this.setData({
      dataList: dataList
    })
    let str = JSON.stringify(data);
    wx.navigateTo({
      url: `/pages/buy/buy?data=${str}`,
    })
  },
  onHide() {
    let cart = this.data.dataList
    wx.setStorageSync('cart', cart)
  }
})