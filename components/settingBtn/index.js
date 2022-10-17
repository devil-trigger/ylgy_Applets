const innerAudioContext = wx.createInnerAudioContext({ useWebAudioImplement: true});
innerAudioContext.src = 'https://ss.hengyuwh.com/sss/ylgy/Sound/bgM.mp3';
innerAudioContext.autoplay=true;
innerAudioContext.volume=0.75;//音量
Component({
  properties: {
    soundSwitch:{
      type:Boolean
    }
  },
  data: {
    ShowSetting: false,
    bgSwitch: true, //背景音乐开关
    // soundSwitch: false, //音效开关
  },
  methods: {
    /**
     * 打开/ 关闭 设置
     */
    switchSettingWindow(e) {
      let switchs=e.currentTarget.dataset.switch;
      // console.log(typeof(switchs));
      let settingObj={ShowSetting: switchs==='false'?false:true}
      this.setData(settingObj)
    },
    bindSwitch(e) { //开关- 按钮监听
      let type = e.currentTarget.dataset.type;
      let SwitchObj = {
        [type]: e.detail.value
      };
      // console.log(app);
      switch (type) {
        case 'bgSwitch'://背景开关
          if (this.data.bgSwitch) innerAudioContext.pause(); else innerAudioContext.play() 
          // innerAudioContext.pause() 暂停  || innerAudioContext.play()  播放
          // innerAudioContext.stop() // 停止
          break;
        case 'soundSwitch':// 音效开关
          this.triggerEvent('bindsoundSwitch',e.detail.value)
          break;
        default:
          console.warn('warning')
          break;
      }
      this.setData(SwitchObj);
      // console.log(this.data);
    }
  },
  options: {
    addGlobalClass: true
  }
})