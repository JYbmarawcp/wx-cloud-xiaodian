// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
  data: {
    dramaList: [],
    personTab: ["4","5","6","7","8","9"]
  },
  onLoad() {
    wx.cloud.database().collection('drama').get().then(res => {
      this.setData({
        dramaList: res.data
      })
    })
  },
  sort(e) {
    wx.cloud.database().collection('drama').where({
      person: Number(e.target.dataset.index)
    }).get().then(res => {
      this.setData({
        dramaList: res.data
      })
    })
  },
  search(e) {
    wx.cloud.database().collection('drama').where({
      title: e.detail.value
    }).get().then(res => {
      this.setData({
        dramaList: res.data
      })
    })
  }
});
