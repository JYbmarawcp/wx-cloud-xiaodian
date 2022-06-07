// index.js
// const app = getApp()

Page({
  data: {
    dramaList: [],
    currentIndex: 0,
    personTab: ["0", "4","5","6","7","8","9", "10"],
    currentType: "全部",
    typeTab: ["全部", "硬核", "欢乐", "情感", "阵营"],
    key: "",
    pageIndex: 0,
    canContinue: true,
  },
  onLoad() {
    wx.showLoading({
      title: '加载中~',
    })
    this.getDrama();
  },
  onShareAppMessage() {

  },
  onShareTimeline() {

  },
  getDrama() {
    const skipNum = 20*this.data.pageIndex;
    wx.cloud.database().collection('drama').skip(skipNum).orderBy('_updateTime', 'desc').get().then(res => {
      let canContinue = true;
      if (res.data.length === 0) {
        canContinue = false;
      }
      this.setData({
        dramaList: [...this.data.dramaList, ...res.data],
        pageIndex: this.data.pageIndex+1,
        canContinue
      })
      wx.hideLoading()
    })
  },
  onReachBottom() {
    if (!this.data.canContinue) {
      return;
    }
    wx.showLoading({
      title: '加载中~',
    })
    const skipNum = 20*this.data.pageIndex;
    if (this.data.currentIndex) {
      wx.cloud.database().collection('drama').skip(skipNum).orderBy('_updateTime', 'desc').where({
        person: this.data.currentIndex
      }).get().then(res => {
        let canContinue = true;
        if (res.data.length === 0) {
          canContinue = false;
        }
        this.setData({
          dramaList: [...this.data.dramaList, ...res.data],
          pageIndex: this.data.pageIndex+1,
          canContinue
        })
        wx.hideLoading()
      })
    } else if (this.data.currentType !== "全部") {
      wx.cloud.database().collection('drama').skip(skipNum).orderBy('_updateTime', 'desc').where({
        types: wx.cloud.database().command.all([this.data.currentType])
      }).get().then(res => {
        let canContinue = true;
        if (res.data.length === 0) {
          canContinue = false;
        }
        this.setData({
          dramaList: [...this.data.dramaList, ...res.data],
          pageIndex: this.data.pageIndex+1,
          canContinue
        })
        wx.hideLoading()
      })
    } else {
      this.getDrama();
    }
  },
  changeInput(e) {
    this.setData({
      key: e.detail.value.trim()
    })
  },
  sortPerson(e) {
    wx.showLoading({
      title: '加载中~',
    })
    const currentIndex = Number(e.target.dataset.index);
    this.setData({
      key: "",
      canContinue: true,
      pageIndex: 0,
      currentIndex: currentIndex,
      currentType: "全部",
      dramaList: []
    })
    if (currentIndex) {
      wx.cloud.database().collection('drama').orderBy('_updateTime', 'desc').where({
        person: currentIndex,
      }).get().then(res => {
        this.setData({
          dramaList: res.data,
          pageIndex: this.data.pageIndex+1,
        })
        wx.hideLoading()
      })
    } else {
      wx.cloud.database().collection('drama').orderBy('_updateTime', 'desc').get().then(res => {
        this.setData({
          dramaList: res.data,
          pageIndex: this.data.pageIndex+1,
        })
        wx.hideLoading()
      })
    }
  },
  sortType(e) {
    wx.showLoading({
      title: '加载中~',
    })
    const currentType = e.target.dataset.type;
    this.setData({
      key: "",
      canContinue: true,
      pageIndex: 0,
      currentIndex: 0,
      currentType,
      dramaList: []
    })
    if (currentType === "全部") {
      wx.cloud.database().collection('drama').orderBy('_updateTime', 'desc').get().then(res => {
        this.setData({
          dramaList: res.data,
          pageIndex: this.data.pageIndex+1,
        })
        wx.hideLoading()
      })
    } else {
      wx.cloud.database().collection('drama').orderBy('_updateTime', 'desc').where({
        types: wx.cloud.database().command.all([currentType])
      }).get().then(res => {
        this.setData({
          dramaList: res.data,
          pageIndex: this.data.pageIndex+1,
        })
        wx.hideLoading()
      })
    }
  },
  search(e) {
    this.setData({
      canContinue: true,
      pageIndex: 0,
      currentIndex: 0,
      dramaList: []
    })
    const key = e.detail.value.trim()
    if (key) {
      wx.cloud.database().collection('drama').where({
        title: wx.cloud.database().RegExp({
          regexp: key,
          options: 'i',
        })
      }).get().then(res => {
        this.setData({
          dramaList: res.data
        })
      })
    } else {
      wx.cloud.database().collection('drama').orderBy('_updateTime', 'desc').get().then(res => {
        this.setData({
          dramaList: res.data
        })
      })
    }
  },
  goToDetail(e) {
    wx.navigateTo({
      url: '/pages/dramaDetail/index?id=' + e.currentTarget.dataset.id,
    })
  }
});
