// pages/my/index.js
const app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中~',
    })
    wx.cloud.database().collection('users').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      this.setData({
        userInfo: res.data[0] || {}
      })
      wx.hideLoading()
    })
  },
  getUser() {
    wx.getUserProfile({
      desc: "业务需要",
      lang: "zh_CN",
      success: res => {
        let userInfo = this.data.userInfo;
        userInfo.avatarUrl = res.userInfo.avatarUrl;
        userInfo.nickName = res.userInfo.nickName;
        this.setData({
          userInfo
        })
        // 添加用户
        if (this.data.userInfo._openid) {
          wx.cloud.database().collection('users').where({
            _openid: app.globalData.openid
          }).update({
            data: {
              avatarUrl: userInfo.avatarUrl,
              nickName: userInfo.nickName,
            }
          })
        } else {
          wx.cloud.database().collection('users').add({
            data: {
              avatarUrl: userInfo.avatarUrl,
              nickName: userInfo.nickName,
              balance: 0,
              point: 0
            }
          })
        }
      }
    })
  },
  async getPhoneNumber(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
        const result = await wx.cloud.callFunction({
            name: 'bind_mobile',
            data: {
                type: 'login',
                id: wx.cloud.CloudID(e.detail.cloudID)
            }
        })
        const phoneNumber = result.result.id.data.phoneNumber;
        let userInfo = this.data.userInfo;
        userInfo.phoneNumber = phoneNumber;
        this.setData({
          userInfo
        })
        if (this.data.userInfo._openid) {
          wx.cloud.database().collection('users').where({
            _openid: app.globalData.openid
          }).update({
            data: {
              phoneNumber: phoneNumber,
            }
          })
        } else {
          wx.cloud.database().collection('users').add({
            data: {
              phoneNumber: phoneNumber,
              balance: 0,
              point: 0
            }
          })
        }
        wx.showToast({
          title: '授权成功',
          icon: 'none'
        })
    } else {
      wx.hideLoading({
          complete: (res) => {
              wx.showToast({
                  title: '用户拒绝，获取失败',
                  icon: 'none'
              })
          }
      })
    }
  },
  goToBuy() {
    if (this.data.userInfo.phoneNumber) {
      wx.navigateTo({
        url: '/pages/buy/index',
      })
    }
  },
  goToBalance() {
    if (this.data.userInfo.phoneNumber) {
      wx.navigateTo({
        url: '/pages/balance/index',
      })
    }
  },
  goToCoupons() {
    if (this.data.userInfo.phoneNumber) {
      wx.navigateTo({
        url: '/pages/coupons/index',
      })
    }
  },
  goToPoint() {
    if (this.data.userInfo.phoneNumber) {
      wx.navigateTo({
        url: '/pages/shop/index',
      })
    }
  },
  goToWifi() {
    wx.navigateTo({
      url: '/pages/connectWifi/index',
    })
  },
  goToBook() {
    // wx.navigateTo({
    //   url: '/pages/question/index',
    // })
  }
})