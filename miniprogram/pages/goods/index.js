// pages/goods/index.js
Page({
  data: {

  },
  onLoad: function (options) {
    wx.cloud.database().collection('buy_goods').get().then(res => {
      this.setData({
        goodsList: res.data
      })
    })
  },
  addOrder(event) {
    let index = event.currentTarget.dataset.index;
    let orderId = Date.now() + '' + Math.ceil(Math.random() * 10);
    // 添加订单
    wx.cloud.database().collection('buy_orders').add({
      data: {
        orderId,
        goodMoney: this.data.goodsList[index].price,
        goodName: this.data.goodsList[index].title,
        goodNum: this.data.goodsList[index].num,
        goodId: this.data.goodsList[index]._id,
        status: 0 //未支付状态
      }
    }).then(res => {
      this.setData({
        order_id: res._id
      })
      wx.cloud.callFunction({
        name: 'buy_pay',
        data: {
          body: this.data.goodsList[index].title,
          outTradeNo: orderId,
          totalFee: this.data.goodsList[index].price * 100,
        }
      }).then(res => {
          this.pay(res.result.payment)
      })
    })
  },
  pay(payment) {
    var that = this;
    wx.requestPayment({
      ...payment,
      success(res) {
        console.log(res);
        wx.cloud.database().collection('buy_orders').doc(that.data.order_id).update({
          data: {
            status: 1
          },
          success(res) {
            console.log(res);
            wx.showToast({
              title: '支付成功',
            })
          }
        })
      },
      fail(res) {
        console.log(res);
        wx.showToast({
          icon: 'none',
          title: '支付失败',
        })
      }
    })
  },
  onShareAppMessage: function () {

  }
})