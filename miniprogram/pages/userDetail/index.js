Page({
  data: {
    userInfo: {},
    type: 0
  },
  onLoad(options) {
    wx.cloud.database().collection('users').where({
      _openid: options.openid,
    }).get().then(res => {
      this.setData({
        userInfo: res.data[0]
      })
    })
  },
  changeRadio(e) {
    this.setData({
      type: e.currentTarget.dataset.checked
    })
  }
})