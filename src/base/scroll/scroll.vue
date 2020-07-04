<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
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
