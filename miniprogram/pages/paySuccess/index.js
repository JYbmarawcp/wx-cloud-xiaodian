// pages/paySuccess/index.js
Page({
  data: {
    order: {},
    price: ""
  },
  onLoad: function (options) {
    if (options.order_id) {
      wx.cloud.database().collection('orders').where({
        _id: options.order_id
      }).get().then(res => {
        const useBalance = res.data[0].useBalance || 0;
        const goodMoney = res.data[0].goodMoney || 0;
        let time = this.getTime(res.data[0]._updateTime);
        this.setData({
          order: res.data[0],
          price: Number(goodMoney) + Number(useBalance),
          time
        })
      })
    } else {
      wx.cloud.database().collection('shop_orders').where({
        _id: options.orderId
      }).get().then(res => {
        const useBalance = res.data[0].useBalance || 0;
        const goodMoney = res.data[0].goodMoney || 0;
        let time = this.getTime(res.data[0]._updateTime);
        this.setData({
          order: res.data[0],
          price: Number(goodMoney) + Number(useBalance),
          time
        })
      })
    }
  },
  getTime(timestamp) {
  　　let date = new Date(timestamp);
  　　var YY = date.getFullYear() + '-';
  　　var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  　　var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  　　var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  　　var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  　　var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  　　return YY + MM + DD +" "+hh + mm + ss;
  },
  goToCoupons() {
    wx.navigateTo({
      url: '/pages/coupons/index',
    })
  }
})