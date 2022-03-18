// app.js
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'yzjs-6gsqlx7v8a6f5ee4',
        traceUser: true,
      });
    }
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log("检测到新版本？" + res.hasUpdate);
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    });
    this.globalData = {};
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: 'yzjs-6gsqlx7v8a6f5ee4'
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {
      this.globalData.openid = resp.result.openid;
   })
  }
});
