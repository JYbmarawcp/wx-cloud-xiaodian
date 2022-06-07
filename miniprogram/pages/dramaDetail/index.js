// pages/dramaDetail/index.js
const app = getApp()
Page({
  data: {
    load_img: false,
    dramaDetail: {},
    userInfo: {}
  },
  onLoad(options) {
    wx.showLoading();
    wx.cloud.callFunction({
      name: 'getUser',
    }).then(res => {
      this.setData({
        userInfo: res.result.userInfo
      })
      wx.hideLoading()
    })
    
    this.getDrama(options.id);
  },
  onShow() {

  },
  onHide() {

  },
  onShareAppMessage() {

  },
  onShareTimeline() {
    return {
      title: '影子剧社剧本推理馆',
      query: {
        id: this.data.dramaDetail._id
      },
    };
  },
  loadImg() {
    this.setData({
      load_img: true
    })
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
  },
  previewDrama() {
    const list = [];
    list[0] = this.data.dramaDetail.cover
    wx.previewImage({
      current: list[0], // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  goToPay() {
    if (this.data.userInfo.phoneNumber) {
      wx.navigateTo({
        url: '/pages/buy/index?price=' + this.data.dramaDetail.price + '&drama=' + this.data.dramaDetail.title,
      })
    }
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
        wx.navigateTo({
          url: '/pages/buy/index?price=' + this.data.dramaDetail.price + '&drama=' + this.data.dramaDetail.title,
        })
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
})