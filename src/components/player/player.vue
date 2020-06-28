<template>
  <div class="player" v-show="playList.length > 0">
    <!-- 大播放器 -->
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景图 -->
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 主体 -->
        <div class="middle" ref="lyricList"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img  :src="currentSong.image" alt="" class="image">
              </div>
            </div>
            <!-- CD下面简易歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <!-- 全屏歌词列表 -->
          <scroll class="middle-r" ref="lysrcList"
                  :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line, index) in currentLyric.lines" :key="index">
                   {{ line.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- CD唱片下面小圆点 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <!-- 左边时间 -->
            <span class="time time-l">{{ format(currentTime) }}</span>
            <!-- 进度 -->
            <div class="progress-bar-warpper">
              <!-- 引入进度条组件 -->
              <progress-bar :percent="percent"
                            @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <!-- 右边时间 -->
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <!-- 播放方式 -->
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <!-- 上一曲 -->
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <!-- 暂停、开始 -->
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <!-- 下一曲 -->
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <!-- 收藏 -->
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 底部迷你播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <!-- 左侧cd图 -->
        <div class="icon">
          <img  :src="currentSong.image" alt="" width="40" height="40" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <!-- 控制按钮 -->
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i :class="miniInco" @click.stop="togglePlaying" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 播放音乐 -->
    <audio :src="currentSong.url" ref="audio"
          @canplay="ready"
          @error="error"
          @timeupdate="updateTime"
          @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

// 根据浏览器选择transform的名称和动画时间
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  data() {
    return {
      songReady: false, // 未加载好歌曲按钮变灰
      currentTime: null, // 歌曲播放进度
      currentLyric: null, // 处理后的歌词
      currentLineNum: 0, // 第几句歌词高亮
      currentShow: 'cd', // 默认显示cd
      playingLyric: '' // CD下面的歌词
    }
  },
  created() {
    // console.log(this.currentSong)
    // 定义一个touch对象，用来储存滑动时候的一些公用值
    this.touch = {}
  },
  components: {
    // 大播放器进度条
    ProgressBar,
    // 迷你播放器进度条
    ProgressCircle,
    // 滚动组件
    Scroll
  },
  computed: {
    // 计算应该显示的图标（播放状态）
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // 迷你播放器的播放状态图标
    miniInco() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    // 播放器cd样式
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    // 计算播放进度百分比
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    // 播放模式图标切换
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    // 混入Vuex
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    // 切换mini播放器
    back() {
      this.setFullScreen(false)
    },
    // 切换全屏播放器
    open() {
      this.setFullScreen(true)
    },
    // 动画钩子，切换播放器CD唱片动画
    enter(el, done) {
      // 获取要移动的位置和比例
      const {x, y, scale} = this._getPosAndScale()
      // 定义动画
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      // 配置动画参数
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      // 调用接口
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    // 开始移动到迷你播放器
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    // 定义动画
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    // 开始移动到达播放器
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 获取要移动的位置和比例
    _getPosAndScale() {
      // 迷你播放器的宽度
      const targetWidth = 40
      // 迷你播放器中心点离左侧的宽度
      const paddingLeft = 40
      // 迷你播放器中心点离底部的宽度
      const paddingBottom = 30
      // 大播放器的Top
      const paddingTop = 80
      // 大播放器的宽度
      const width = window.innerWidth * 0.8
      // 大小播放器图片比例
      const scale = targetWidth / width
      // x轴相距的距离
      const x = -(window.innerWidth / 2 - paddingLeft)
      // y轴相距的距离
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    // 切换播放状态的Vuex
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        // 暂停时候暂停歌词的滚动
        this.currentLyric.togglePlay()
      }
    },
    // 上一曲
    prev() {
      // 未加载完当前歌曲信息
      if (!this.songReady) {
        return
      }
      // 处理只有一首歌点上一曲
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        // 如果在暂停状态下切歌则开始播放
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      // 从新设置为false
      this.songReady = false
    },
    // 下一曲
    next() {
      // 未加载完当前歌曲信息
      if (!this.songReady) {
        return
      }
      // 处理只有一首歌点下一曲
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        // 如果在暂停状态下切歌则开始播放
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      // 从新设置为false
      this.songReady = false
    },
    // 单曲循环，重新播放
    loop() {
      // 时间切换到0
      this.$refs.audio.currentTime = 0
      // 播放
      this.$refs.audio.play()
      // 重置歌词进度
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 是否加载完，否的情况下不能切歌
    ready() {
      this.songReady = true
    },
    // 在歌曲未加载出来触发
    error() {
      this.songReady = true
    },
    // 更新播放进度
    updateTime(e) {
      // console.log(e.target.currentTime)
      this.currentTime = e.target.currentTime
    },
    // 转换时间格式
    format(interval) {
      // 向下取整
      interval = interval | 0
      // 分
      const minuter = this._pad(interval / 60 | 0)
      // 秒
      const second = this._pad(interval % 60)
      return `${minuter}:${second}`
    },
    // 个位数补0
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    // 接收子组件传递过来的拖动进度
    onProgressBarChange(percent) {
      // 设置当前进度对应的秒数
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      // 如果在暂停状态下切歌则开始播放
      if (!this.playing) {
        this.togglePlaying()
      }
      // 切换进度的时候更新歌词滚动的进度
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // 切换播放状态
    changeMode() {
      const mode = (this.mode + 1) % 3
      // 设置mode
      this.setMode(mode)
      let list = null
      // 随机播放打乱列表
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        // 单曲循环和列表循环不需要打乱
        list = this.sequenceList
      }
      this.setPlayList = list
      // 切换列表保证当前歌曲不变
      this.resetCurrentIndex(list)
    },
    // 切换列表保证当前歌曲不变
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 当前歌曲播放完毕
    end() {
      // 判断是否是单曲循环模式
      if (this.mode === playMode.loop) {
        // 单曲循环重新播放
        this.loop()
      } else {
        // 下一首
        this.next()
      }
    },
    // 处理歌词
    getLyric() {
      let lyric = this.currentSong.lyric
      this.currentLyric = new Lyric(lyric, this.handleLyric)
      if (this.playing) {
        this.currentLyric.play()
      }
      // console.log(this.currentLyric)
    },
    // 当前音乐是第几句歌词
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum
      // console.log(this.currentLineNum)
      // 滚动歌词
      if (lineNum > 6) {
        let lineEl = this.$refs.lyricLine[lineNum - 6]
        this.$refs.lysrcList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lysrcList.scrollTo(0, 0, 1000)
      }
      // 当前的歌词
      this.playingLyric = txt
    },
    // 手指按下
    middleTouchStart(e) {
      // 做一个初始标志，表示按下了
      this.touch.initiated = true
      // 按下的X,Y坐标
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    // 手指移动
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      // X,Y移动的距离
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // Y周移动距离大于X轴移动距离就什么都不做
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      // cd页面left=0  歌词页面left=一个屏幕的宽度
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      // [0, left] 移动的距离
      const offsetwidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      // 滑动跟随
      this.$refs.lyricList.style[transform] = `translate3d(${offsetwidth}px, 0, 0)`
      // 滑动距离和屏幕宽度的百分比
      this.touch.percent = Math.abs(offsetwidth / window.innerWidth)
      this.$refs.lyricList.style[transitionDuration] = 0
      // 透明度
      // this.$refs.middleL.style.opacity = 1 - this.touch.percent
      // this.$refs.middleL.style[transitionDuration] = 0
    },
    // 手指离开
    middleTouchEnd() {
      // 判断停留在那里
      let offsetwidth = 0
      // 向右滑动
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          // 滑动距离大于10%，移动到歌词页面
          offsetwidth = -window.innerWidth
          this.currentShow = 'lyric'
        } else {
          // 否则返回
          offsetwidth = 0
        }
        // 向左滑动
      } else {
        if (this.touch.percent < 0.9) {
          // 滑动距离大于10%，移动到CD页面
          offsetwidth = 0
          this.currentShow = 'cd'
        } else {
          // 否则返回
          offsetwidth = -window.innerWidth
        }
      }
      // 根据最终确定的offsetwidth移动
      this.$refs.lyricList.style[transform] = `translate3d(${offsetwidth}px, 0, 0)`
      // 动画时间
      this.$refs.lyricList.style[transitionDuration] = '300ms'
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  },
  watch: {
    // 监听currentSong
    currentSong(newSong, oldSong) {
      // 歌曲id不变就不触发下面操作
      if (newSong.id === oldSong.id) {
        return
      }
      // 每次开始前确定下是否已经存在currentLyric，防止歌词跳动
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      // 播放
      setTimeout(() => {
        this.$refs.audio.play()
        // 处理歌词
        this.getLyric()
      }, 1000)
    },
    // 监听播放状态Vuex
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%

        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 33px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-warpper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>