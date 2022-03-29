// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('user_coupons').aggregate()
  .match({
    _openid: wxContext.OPENID,
    status: event.status
  })
  .lookup({
    from: 'coupons',
    localField: 'coupon_id',
    foreignField: '_id',
    as: 'couponRes',
  })
  .end()
}