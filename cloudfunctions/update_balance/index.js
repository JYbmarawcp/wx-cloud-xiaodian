// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _openid = event.openid || wxContext.OPENID
  const _ = db.command
  db.collection('users').where({
    _openid: _openid
  }).update({
    data: {
      balance: _.inc(event.totalFee),
      point: _.inc(event.point),
      discount: event.discount
    }
  }).then(res => {
    return {
      res,
      success: true
    }
  })
}