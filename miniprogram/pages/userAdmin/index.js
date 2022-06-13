// pages/userAdmin/index.js
Page({
  data: {
    phoneNumber: "",
    nickName: "",
    userList: []
  },
  onLoad(options) {
    wx.cloud.database().collection('users').where({
      phoneNumber: "18767183600",
    }).get().then(res => {
      this.setData({
        userList: res.data
      })
    })
  },
  changePhone(e) {
    this.setData({
      phoneNumber: e.detail.value.trim()
    })
  },
  changeName(e) {
    this.setData({
      nickName: e.detail.value.trim()
    })
  },
  searchUser() {
    if (this.data.phoneNumber) {
      wx.cloud.database().collection('users').where({
        phoneNumber: this.data.phoneNumber,
      }).get().then(res => {
        this.setData({
          userList: res.data
        })
      })
    } else if (this.data.nickName) {
      wx.cloud.database().collection('users').where({
        nickName: this.data.nickName,
      }).get().then(res => {
        this.setData({
          userList: res.data
        })
      })
    }  
  },
  goUserDetail(e) {
    wx.navigateTo({
      url: '/pages/userDetail/index?openid=' + e.currentTarget.dataset.openid,
    })
  }
})