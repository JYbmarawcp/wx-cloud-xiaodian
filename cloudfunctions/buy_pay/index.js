// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : event.body, // 商品描述
    "outTradeNo" : event.outTradeNo, // 订单号
    "spbillCreateIp" : "127.0.0.1",
    "subMchId" : "1622859044", // 商户号
    "totalFee" : event.totalFee, // 订单金额
    "envId": "yzjs-6gsqlx7v8a6f5ee4", 
    "functionName": "pay_cb"
  })
  return res
}