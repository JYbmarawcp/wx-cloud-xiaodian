const app = getApp()
Page({
  data: {
    tabs: [
      {
        label: "未使用",
        value: 0
      },
      {
        label: "已使用",
        value: 1
      },
      {
        label: "已过期",
        value: 2
      }
    ],
    currentIndex: 0,
    couponsList: []
  },
  onLoad: function (options) {
    wx.cloud.database().collection('user_coupons').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      const couponsList = res.data;
      couponsList.forEach(item => {
        item.startTime = this.getTime(item._createTime);
        item.endTime = this.getTime(item.endTime);
      })
      this.setData({
        couponsList
      })
    })
  },
  onShow: function () {

  },
  changeTabs(e) {
    this.setData({
      currentIndex: Number(e.currentTarget.dataset.index)
    })
  },
  getTime(timestamp) {
  　　let date = new Date(timestamp);
  　　var YY = date.getFullYear() + '-';
  　　var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  　　var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  　　return YY + MM + DD;
  },
})