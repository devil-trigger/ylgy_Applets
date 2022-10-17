Component({
  properties: {
    level:{
      type:String
    },
    levelList:{
      type:Array
    }
  },
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 监听选择器 并传值
     * @param {*} e 事件对象
     */
    bindPickerChange(e){
      this.triggerEvent('bindPickerChange',e.detail)
    }
  },
  options:{
    addGlobalClass: true
  }
})
