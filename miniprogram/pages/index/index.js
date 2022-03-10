// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
  data: {
    dramaList: [],
    personTab: ["4","5","6","7","8","9"],
    key: ""
  },
  onLoad() {
    wx.cloud.database().collection('drama').get().then(res => {
      this.setData({
        dramaList: res.data
      })
    })
  },
  changeInput(e) {
    this.setData({
      key: e.detail.value.trim()
    })
  },
  sort(e) {
    this.setData({
      key: ""
    })
    wx.cloud.database().collection('drama').where({
      person: Number(e.target.dataset.index)
    }).get().then(res => {
      this.setData({
        dramaList: res.data
      })
    })
  },
  search(e) {
    const key = e.detail.value.trim()
    if (key) {
      wx.cloud.database().collection('drama').where({
        title: e.detail.value
      }).get().then(res => {
        this.setData({
          dramaList: res.data
        })
      })
    } else {
      wx.cloud.database().collection('drama').get().then(res => {
        this.setData({
          dramaList: res.data
        })
      })
    }
  }
});
