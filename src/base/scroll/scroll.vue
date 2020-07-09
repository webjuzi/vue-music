<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
  props: {
    // 有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
    probeType: {
      type: Number,
      default: 1
    },
    // 作用：better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。但是自定义的 click 事件会阻止一些原生组件的行为，如 checkbox 的选中等，所以一旦滚动列表中有一些原生表单组件，推荐的做法是监听 tap 事件，如下。
    click: {
      type: Boolean,
      default: true
    },
    // 数据
    data: {
      type: Array,
      default: null
    },
    // 监听滑动
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 下拉到底部触发scrollToEnd
    pullup: {
      type: Boolean,
      default: false
    },
    // 是否滑动的时候隐藏键盘
    beforeScroll: {
      type: Boolean,
      default: false
    },
    // 初始化延时时间
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    setTimeout(() => {
      // 初始化
      this._initScroll()
    }, 20)
  },
  methods: {
    // 初始化
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // 当需要监听滑动的时候
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', pos => {
          me.$emit('scroll', pos)
        })
      }
      // 上拉到底部刷新数据
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          // console.log(this.scroll.y)
          // console.log('max:' + (this.scroll.maxScrollY))
          if (this.scroll.y <= this.scroll.maxScrollY - 5) {
            this.$emit('scrollToEnd')
            // this.scroll.maxScrollY += 200
          }
        })
      }
      // 是否滑动的时候隐藏键盘
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    // 方法代理
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    // 重置
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    // 滚动到
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 滚动到元素
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        // 初始化
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>
