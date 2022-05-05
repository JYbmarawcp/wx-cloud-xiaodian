// pages/connectWifi/index.js
const app = getApp()
Page({
  data: {
    userInfo: {},
    accountNumber: '影子剧社',//Wi-Fi 的SSID，即账号 影子剧社
    password: 'aptx4869',//Wi-Fi 的密码
    isShow: 0
  },
  onLoad(options) {
  },
  onShow() {
    wx.cloud.database().collection('users').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      this.setData({
        userInfo: res.data[0] || {}
      })
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
        this.connectWifi();
      },
      fail: res => {
        wx.showToast({
          icon: 'none',
          title: '请先授权头像',
        })
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '店铺WiFi',
      imageUrl: 'https://udh.oss-cn-hangzhou.aliyuncs.com/05600595-1674-4d16-82e8-3ab2d73dcc2f20420163716.png'
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
          that.setData({
            isShow: 2
          })
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        if (res.platform == 'ios' && system < 11.2) {
          that.setData({
            isShow: 2
          })
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
        that.setData({
          isShow: 2
        })
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
        console.log(res);
        wx.showToast({
          icon: 'none',
          title: 'wifi连接成功',
        })
        that.setData({
          isShow: 1
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 2000);
      },
      fail: function(res) {
        that.setData({
          isShow: 2
        })
      }
    })
  },
})