<template>
  <transition name="slide">
    <div class="user-set">
      <!-- 返回 -->
      <div class="back"
           @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="title">设置</div>
      <div class="list-wrapper">
        <ul class="list-ul">
          <li class="list-li" @click="callQQ">联系我们<span class="right-arrow"><i class="icon-back"></i></span></li>
          <li class="list-li" @click="ifUpdate">检查更新<span class="right-arrow"><i class="icon-back"></i></span></li>
        </ul>
      </div>
      <confirm ref="confirm" :text="confirmText" @confirm="yes" :confirmBtnText="confirmBtnText"></confirm>
      <top-tip ref="topTip">
        <div class="tip-title">
          <span class="text">{{ tipText }}</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import TopTip from 'base/top-tip/top-tip'
import Confirm from 'base/confirm/confirm'
import { getNewVersion } from 'api/userset'

export default {
  data() {
    return {
      version: '1.0.5', // 当前版本
      newVersion: '', // 最新版本
      tipText: '', // 顶部弹框文本
      confirmBtnText: '', // 确认框确认键文本
      confirmText: '' // 确认框提示文本
      // percent: 0 // 下载进度
    }
  },
  components: {
    TopTip,
    Confirm
  },
  created() {
    // 获取最新版本信息
    this._getNewVersion()
  },
  methods: {
    // 返回
    back() {
      this.$router.back()
    },
    // 确认按键
    yes() {
      if (this.confirmBtnText === '下载') {
        this.down()
      } else if (this.confirmBtnText === '跳转') {
        this.linkA()
      }
      // else if (this.confirmBtnText === '暂停') {
      //   this.stopDown()
      // } else if (this.confirmBtnText === '继续下载') {
      //   this.continueDown()
      // } else if (this.confirmBtnText === '安装') {
      //   this.install()
      // }
    },
    // 开始下载
    down() {
      this.confirmBtnText = '后台下载'
      this.confirmText = `正在下载......`
      this.$refs.confirm.show()
      var downUrl = 'http://www.zhouyongju.com/usr/themes/zhouyongju/resource/app/music/橘子音悦.apk'
      window.location.href = downUrl
    },
    // // 暂停下载
    // stopDown() {
    //   this.confirmBtnText = '继续下载'
    //   this.confirmText = `已经暂停：已经下载${this.percent}%`
    //   this.$refs.confirm.show()
    //   console.log('暂停下载')
    // },
    // // 继续下载
    // continueDown() {
    //   this.confirmBtnText = '暂停'
    //   this.confirmText = `正在下载：已经下载${this.percent}%`
    //   this.$refs.confirm.show()
    //   console.log('继续下载')
    // },
    // // 安装
    // install() {
    //   this.$refs.confirm.hide()
    //   console.log('安装')
    // },
    // 跳转到QQ会话窗口
    linkA() {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=85640610&site=qq&menu=yes')
    },
    // 显示确认框
    ifUpdate() {
      // 不是最新版本
      if (this.newVersion > this.version) {
        this.confirmText = `当前版本为${this.version},最新版本为${this.newVersion}，是否下载`
        this.confirmBtnText = '下载'
        this.$refs.confirm.show()
        return
      }
      // 否则为最新版本
      this.tipText = '当前版本已经是最新版本了'
      this.showTip()
    },
    // 获取最新版本信息
    _getNewVersion() {
      getNewVersion().then(res => {
        this.newVersion = res.data.newVersion
      })
    },
    // 显示顶部提示
    showTip() {
      this.$refs.topTip.show()
    },
    // QQ联系我
    callQQ() {
      this.confirmText = `是否跳转到与"85640610"的QQ会话窗口`
      this.confirmBtnText = `跳转`
      this.$refs.confirm.show()
    }
  }
  // watch: {
  //   percent(newPercent) {
  //     if (newPercent >= 100) {
  //       this.confirmBtnText = '安装'
  //     }
  //   }
  // }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.user-set
  position fixed
  top 0
  bottom 0
  z-index 101
  width 100%
  background $color-background
  max-width 540px !important
  min-width 320px !important
  margin 0 auto !important
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
  &.slide-enter, &.slide-leave-to, .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .title
    line-height 44px
    font-size 20px
    text-align center
    color #ffcd32
  .list-wrapper
    .list-ul
      width 100%
      padding 10px 20px
      .list-li
        padding 15px 0
        font-size 16px
        .right-arrow
          position absolute
          right 20px
          transform rotate(180deg)
          -ms-transform rotate(180deg) /* IE 9 */
          -moz-transform rotate(180deg) /* Firefox */
          -webkit-transform rotate(180deg) /* Safari 和 Chrome */
          -o-transform rotate(180deg) /* Opera */
  .tip-title
    text-align center
    padding 18px 0
    font-size 0
    .text
      font-size $font-size-medium
      color $color-text
</style>
