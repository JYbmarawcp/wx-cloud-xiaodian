const app = getApp()
import {debounce} from "../../utils/common"
Page({
  data: {
    isReceived: false,
    userInfo: {},
    couponInfo: {},
    userCouponNum: 0,
    userList: ["oQ6gZ5dUTKmUPXEkvJ4AO9Qyp10I", "oQ6gZ5Wpyu10v_9q8-TMaj5Mw1Qg"]
  },
  onLoad: function (options) {
    if(options.collect){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    wx.showShareMenu({
      withShareTicket: true
    })
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
      console.log(app.globalData.scene);
      wx.cloud.database().collection('user_coupons').where({
        _openid: app.globalData.openid,
        coupon_id: options.id,
        status: 0
      }).get().then(res => {
        this.setData({
          userCouponNum: res.data.length || 0
        })
      })
      if (app.globalData.scene === 1010) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      this.setData({
        userInfo: res.result.userInfo,
        scene: app.globalData.scene
      })
      wx.hideLoading()
    })
  },
  onShow: function () {

  },
  onAddToFavorites(res) {
    return {
      title: '禁止收藏哦',
      query: 'collect=ture',
    }
  },
  onShareAppMessage() {
    let path;
    if (this.data.userList.includes(this.data.userInfo._openid)) {
      path = "/pages/couponDetail/index?id=" + this.data.couponInfo._id;
    } else {
      path = "/pages/couponDetail/index?id=" + "123";
    }
    console.log(path);
    return {
      title: "影子剧社送你一张专享优惠券~",
      imageUrl: "https://udh.oss-cn-hangzhou.aliyuncs.com/d8ef5cac-f664-42fa-84ba-7dec47e72a285786482logo.jpg",
      path
    };
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
    if (this.data.couponInfo.limit <= this.data.userCouponNum) {
      wx.showToast({
        icon: "none",
        title: '您已领取过了哦~',
      })
      return;
    }
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