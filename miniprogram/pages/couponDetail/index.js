const app = getApp()
import {debounce} from "../../utils/common"
Page({
  data: {
    isReceived: false,
    userInfo: {},
    couponInfo: {}
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中~',
    })
    wx.cloud.database().collection('coupons').doc(options.id).get().then(res => {
      this.setData({
        couponInfo: res.data
      })
    })

    wx.cloud.callFunction({
      name: 'getUser',
    }).then(res => {
      this.setData({
        userInfo: res.result.userInfo
      })
      wx.hideLoading()
    })
  },
  onShow: function () {

  },
  async getPhoneNumber(e) {
    wx.showLoading({
      title: '加载中~',
    })
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      const result = await wx.cloud.callFunction({
        name: 'bind_mobile',
        data: {
          type: 'login',
          id: wx.cloud.CloudID(e.detail.cloudID)
        }
      })
      const phoneNumber = result.result.id.data.phoneNumber;
      let userInfo = this.data.userInfo;
      userInfo.phoneNumber = phoneNumber;
      this.setData({
        userInfo
      },() => {
        this.receiveCoupon();
      })
      if (this.data.userInfo._openid) {
        wx.cloud.database().collection('users').where({
          _openid: app.globalData.openid
        }).update({
          data: {
            phoneNumber: phoneNumber,
          }
        })
      } else {
        wx.cloud.database().collection('users').add({
          data: {
            phoneNumber: phoneNumber,
            balance: 0,
            point: 0
          }
        })
      }
      wx.showToast({
        title: '授权成功',
        icon: 'none'
      })
    } else {
      wx.hideLoading({
        complete: (res) => {
          wx.showToast({
              title: '用户拒绝，获取失败',
              icon: 'none'
          })
        }
      })
    }
  },
  receiveCoupon: debounce(function () {
    if (this.data.userInfo.phoneNumber) {
      wx.showLoading({
        title: '加载中~',
      })
      wx.cloud.database().collection('user_coupons').add({
        data: {
          name: this.data.couponInfo.ez_name,
          coupon_id: this.data.couponInfo._id,
          status: 0, //未使用状态
          _createTime: +new Date(),
          _updateTime: +new Date(),
          endTime: +new Date() + 2592000000
        }
      }).then(res => {
        this.setData({
          isReceived: true
        });
        wx.showModal({
          title: "温馨提示",
          content: "领取成功，可在“个人档案-优惠券”中查看~",
          showCancel: false,
          success: (res) => {
            wx.switchTab({
              url: '/pages/my/index'
            })
            // app.subscribeHandle(COUPON_NOTICE_BUTTON, {
            //   scene_type: "couponDetail"
            // });
          }
        });
        wx.hideLoading();
      })
    }
  })
})