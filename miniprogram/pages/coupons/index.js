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
    couponsList: [],
    first_io: true
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中~',
    })
    this.getCoupns();
  },
  onShow: function () {
    if (this.data.first_io) {
      this.setData({
        first_io: false
      })
      return;
    }
    wx.showLoading({
      title: '加载中~',
    })
    this.getCoupns();
  },
  getCoupns() {
    wx.cloud.callFunction({
      name: 'find_coupons',
      data: {
        status: this.data.currentIndex
      }
    }).then(res => {
      const couponsList = res.result.list;
      couponsList.forEach(item => {
        item.startTime = this.getTime(item._createTime);
        item.endTime = this.getTime(item.endTime);
      })
      this.setData({
        couponsList
      })
      wx.hideLoading();
    })
  },
  changeTabs(e) {
    wx.showLoading({
      title: '加载中~',
    })
    this.setData({
      currentIndex: Number(e.currentTarget.dataset.index)
    },() => {
      this.getCoupns();
    })
  },
  getTime(timestamp) {
  　　let date = new Date(timestamp);
  　　var YY = date.getFullYear() + '-';
  　　var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  　　var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  　　return YY + MM + DD;
  },
  goToUseCoupon() {
    wx.navigateTo({
      url: '/pages/buy/index',
    })
  },
  showTip(e) {
    const couponsList = this.data.couponsList;
    const index = e.currentTarget.dataset.index;
    couponsList[index].show = !couponsList[index].show;
    this.setData({
      couponsList
    })
  }
})