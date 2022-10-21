const innerAudioContext = wx.createInnerAudioContext({
  useWebAudioImplement: true
});
innerAudioContext.src = 'https://ss.hengyuwh.com/sss/ylgy/Sound/bgM.mp3';
innerAudioContext.volume = 0.55; //音量
innerAudioContext.autoplay = true;
innerAudioContext.onEnded(function (e) {
  innerAudioContext.play();
  console.log('重播');
})
Component({
  properties: {
    soundSwitch: {
      type: Boolean
    },
    modalName: {
      type: Boolean
    },
    maxLevels: {
      type: Number
    }
  },
  observers: {
    'modalName': function (e) {
      // console.log(e);
      if (e) {
        // console.log('失败了');
        innerAudioContext.volume = 0.4; //音量
        setTimeout(() => {
          innerAudioContext.volume = 0.7; //音量
        }, 3000);
      }
    }
  },
  data: {
    ShowSetting: false,
    bgSwitch: true, //背景音乐开关
    maxLevel: 5
  },
  methods: {
    /**
     * 打开/ 关闭 设置
     */
    switchSettingWindow(e) {
      let switchs = e.currentTarget.dataset.switch;
      // console.log(typeof(switchs));
      let settingObj = {
        ShowSetting: switchs === 'false' ? false : true
      }
      this.setData(settingObj)
    },
    bindSwitch(e) { //开关- 按钮监听
      let type = e.currentTarget.dataset.type;
      let SwitchObj = {
        [type]: e.detail.value
      };
      // console.log(app);
      switch (type) {
        case 'bgSwitch': //背景开关
          if (this.data.bgSwitch) innerAudioContext.pause();
          else innerAudioContext.play()
          wx.showToast({
            title: this.data.bgSwitch ? '关闭背景音乐' : '开启背景音乐',
            duration: 1700,
            icon: 'none',
            mask: true
          })
          // innerAudioContext.pause() 暂停  || innerAudioContext.play()  播放 || innerAudioContext.stop() 停止
          break;
        case 'soundSwitch': // 音效开关
          this.triggerEvent('bindsoundSwitch', e.detail.value)
          break;
        default:
          console.warn('warning')
          break;
      }
      this.setData(SwitchObj);
      // console.log(this.data);
    },
    /**
     * 设置最大关卡
     * @param {*} e 事件对象
     */
    maxLevelInp(e) {
      let valueNum = e.detail.value != '' ? Number(e.detail.value) : e.detail.value;
      let inpNum = {
        maxLevel: valueNum != '' ? (valueNum <= 0 ? 1 : valueNum > 20 ? 20 : valueNum) : ''
      };
      // console.log(inpNum.maxLevel);
      // this.triggerEvent('setMaxLevel',inpNum)
      this.setData(inpNum)
      return inpNum.maxLevel
    },
    /**
     * 确定 按钮 设置关卡
     */
    setMaxLevel() {
      let maxlevel = this.data.maxLevel;
      // console.log(maxlevel == this.properties.maxLevels);
      if (maxlevel != '') {
        this.setData({
          ShowSetting: false
        })
        if (maxlevel != this.properties.maxLevels) {
          this.triggerEvent('setMaxLevel', maxlevel);
          console.log('设置了最大');
        }
      } else {
        wx.showToast({
          title: '关卡不允许为空',
          icon: 'none',
          mask: true,
        })
      }
    }
  },
  options: {
    addGlobalClass: true
  }
})