// index.js
const app = getApp()
Page({
  data: {
    dramaList: [],
    userInfo: {},
    accountNumber: '影子剧社',//Wi-Fi 的SSID，即账号 影子剧社
    password: 'aptx4869',//Wi-Fi 的密码
    latitude: 30.261800,
    longitude: 120.161299,
  },
  onLoad() {
    wx.showLoading({
      title: '加载中~',
    })
    wx.cloud.callFunction({
      name: 'getUser',
    }).then(res => {
      this.setData({
        userInfo: res.result.userInfo
      })
      wx.hideLoading()
    })
    this.getDrama();
  },
  onShareAppMessage() {
  },
  onShareTimeline() {
  },
  getDrama() {
    wx.cloud.database().collection('drama').limit(8).orderBy('_updateTime', 'desc').get().then(res => {
      this.setData({
        dramaList: res.data
      })
      wx.hideLoading()
    })
  },
  goToDetail(e) {
    wx.navigateTo({
      url: '/pages/dramaDetail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  goDrama() {
    wx.switchTab({
      url: '/pages/dramaList/index',
    })
  },
  makePhone() {
    wx.makePhoneCall({
      phoneNumber: '17300970143'
    })
  },
  getUser() {
    if (this.data.userInfo.nickName) {
      this.connectWifi();
    } else {
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
          this.connectWifi();
        },
        fail: res => {
          wx.showToast({
            icon: 'none',
            title: '请先授权头像',
          })
        }
      })
    }
  },
  connectWifi() {
    var that = this;
    //检测手机型号
    wx.getSystemInfo({
      success: function(res) {
        var system = '';
        if (res.platform == 'android') system = parseInt(res.system.substr(8));
        if (res.platform == 'ios') system = parseInt(res.system.substr(4));
        if (res.platform == 'android' && system < 6) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        if (res.platform == 'ios' && system < 11.2) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        //2.初始化 Wi-Fi 模块
        that.startWifi();
      }
    })
  },
  //初始化 Wi-Fi 模块
  startWifi() {
    var that=this;
    wx.startWifi({
      success: function() {
        //请求成功连接Wifi
        that.Connected();
      },
      fail: function(res) {
        wx.showToast({
          icon: 'none',
          title: '接口调用失败',
        })
      }
    })
  },
  Connected: function() {
    var that=this;
    wx.connectWifi({
      SSID: that.data.accountNumber,
      password: that.data.password,
      success: function(res) {
        wx.showToast({
          icon: 'none',
          title: 'wifi连接成功',
        })
      },
      fail: function(res) {
        wx.showToast({
          icon: 'none',
          title: 'wifi连接失败',
        })
      }
    })
  },
  openMap() {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 15,
      name: '影子剧社',
      address: '浙江省杭州市拱墅区武林路100号鸿鼎商务楼(距地铁1/2号线凤起路站C1口步行410m)'
    })
  }
});
