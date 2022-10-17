Component({
  properties: {

  },
  data: {  },
  methods: {
    tapBtn(e){
      this.triggerEvent(e.currentTarget.dataset.taptype);
    }
  },
  options: {
    addGlobalClass: true
  }
})
