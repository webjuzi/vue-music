<template>
<!-- 播放列表 -->
  <transition name="list-fade">
    <!-- 模糊层 -->
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <!-- 头部 -->
        <div class="list-header">
          <h1 class="title" >
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <!-- 中间列表 -->
        <scroll class="list-content" :data="sequenceList" ref="listContent" :refreshDelay="120">
          <ul>
            <li class="item" v-for="(item, index) in sequenceList" :key="index"
                @click="selectItem(item, index)" ref="listItem">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </scroll>
        <!-- 添加个区到队列 -->
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲队列</span>
          </div>
        </div>
        <!-- 关闭 -->
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" :text="text" @confirm="confirmClear" :confirmBtnText="'清空'">
      </confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
import { playMode } from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import { plyerMixin } from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'

export default {
  mixins: [plyerMixin],
  data() {
    return {
      showFlag: false, // 显示隐藏播放列表
      text: '确定要<span style="color: #ffcd32;font-whigh: 700;font-size: 20px"> 清空所有 </span>歌曲列表' // 删除历史搜索框的默认文字
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '列表循环' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    // 显示播放列表
    show() {
      this.showFlag = true
      // 延迟20毫秒从新计算下数据，防止计算高度不正确
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    // 隐藏播放列表
    hide() {
      this.showFlag = false
    },
    // 正在播放的歌曲显示前面播放图标
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    // 列表点击触发切歌
    selectItem(item, index) {
      // 播放模式为随机
      if (this.mode === playMode.random) {
        index = this.playList.findIndex(song => {
          return song.id === item.id
        })
      }
      // 切歌
      this.setCurrentIndex(index)
      // 更新播放状态
      this.setPlayingState(true)
    },
    // 打开列表滚动到正在播放的歌曲
    scrollToCurrent(current) {
      // 找到id
      const index = this.sequenceList.findIndex(song => {
        return song.id === current.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    // 删除单曲
    deleteOne(item) {
      this.deleteSong(item)
      if (!this.playList.length) {
        // 列表歌曲删除完的时候隐藏
        this.hide()
      }
    },
    // 点击删除全部
    showConfirm() {
      this.$refs.confirm.show()
    },
    // 点击清空
    confirmClear() {
      this.deleteSongList()
      this.hide()
    },
    // 显示添加歌曲组件
    addSong() {
      this.$refs.addSong.show()
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.playlist
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  z-index 200
  background-color $color-background-d
  &.list-fade-enter-active, &.list-fade-leave-active
    transition opacity 0.3s
    .list-wrapper
      transition all 0.3s
  &.list-fade-enter, &.list-fade-leave-to
    opacity 0
    .list-wrapper
      transform translate3d(0, 100%, 0)
  &.list-fade-enter, .list-wrapper
    position absolute
    left 0
    bottom 0
    width 100%
    background-color $color-highlight-background
    .list-header
      position relative
      padding 20px 30px 10px 20px
      .title
        display flex
        align-items center
        .icon
          margin-right 10px
          font-size 30px
          color $color-theme-d
        .text
          flex 1
          font-size $font-size-medium
          color $color-text-l
        .clear
          extend-click()
          .icon-clear
            font-size $font-size-medium
            color $color-text-d
    .list-content
      max-height 240px
      overflow hidden
      .item
        display flex
        align-items center
        height 40px
        padding 0 30px 0 20px
        overflow hidden
        &.list-enter-active, &.list-leave-active
          transition all 0.1s
        &.list-enter, &.list-leave-to
          height 0
        .current
          flex 0 0 20px
          width 20px
          font-size $font-size-small
          color $color-theme-d
        .text
          flex 1
          no-wrap()
          font-size $font-size-medium
          color $color-text-d
        .like
          extend-click()
          margin-right 15px
          font-size $font-size-small
          color $color-theme
          .icon-favorite
            color $color-sub-theme
        .delete
          extend-click()
          font-size $font-size-small
          color $color-theme
    .list-operate
      width 140px
      margin 20px auto 30px auto
      .add
        display flex
        align-items center
        padding 8px 16px
        border 1px solid $color-text-l
        border-radius 100px
        color $color-text-l
        .icon-add
          margin-right 5px
          font-size $font-size-small-s
        .text
          font-size $font-size-small
    .list-close
      text-align center
      line-height 50px
      background $color-background
      font-size $font-size-medium-x
      color $color-text-l
</style>