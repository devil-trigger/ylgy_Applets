App({
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
  },
  watch: function (ctx, obj) {
    Object.keys(obj).forEach(key => {
      this.observer(ctx.data, key, ctx.data[key], function (value) {
        obj[key].call(ctx, value)
      })
    })
  },
  /**
   * 播放音效 (选牌、3连、洗牌、游戏结束 )
   * @param {*} params 参数（src、trigger 判断）
   */
  playSoundEffect:function (params) {
    let audios=wx.createInnerAudioContext();
    audios.volume=0.63;//音量
    // audios.stop();
    //https://ss.hengyuwh.com/sss/ylgy/Sound/gameover.mp3
    audios.src=`https://ss.hengyuwh.com/sss/ylgy/Sound/${params.src}.mp3`;
    if (params.trigger) audios.play(); else audios.volume=0;
  },
// 监听属性，并执行监听函数
observer: function (data, key, val, fn) {
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      fn && fn(newVal)
      val = newVal
    },
  })
},
  globalData: {
    // innerAudioContextSoundEffect:wx.createInnerAudioContext()
    // userInfo: null
  }
})
