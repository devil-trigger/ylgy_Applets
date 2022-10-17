let gameOverSound= getApp().globalData.innerAudioContextSoundEffect;
Component({
  properties: {
    modalName:{
      type:Boolean
    },
    soundSwitch:{
      type:Boolean
    }
  },
  data: {},
  observers:{
    'modalName':function(e) {
      // console.log(e);
      if (e) {
        if (this.properties.soundSwitch) {//若音效为开
          gameOverSound.src='https://ss.hengyuwh.com/sss/ylgy/Sound/gameover.mp3';
          gameOverSound.play();
        }
      }
    }
  },
  methods: {
    restart(){
      this.triggerEvent('restart')
    }
  },
  options:{
    addGlobalClass: true
  }
})
