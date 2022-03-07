// pages/order/index.js
Page({
  data: {

  },
  onShow: function (options) {
    wx.cloud.database().collection('buy_orders').orderBy('time', 'desc').where({
      status: 1
    }).get().then(res => {
      this.setData({
        ordersList: res.data
      })
    })
  },
  refund(event) {
    let that = this;
    let index = event.currentTarget.dataset.index;
    let refundNum = Date.now() + '' + Math.ceil(Math.random() * 10);
    wx.cloud.callFunction({
      name: 'buy_refund',
      data: {
        refundNum: refundNum,
        tradeNum: this.data.ordersList[index].orderId,
        money: this.data.ordersList[index].goodMoney*100,
      },
      success(res) {
        console.log(res);
        if (res.result.resultCode == 'SUCCESS') {

          // 改变订单状态
          wx.cloud.database().collection('buy_orders').doc(that.data.ordersList[index]._id).update({
            data: {
              status: 2
            },
            success(res) {
              console.log(res);
              wx.showToast({
                title: '退款成功',
              })
            }
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  onShareAppMessage: function () {

  }
})