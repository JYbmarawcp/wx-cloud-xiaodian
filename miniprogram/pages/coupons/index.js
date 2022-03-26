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

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  changeTabs(e) {
    this.setData({
      currentIndex: Number(e.target.dataset.index)
    })
  }
})