const app = getApp()
Page({
  data: {
    switch1Checked: false,
    price: null,
    realAmount: 0,
    useBalance: 0,
    userInfo: {}
  },
  onLoad: function (options) {
    this.getUser()
  },
  getUser() {
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
          useBalance: this.data.price
        })
      } else {
        const realAmount = ((this.data.price * 100 - this.data.userInfo.balance * 100 ) / 100).toFixed(2)
        this.setData({
          realAmount,
          useBalance: this.data.userInfo.balance
        })
      }
    } else {
      this.setData({
        realAmount: this.data.price,
        useBalance: 0
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
          useBalance: price
        })
      } else {
        const realAmount = ((price * 100 - this.data.userInfo.balance * 100 ) / 100).toFixed(2)
        this.setData({
          price,
          realAmount,
          useBalance: this.data.userInfo.balance
        })
      }
    } else {
      this.setData({
        price,
        realAmount: price,
        useBalance: 0
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
      success() {
        wx.cloud.database().collection('account').add({
          data: {
            amount: that.data.useBalance,
            type: "reduce"
          }
        })
        wx.cloud.callFunction({
          name: 'update_balance',
          data: {
            totalFee: -that.data.useBalance,
          }
        })

        wx.cloud.database().collection('orders').doc(that.data.order_id).update({
          data: {
            status: 1,
            useBalance: that.data.useBalance
          },
          success() {
            wx.showToast({
              title: '支付成功',
            })
            this.getUser()
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