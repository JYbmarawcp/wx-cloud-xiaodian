// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let couponsList;
  const nowDate = +new Date();
  await db.collection('user_coupons').where({
    status: 0
  }).get().then(res => {
    couponsList = res.data
  })
  couponsList.forEach(item => {
    if (item.endTime < nowDate) {
      db.collection('user_coupons').doc(item._id).update({
        data: {
          status: 2,
          _updateTime: +new Date(),
        }
      })
    }
  })
  return {
    OPENID: wxContext.OPENID
  }
}