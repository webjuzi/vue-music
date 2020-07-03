<template>
<!-- 歌手详情 -->
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- 标题 -->
    <h1 class="title" v-html="title"></h1>
    <!-- 背景图 -->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 背景层 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 歌曲列表 -->
    <scroll :data="songs" :probe-type="probeType" :listen-scroll="listenScroll"
            @scroll="scroll" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank" :rankIco="rankIco"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'
import { playListMixin } from 'common/js/mixin'

const RESERVER_HEIGHT = 40

export default {
  mixins: [playListMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      title: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    },
    rankIco: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  methods: {
    // 获取滚动的高度赋值给scrollY
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 返回
    back() {
      this.$router.back()
    },
    // 拿到子组件传递过来的参数
    selectItem(item, index) {
      // 调用actions里面的selectPlay并传值
      // console.log(item, index)
      // 传入播放器歌曲信息
      // console.log(this.songs)
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    // 随机播放全部
    random() {
      // 调用actions里面的randomPlay并传值
      this.randomPlay({
        list: this.songs
      })
    },
    // 有播放列表的时候滑动组件的底部要加bottom
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // vuex语法糖，直接混入actions里面的selectPlay
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    // 监听scrollY
    scrollY(newY) {
      // 计算最多的滚动距离
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
      this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)`
      const parcent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        // 往下拉的时候放大图片
        scale = 1 + parcent
        zIndex = 10
      } else {
        // 往上拉的时候给图片加模糊
      }
      if (newY < this.minTranslateY) {
        // 表示滚动到了顶部,图片要盖住列表，解决当行栏能看到文字的问题
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVER_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        // 重置
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
      this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  computed: {
    // 设置背景图
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  // 计算背景图的高度复制给滚动组件的top
  mounted() {
    // 缓存下图片的高度，上拉的时候要使用
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVER_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>