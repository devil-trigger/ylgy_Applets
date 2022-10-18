const playSoundEffect = getApp().playSoundEffect; //音效方法
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
      if (e) {//若打开了模态框
        // if (this.properties.soundSwitch) {//若音效为开
        //   gameOverSound.src='https://ss.hengyuwh.com/sss/ylgy/Sound/gameover.mp3';
        //   gameOverSound.play();
        // }
        playSoundEffect({
          src:'gameover',
          trigger:this.properties.soundSwitch
        })
      }
    }
  },
  methods: {
    restart(){
      this.triggerEvent('restart');
    },
  },
  options:{
    addGlobalClass: true
  }
})
