import {
  iconsArr
} from "../../utils/util";
const app = getApp();
const playSoundEffect = app.playSoundEffect; //音效方法
Page({
  data: {
    scene: [], //元数据  （渲染的核心数据）
    icons: iconsArr, //所有的点击图标的icon列表 (数据在 util.js 编辑)
    maxLevel:5, //最大关卡
    level: 1, // 等级(当前关卡)
    queue: [], //被选中的牌的数据
    sortedQueue: {}, //排序内容
    finished: false, //是否完成
    tipText: '',
    animating: false, //动画开关
    levelList: [], //选关列表
    modalName: false, //游戏失败模态框
    soundSwitch: true, //游戏音效开关
    wash:true,//棋盘 洗牌
  },

  onLoad: function (e) {
    let levelList = new Array();
    for (let index = 0; index < this.data.maxLevel; index++) {
      levelList.push(`第 ${index+1} 关`)
    }
    this.setData({
      scene: this.makeScene(1), //默认第一关 (初始化)
      levelList, //关卡选择列表
    })
    this.checkCover(); //附加阴影
    // console.log(this.data.icons);
    this.watchData(); //数据监听
  },
  /**
   * 监听数据
   */
  watchData() {
    let that = this;
    app.watch(this, { // 队列区排序
      queue: function (queue) {
        // console.log(e);
        const cache = {};
        for (const symbol of queue) { //遍历
          // console.log(symbol);
          if (cache[symbol.icon]) {
            cache[symbol.icon].push(symbol);
          } else {
            cache[symbol.icon] = [symbol];
          }
        }
        const temp = [];
        for (const symbols of Object.values(cache)) {
          temp.push(...(symbols));
        }
        const updateSortedQueue = {};
        let x = 50;
        // 拿到更新后的队列区数据，计算权重
        for (const symbol of temp) {
          updateSortedQueue[symbol.id] = x;
          x += 100;
        }
        that.setData({
          sortedQueue: updateSortedQueue
        })
        // 检查覆盖情况
        that.checkCover(that.data.scene);
      }
    })
  },
  /**
   * 关卡切换  ----- 选择器监听
   * @param {*} e 事件对象
   */
  bindPickerChange(e) {
    // console.log(e.detail.value);
    if (this.data.level==(Number(e.detail.value)+1)) return;//选择的关卡与当前关卡相等
    this.levelUp(Number(e.detail.value))
  },
  /**
   * 生成随机id
   * @param {*} len id长度
   */
  randomString(len) {
    const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomId = '';
    while (len >= 0) {
      randomId += pool[Math.floor(pool.length * Math.random())];
      len--;
    }
    return randomId;
  },
  /**
   * 延时函数 
   * @param {*} timeout 倒计时time
   */
  waitTimeout(timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  },
  /**
   *  核心算法-----------------------------------------warning---------------------------------------------------------
   * @param {*} level 关卡
   */
  makeScene(level) {
    const curLevel = Math.min(this.data.maxLevel, level); // 获取当前关卡
    const iconPool = this.data.icons.slice(0, 3 * curLevel); // 获取当前关卡应该拥有的icon数量
    // 算出偏移量范围具体细节范围
    const offsetPool = [0, 25, -25, 50, -50].slice(0, 1 + curLevel);
    // 最终的元数据数组
    const scene = [];
    // 确定范围
    // 在一般情下 translate 的偏移量，如果是百分比的话，是按照自身的宽度或者高度去计算的，所以最大的偏移范围是百分800%
    // 然后通过Math.random 会小于百分之八百
    // 所以就会形成当前区间的随机数
    const range = [
      [2, 6],
      [1, 6],
      [1, 7],
      [0, 7],
      [0, 8],
    ][Math.min(4, curLevel - 1)];
    const randomSet = (icon) => {
      // 求偏移量
      const offset = offsetPool[Math.floor(offsetPool.length * Math.random())];
      // 偏移求列数
      const row = range[0] + Math.floor((range[1] - range[0]) * Math.random());
      // 求偏移行数
      const column = range[0] + Math.floor((range[1] - range[0]) * Math.random());
      // console.log(offset, row, column);
      // 生成元数据对象
      scene.push({
        isCover: false, // 默认都是没有被覆盖的
        status: 0, // 是否被选中的状态
        icon, // 图标
        id: this.randomString(4), // 生成随机id
        x: column * 100 + offset, //x 坐标
        y: row * 100 + offset, // y坐标
      });
    };

    // 如果级别高了就加点icon 花哨一点
    let compareLevel = curLevel;
    // console.log(compareLevel);
    while (compareLevel > 0) {
      iconPool.push(...iconPool.slice(0, Math.min(10, 2 * (compareLevel - 5))));
      compareLevel -= 5;
    }
    // console.log(compareLevel, iconPool);
    // 生成元数据，初始状态下 iconPool的内容少生 随着增加，就会越来越难
    for (const icon of iconPool) {
      for (let i = 0; i < 6; i++) {
        randomSet(icon);
      }
    }
    // console.log(scene);
    return scene; // 返回元数据
  },
  /**
   * 洗牌--
   * @param {*} level 目前等级
   * @param {*} scene 当前牌数据
   */
  washScene(level, scene) {
    // 洗牌的随机算法逻辑与初始化相同
    const updateScene = scene.slice().sort(() => Math.random() - 0.5);
    const offsetPool = [0, 25, -25, 50, -50].slice(0, 1 + level);
    const range = [
      [2, 6],
      [1, 6],
      [1, 7],
      [0, 7],
      [0, 8],
    ][Math.min(4, level - 1)];

    const randomSet = (symbol) => {
      const offset = offsetPool[Math.floor(offsetPool.length * Math.random())];
      const row = range[0] + Math.floor((range[1] - range[0]) * Math.random());
      const column = range[0] + Math.floor((range[1] - range[0]) * Math.random());
      symbol.x = column * 100 + offset;
      symbol.y = row * 100 + offset;
      symbol.isCover = false;
    };
    //遍历初始化数组
    for (const symbol of updateScene) {
      // 碰见已经选中的不处理
      if (symbol.status !== 0) continue;
      randomSet(symbol);
    }
  },
  /**
   * 检查是否被覆盖(给低层级的图片附加阴影)
   * @param {*} value 
   */
  checkCover(value) {
    const updateScene = value ? value.slice() : this.data.scene.slice(); // 深拷贝一份
    // 是否覆盖算法
    // 遍历所有的元数据
    // 双重for循环来找到每个元素的覆盖情况
    for (let i = 0; i < updateScene.length; i++) {
      // 当前item对角坐标
      const cur = updateScene[i];
      // 先假设他都不是覆盖的
      cur.isCover = false;
      // 如果status 不为0 说明已经被选中了，不用再判断了
      if (cur.status !== 0) continue;
      // 拿到坐标
      const {
        x: x1,
        y: y1
      } = cur;
      // 为了拿到他们的对角坐标，所以要加上100
      //之所以要加上100 是由于 他的总体是800% 也就是一个格子的换算宽度是100
      const x2 = x1 + 100,
        y2 = y1 + 100;
      // 第二个来循环来判断他的覆盖情况
      for (let j = i + 1; j < updateScene.length; j++) {
        const compare = updateScene[j];
        if (compare.status !== 0) continue;
        const {
          x,
          y
        } = compare;
        // 处理交集也就是选中情况
        // 两区域有交集视为选中
        // 两区域不重叠情况取反即为交集
        if (!(y + 100 <= y1 || y >= y2 || x + 100 <= x1 || x >= x2)) {
          // 由于后方出现的元素会覆盖前方的元素，所以只要后方的元素被选中了，前方的元素就不用再判断了
          // 又由于双层循环第二层从j 开始，所以不用担心会重复判断
          cur.isCover = true;
          break;
        }
      }
    }
    this.setData({
      scene: updateScene
    })
  },
  /**
   * 弹出 - 按钮组
   */
  pop() {
    // 若选中队列中没有数据那么就退出
    if (!this.data.queue.length) return;
    const updateQueue = this.data.queue.slice();
    const symbol = updateQueue.shift();
    if (!symbol) return;
    const find = this.data.scene.find((s) => s.id === symbol.id);
    if (find) {
      // 随机一个位置
      // queue = updateQueue;
      find.status = 0;
      find.x = 100 * Math.floor(8 * Math.random());
      find.y = 700;
      this.setData({
        queue: updateQueue,
        [find.status]: 0,
        [find.x]: 100 * Math.floor(8 * Math.random()),
        [find.y]: 700
      })
      playSoundEffect({
        src: 'withdraw',
        trigger: this.data.soundSwitch
      })
      // 遮挡检测
      this.checkCover(this.data.scene);
    }
  },
  /**
   * 撤销 - 按钮组
   */
  undo() {
    // 和弹出相同逻辑
    // 只是返回的位置为原来位置
    if (!this.data.queue.length) return;
    const updateQueue = this.data.queue.slice();
    const symbol = updateQueue.pop();
    if (!symbol) return;
    const find = this.data.scene.find((s) => s.id === symbol.id);
    if (find) {
      // queue = updateQueue;
      this.setData({
        queue: updateQueue,
        [find.status]: 0
      })
      find.status = 0;
      // console.log(find);
      // withdraw
      playSoundEffect({
        src: 'withdraw',
        trigger: this.data.soundSwitch
      })
      this.checkCover(this.data.scene);
    }
  },
  /**
   * 洗牌 - 按钮组
   */
  wash() {
    this.checkCover(this.washScene(this.data.level, this.data.scene));
    this.setData({
      wash:!this.data.wash
    })
    playSoundEffect({
      src: 'xipai',
      trigger: this.data.soundSwitch
    })
  },
  /**
   * 下一关  & 关卡选择核心函数
   */
  levelUp(e) {
    // console.log(e);
    let level = typeof (e) == 'number' ? e : this.data.level
    if (typeof (e) != 'number') playSoundEffect({src: 'next',trigger: this.data.soundSwitch});
    if (level >= this.data.maxLevel) return;
    // this.data.finished = false;
    // this.data.queue = [];
    this.setData({
      level: level + 1,
      queue: [],
      finished: false
    })
    // 初始化场景并且检查是否被覆盖
    // console.log(this.data.level);return
    this.checkCover(this.makeScene(this.data.level));
  },
  /**
   * 重开
   */
  restart() {
    // 初始化内容
    this.setData({
      queue: [],
      level: 1,
      finished: false,
      modalName: false, //关闭模态框（gameover）
      animating: false
    })
    // 第一关初始化，并开启遮挡检查
    this.checkCover(this.makeScene(1));
  },
  /**
   * 点击 图标，加入选中框 （ ---------------- 核心点击游戏功能 ------------------ ）
   */
  async clickSymbol(e) {
    // console.log(e);return
    let idx = e.currentTarget.dataset.index;
    // 若已经完成了，就不处理
    if (this.data.finished || this.data.animating) return;
    // 拷贝一份Scene
    const symbol = this.data.scene[idx];

    // 覆盖了的和已经在队列里的也不处理
    if (symbol.isCover || symbol.status !== 0) return;
    //置为可以选中状态
    symbol.status = 1;
    this.setData({
      [symbol.status]: 1
    })
    // console.log(this.data.queue);
    let queue = this.data.queue.slice(0);
    queue.push(symbol);
    // console.log(queue);
    this.setData({
      animating: true, // 制造动画效果中防止点击
      queue, //置为可以选中状态
    })
    // console.log(symbol);
    // console.log(this.data.queue);
    await this.waitTimeout(300);
    // 拿到与他匹配的所有icon
    const filterSame = this.data.queue.filter((sb) => sb.icon === symbol.icon);

    playSoundEffect({
      src: 'card_select',
      trigger: this.data.soundSwitch
    })
    // console.log(filterSame);
    // 选中的三个配对成功表示已经是三连了 (达成游戏胜利条件)
    if (filterSame.length === 3) {
      // 由于icon的类型一样，留下队列中的不一样的剩余内容重新赋值
      // this.data.queue = this.datat.queue.filter((sb) => sb.icon !== symbol.icon);
      playSoundEffect({
        src: 'card_right',
        trigger: this.data.soundSwitch
      })
      this.setData({
        queue: this.data.queue.filter((sb) => sb.icon !== symbol.icon)
      })
      // 隐藏iocn，dom ----------------------------------------------------------
      for (const sb of filterSame) {
        const find = this.data.scene.find((i) => i.id === sb.id);
        // 将他们的状态变为2 通过opacity 属性 来隐藏icon
        if (find) find.status = 2;
        // console.log(find);
      }
    }
    // 当格子占满 ---------- game over 游戏失败
    if (this.data.queue.length === 7) {
      this.setData({
        modalName: true
      })
      return
    }
    if (!this.data.scene.find((s) => s.status !== 2)) {
      // 如果完成所有关卡，那就过了所有关了
      if (this.data.level === this.data.maxLevel) {
        wx.showToast({
          title: '已完成所有关卡',
          duration: 2000,icon:'none',
          mask: true,
        })
        playSoundEffect({
          src: 'victory',
          trigger: this.data.soundSwitch
        })
        this.setData({
          queue: []
        })
        setTimeout(() => {
          this.restart();//回到第一关
        }, 2000);
        return;
      }
      //否则加一关 ,并使内容重新初始化
      // this.setData({
      //   level:this.data.level + 1,
      //   queue: []
      // })
      this.levelUp({}); //下一关
      // this.checkCover(this.makeScene(this.data.level));
      // console.log('ssss');
    } else this.checkCover(this.data.scene); // 处理覆盖情况
    // 动画结束
    this.setData({
      animating: false
    })
  },
  onReady: function () {},
  // 生命周期函数--监听页面显示
  onShow: function () {},
  // 生命周期函数--监听页面隐藏
  onHide: function () {},
  //生命周期函数--监听页面卸载
  onUnload: function () {},
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},
  //用户点击右上角分享
  onShareAppMessage: function () {},
  /**
   * 音效开关
   * @param {*} e 事件对象
   */
  bindsoundSwitch(e) {
    // console.log(e.detail);
    if (e.detail) console.log('开启音效');
    else console.log('关闭音效');
    this.setData({
      soundSwitch: e.detail
    });
    wx.showToast({
      title: e.detail?'开启音效':'关闭音效',
      icon: 'none',
      mask: true,
    })
  },
  /**
   * 设置最大关卡
   * @param {*} e 事件对象
   */
  setMaxLevel(e){
    console.log(e.detail);
    let levelList = new Array();
    for (let index = 0; index < e.detail; index++) {
      levelList.push(`第 ${index+1} 关`)
    }
    this.setData({
      maxLevel:e.detail,
      levelList
    })
// console.log(this.data.levelList);
  }
})