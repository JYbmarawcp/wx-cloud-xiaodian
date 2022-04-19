// pages/connectWifi/index.js
Page({
  data: {
    accountNumber: '影子剧社',//Wi-Fi 的SSID，即账号
    password: 'aptx4869',//Wi-Fi 的密码
  },
  onLoad(options) {

  },
  onShow() {
    this.connectWifi();
  },
  onShareAppMessage() {
    return {
      title: '连接wifi',
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
})