<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true // 无缝循环轮播
    },
    autoPlay: {
      type: Boolean,
      default: true // 自动轮播
    },
    interval: {
      type: Number,
      default: 4000 // 轮播间隔
    }
  },
  data() {
    return {
      dots: []
    }
  },
  mounted() {
    setTimeout(() => {
      // 计算slider的宽度
      this._setSliderWidth()
      // 初始化
      this._initDots()
      this._initSlider()
    }, 20)
  },
  methods: {
    // 计算slider的宽度
    _setSliderWidth() {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // 无缝循环轮播的时候总宽度加两张图的宽度
      if (this.loop) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化  https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 允许横向滚动
        scrollY: false, // 不允许纵向滚动
        momentum: false, // 惯性
        snap: {
          loop: this.loop, // 无缝循环
          threshold: 0.3, // 阈值
          easing: { // 缓动函数
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function(t) {
              return t * (2 - t)
            }
          }
        },
        click: true
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
</style>