// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.cloudPay.refund({
    "out_refund_no" : event.refundNum, // 商户退款单号
    "out_trade_no" : event.tradeNum, // 商户订单号
    "nonce_str" : "" + Date.now(), // 随机字符串号
    "sub_mch_id" : "1622543044", // 商户号
    "total_fee" : event.money, // 订单金额
    "refund_fee" : event.money, // 申请退款金额
  })
  return res
}