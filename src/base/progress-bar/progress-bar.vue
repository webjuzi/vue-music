<template>
<!-- 播放器进度条组件 -->
  <!-- 总长度 -->
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!-- 已播放进度 -->
      <div class="progress" ref="progress"></div>
      <!-- 小球 -->
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouch"
             @touchend="progressTouchEnd">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom'

const progressBtnWidth = 16 // 小球的宽度
const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    // 创建组件的时候创建一个对象用于共享一些数据用
    this.touch = {}
  },
  methods: {
    // 小球按下时候触发
    progressTouchStart(e) {
      // 做一个标记表示已经按下了
      this.touch.initiated = true
      // 按下的X坐标
      this.touch.startX = e.touches[0].pageX
      // 按下的时候小球已经在进度条上偏移的距离
      this.touch.left = this.$refs.progress.clientWidth
    },
    // 拖动小球触发
    progressTouch(e) {
      if (!this.touch.initiated) {
        return
      }
      // 偏移的距离
      const deltaX = e.touches[0].pageX - this.touch.startX
      // 小球应该到达的位置，并限制范围
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      // 设置小球和已播放进度的变化
      this._offset(offsetWidth)
    },
    // 松手触发
    progressTouchEnd() {
      // 重置标记为false
      this.touch.initiated = false
      // 获取当前位置的百分比，传给外面做响应
      this._triggerPercent()
    },
    // 点击进度条
    progressClick(e) {
      // 1.这种方法点击到小圆点按钮的时候，e.offsetX获取不对
      // 1.this._offset(e.offsetX)
      // 设置小球和已播放进度的变化
      const rect = this.$refs.progressBar.getBoundingClientRect()
      // 点击的位置的x减去进度条到左边平布边缘的距离
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      // 获取到点击位置的百分比，传给外面做响应
      this._triggerPercent()
    },
    // 设置小球和已播放进度的变化
    _offset(offsetWidth) {
      // 设置已播放进度的变化
      this.$refs.progress.style.width = `${offsetWidth}px`
      // 设置小球
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0 )`
    },
    // 获取当前位置的百分比，传给外面做响应
    _triggerPercent() {
      // 获取进度总长度
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // 已播放 / 总长度 = 百分比
      const percent = this.$refs.progress.clientWidth / barWidth
      // 子传父高速外面我拖动了进度条小球
      this.$emit('percentChange', percent)
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        // 获取进度总长度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 获取已播放进度应该显示的长度
        const offsetWidth = newPercent * barWidth
        // 设置小球和已播放进度的变化
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>