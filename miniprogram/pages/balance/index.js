const app = getApp()
Page({
  data: {
    balance: "0.00",
    price: 500,
    userInfo: {}
  },
  onLoad: function (options) {
    this.getBalane()
  },
  addOrder() {
    wx.showLoading({
      title: '加载中~',
    })
    let orderId = Date.now() + '' + Math.ceil(Math.random() * 10);
    const price = this.data.price;
    // 添加订单
    wx.cloud.database().collection('orders').add({
      data: {
        orderId,
        goodMoney: price,
        status: 0, //未支付状态
        _createTime: +new Date(),
        _updateTime: +new Date(),
      }
    }).then(res => {
      this.setData({
        order_id: res._id
      })
      wx.cloud.callFunction({
        name: 'buy_pay',
        data: {
          body: "充500",
          outTradeNo: orderId,
          totalFee: price * 100,
        }
      }).then(res => {
          this.pay(res.result.payment, price)
      })
    })
  },
  pay(payment, price) {
    var that = this;
    wx.hideLoading();
    wx.requestPayment({
      ...payment,
      success(res) {
        const realPrice = price + 100;
        wx.cloud.database().collection('account').add({
          data: {
            amount: realPrice,
            type: "add"
          }
        })
        wx.cloud.callFunction({
          name: 'update_balance',
          data: {
            totalFee: realPrice,
            point: price
          }
        }).then(res => {
          that.getBalane()
        })
        wx.cloud.database().collection('orders').doc(that.data.order_id).update({
          data: {
            status: 1,
            _updateTime: +new Date(),
          },
          success(res) {
            wx.showToast({
              title: '充值成功',
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
  getBalane() {
    wx.cloud.database().collection('users').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      this.setData({
        userInfo: res.data[0]
      })
    })
  }
})