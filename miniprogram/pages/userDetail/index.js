Page({
  data: {
    userInfo: {},
    type: 0,
    realBalance: "",
    amount: "",
    drama: ""
  },
  onLoad(options) {
    wx.cloud.database().collection('users').where({
      _openid: options.openid,
    }).get().then(res => {
      this.setData({
        userInfo: res.data[0]
      })
    })
  },
  changeRadio(e) {
    this.setData({
      type: e.currentTarget.dataset.checked
    })
  },
  reduceInput(e) {
    const amount = Number(e.detail.value);
    if (amount>this.data.userInfo.balance) {
      wx.showToast({
        icon: "none",
        title: '不能超过用户最大余额！',
      })
      this.setData({
        amount: this.data.userInfo.balance,
        realBalance: 0
      })
      return;
    }
    this.setData({
      amount,
      realBalance: this.data.userInfo.balance-amount
    })
  },
  changeDrama(e) {
    this.setData({
      drama:e.detail.value
    })
  },
  reduceAmount() {
    if (!this.data.amount) {
      wx.showToast({
        icon: "none",
        title: '请输入金额',
      })
      return;
    }
    if (!this.data.drama) {
      wx.showToast({
        icon: "none",
        title: '请输入消费内容',
      })
      return;
    }
    wx.showModal({
      content: `确定要扣除储蓄卡${this.data.amount}元吗？`,
      success: (res) => {
        if (res.confirm) {
          this.addOrder();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  addOrder() {
    wx.showLoading({
      title: '加载中~',
    })
    let orderId = Date.now() + '' + Math.ceil(Math.random() * 10);
    // 添加订单
    wx.cloud.database().collection('orders').add({
      data: {
        drama: this.data.drama,
        nickName: this.data.userInfo.nickName,
        orderId,
        goodMoney: 0,
        status: 0, //未支付状态
        _createTime: +new Date(),
        _updateTime: +new Date(),
      }
    }).then(res => {
      this.setData({
        order_id: res._id
      })
      // 实际收入
      let income = this.data.amount * this.data.userInfo.discount;
      // 全余额支付
      wx.cloud.database().collection('account').add({
        data: {
          amount: this.data.amount,
          type: "reduce",
          _updateTime: +new Date(),
        }
      })
      wx.cloud.callFunction({
        name: 'update_balance',
        data: {
          totalFee: -this.data.amount,
        }
      })
      wx.cloud.database().collection('orders').doc(this.data.order_id).update({
        data: {
          status: 1,
          useBalance: this.data.amount,
          income: income,
          _updateTime: +new Date(),
        },
        success() {
          wx.showToast({
            title: '扣款成功',
          })
        }
      })
    })
  },
  addAmount() {

  }
})