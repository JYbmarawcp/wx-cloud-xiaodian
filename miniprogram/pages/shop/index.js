// pages/shop/index.js
const app = getApp()
Page({
  data: {
    coupons: [],
    userInfo: {}
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中~',
    })
    wx.cloud.database().collection('coupons').get().then(res => {
      this.setData({
        coupons: res.data
      })
    })
  },
  onShow: function () {
    wx.cloud.database().collection('users').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      this.setData({
        userInfo: res.data[0] || {}
      })
      wx.hideLoading()
    })
  },
  previewImage(event) {
    wx.previewImage({
      current: event.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: [event.currentTarget.dataset.img] // 需要预览的图片http链接列表
    })
  },
  addOrder(event) {
    wx.showLoading({
      title: '加载中~',
    })
    let index = event.currentTarget.dataset.index;
    let orderId = Date.now() + '' + Math.ceil(Math.random() * 10);
    const price = this.data.coupons[index].price;
    // 添加订单
    wx.cloud.database().collection('shop_orders').add({
      data: {
        orderId,
        goodMoney: price,
        goodName: this.data.coupons[index].name,
        goodId: this.data.coupons[index]._id,
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
          body: this.data.coupons[index].name,
          outTradeNo: orderId,
          totalFee: this.data.coupons[index].price * 100,
        }
      }).then(res => {
          this.pay(res.result.payment, price, index)
      })
    })
  },
  pay(payment, price, index) {
    var that = this;
    wx.requestPayment({
      ...payment,
      success(res) {
        wx.cloud.callFunction({
          name: 'update_balance',
          data: {
            point: price
          }
        })
        wx.cloud.database().collection('user_coupons').add({
          data: {
            orderId: that.data.order_id,
            name: that.data.coupons[index].ez_name,
            coupon_id: that.data.coupons[index]._id,
            status: 0, //未使用状态
            _createTime: +new Date(),
            _updateTime: +new Date(),
            endTime: +new Date() + 31536000000
          }
        }).then(res => {
          wx.cloud.database().collection('user_coupons').add({
            data: {
              orderId: that.data.order_id,
              name: that.data.coupons[index].ez_name,
              coupon_id: that.data.coupons[index]._id,
              status: 0, //未使用状态
              _createTime: +new Date(),
              _updateTime: +new Date(),
              endTime: +new Date() + 31536000000
            }
          }).then(res => {
            wx.cloud.database().collection('user_coupons').add({
              data: {
                orderId: that.data.order_id,
                name: that.data.coupons[index].ez_name,
                coupon_id: that.data.coupons[index]._id,
                status: 0, //未使用状态
                _createTime: +new Date(),
                _updateTime: +new Date(),
                endTime: +new Date() + 31536000000
              }
            }).then(res => {
              wx.cloud.database().collection('user_coupons').add({
                data: {
                  orderId: that.data.order_id,
                  name: that.data.coupons[index].ez_name,
                  coupon_id: that.data.coupons[index]._id,
                  status: 0, //未使用状态
                  _createTime: +new Date(),
                  _updateTime: +new Date(),
                  endTime: +new Date() + 31536000000
                }
              }).then(res => {
                wx.cloud.database().collection('shop_orders').doc(that.data.order_id).update({
                  data: {
                    status: 1,
                    _updateTime: +new Date(),
                  },
                  success(res) {
                    wx.redirectTo({
                      url: '/pages/paySuccess/index?orderId=' + that.data.order_id,
                    })
                    wx.showToast({
                      title: '支付成功',
                    })
                  }
                })
              })
            })
          })
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
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})