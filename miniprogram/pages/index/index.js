// index.js
// const app = getApp()

Page({
  data: {
    dramaList: [],
  },
  onLoad() {
    wx.showLoading({
      title: '加载中~',
    })
    this.getDrama();
  },
  onShareAppMessage() {

  },
  onShareTimeline() {

  },
  getDrama() {
    wx.cloud.database().collection('drama').limit(5).orderBy('_updateTime', 'desc').get().then(res => {
      this.setData({
        dramaList: res.data
      })
      wx.hideLoading()
    })
  },
  goToDetail(e) {
    wx.navigateTo({
      url: '/pages/dramaDetail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  goDrama() {
    wx.switchTab({
      url: '/pages/dramaList/index',
    })
  }
});
