const answers = require('../../utils/answers.js')

Page({
  data: {
    answer: '再试一次'
  },
  onShow: function () {
    let random = Math.ceil(Math.random() * 90)
    this.setData({
      answer: answers[random]
    })
  }
})