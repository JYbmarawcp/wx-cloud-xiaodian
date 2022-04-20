const app = getApp()

var timer = null
Page({
  data: {

  },
  onLoad() {
    
  },
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 1000
    })
  },
  onHide: function () {
    timer && clearTimeout(timer)
  },
  longPress() {
    // 震动反馈
    const res = wx.getSystemInfoSync()
    if (res.platform.toLocaleLowerCase() !== 'ios') {
      wx.vibrateLong()
    } else {
      wx.vibrateShort({
        type: 'heavy'
      })
    }

    // 动画
    this.animation.rotate(1800).step()
    this.setData({
      animation: this.animation.export()
    }, () => {
      timer = setTimeout(() => {
        this.reset()

        wx.redirectTo({
          url: '/pages/answer/answer',
        })
      }, 1000)
    })
  },
  // 重置动画
  reset: function () {
    this.animation.rotate(0, 0)
                  .step({duration: 0})
    this.setData({animation: this.animation.export()})
  }
})