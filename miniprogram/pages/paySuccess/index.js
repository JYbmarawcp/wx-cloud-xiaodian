// pages/paySuccess/index.js
Page({
  data: {
    order: {},
    price: ""
  },
  onLoad: function (options) {
    wx.cloud.database().collection('orders').where({
      _id: options.order_id
    }).get().then(res => {
      const useBalance = res.data[0].useBalance || 0;
      const goodMoney = res.data[0].goodMoney || 0;
      let time = new Date(res.data[0]._updateTime).toLocaleString('chinese',{hour12:false});
      
      this.setData({
        order: res.data[0],
        price: Number(goodMoney) + Number(useBalance),
        time
      })
    })
  }
})