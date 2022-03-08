// pages/my/index.js
const app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    wx.cloud.database().collection('users').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      this.setData({
        userInfo: res.data[0]
      })
    })
  },
  onShow: function () {

  },
  getUser() {
    wx.getUserProfile({
      desc: "业务需要",
      lang: "zh_CN",
      success: res => {
        let userInfo = res.userInfo;
        // 添加用户
        wx.cloud.database().collection('users').add({
          data: {
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName
          }
        })
      }
    })
  },
  goToBuy() {
    wx.navigateTo({
      url: '/pages/buy/index',
    })
  },
  goToBalance() {
    wx.navigateTo({
      url: '/pages/balance/index',
    })
  }
})