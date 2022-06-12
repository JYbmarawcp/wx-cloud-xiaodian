const app = getApp()
Page({
  data: {
    cardInfo: [],
    userInfo: {}
  },
  onLoad(options) {
    wx.showLoading();
    wx.cloud.callFunction({
      name: 'getUser',
    }).then(res => {
      wx.cloud.database().collection('account').orderBy('_updateTime', 'desc').where({
        _openid: res.result.userInfo._openid
      }).get().then(res2 => {
        let cardInfo = res2.data
        cardInfo.forEach(item => {
          if (item._updateTime) {
            item.time = this.getTime(item._updateTime)
          }
        })
        this.setData({
          cardInfo,
          userInfo: res.result.userInfo
        })
        wx.hideLoading()
      })
    })
  },
  getTime(timestamp) {
  　　let date = new Date(timestamp);
  　　var YY = date.getFullYear() + '-';
  　　var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  　　var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  　　var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  　　var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  　　return YY + MM + DD +" "+hh + mm;
  },
})