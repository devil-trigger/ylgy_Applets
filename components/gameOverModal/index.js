Component({
  properties: {
    modalName:{
      type:Boolean
    }
  },
  data: {},
  methods: {
    restart(){
      this.triggerEvent('restart')
    }
  },
  options:{
    addGlobalClass: true
  }
})
