// pages/dramaDetail/index.js
Page({
  data: {
    dramaDetail: {}
  },
  onLoad(options) {
    wx.showLoading();
    this.getDrama(options.id);
  },
  onShow() {

  },
  onHide() {

  },
  onShareAppMessage() {

  },
  getDrama(id) {
    wx.cloud.database().collection('drama').doc(id).get().then(res => {
      this.setData({
        dramaDetail: res.data
      })
      wx.hideLoading();
    })
  },
  previewImage() {
    wx.previewImage({
      current: this.data.dramaDetail.role[0], // 当前显示图片的http链接
      urls: this.data.dramaDetail.role // 需要预览的图片http链接列表
    })
  }
})