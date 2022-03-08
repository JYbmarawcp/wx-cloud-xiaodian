// pages/buy/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch1Checked: false,
    price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  switch1Change() {
    this.setData({
      switch1Checked: !this.data.switch1Checked
    })
  },
  changeInput(e) {
    const price = Number(e.detail.value);
    this.setData({
      price
    })
  },
  addOrder() {
    let orderId = Date.now() + '' + Math.ceil(Math.random() * 10);
    // 添加订单
    wx.cloud.database().collection('orders').add({
      data: {
        orderId,
        goodMoney: this.data.price,
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
          totalFee: this.data.price * 100,
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