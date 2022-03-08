const app = getApp()
Page({
  data: {
    switch1Checked: false,
    price: null,
    realAmount: 0,
    userInfo: {}
  },
  onLoad: function (options) {
    wx.cloud.database().collection('users').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      this.setData({
        userInfo: res.data[0]
      })
    })
  },
  switch1Change() {
    if (!this.data.switch1Checked && this.data.price) {
      if (this.data.userInfo.balance >= this.data.price) {
        this.setData({
          realAmount: 0,
        })
      } else {
        const realAmount = ((this.data.price * 100 - this.data.userInfo.balance * 100 ) / 100).toFixed(2)
        this.setData({
          realAmount
        })
      }
    } else {
      this.setData({
        realAmount: this.data.price,
      })
    }
    this.setData({
      switch1Checked: !this.data.switch1Checked
    })
  },
  changeInput(e) {
    const price = Number(e.detail.value)
    if (this.data.switch1Checked) {
      if (this.data.userInfo.balance >= price) {
        this.setData({
          price,
          realAmount: 0,
        })
      } else {
        const realAmount = ((price * 100 - this.data.userInfo.balance * 100 ) / 100).toFixed(2)
        this.setData({
          price,
          realAmount
        })
      }
    } else {
      this.setData({
        price,
        realAmount: price
      })
    }
  },
  addOrder() {
    let orderId = Date.now() + '' + Math.ceil(Math.random() * 10);
    // 添加订单
    const price = this.data.realAmount ? this.data.realAmount : 0;
    wx.cloud.database().collection('orders').add({
      data: {
        orderId,
        goodMoney: price,
        status: 0 //未支付状态
      }
    }).then(res => {
      this.setData({
        order_id: res._id
      })
      wx.cloud.callFunction({
        name: 'buy_pay',
        data: {
          body: "买单",
          outTradeNo: orderId,
          totalFee: price * 100,
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
        wx.cloud.database().collection('orders').doc(that.data.order_id).update({
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
})