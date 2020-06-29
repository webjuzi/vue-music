<template>
<!-- 歌曲列表item -->
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs" :key="index" class="item"
          @click.once="selectItem(songs, index)">
        <!-- 排行 -->
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
        </div>
        <!-- 名字 歌曲名 -->
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 返回名字和专辑
    getDesc(song) {
      return `${song.singer}.${song.album}`
    },
    // 点击列表的歌曲
    selectItem(item, index) {
      // 子传父
      this.$emit('select', item, index)
    },
    // 排行序列号样式
    getRankCls(index) {
      // 前三个index显示图标
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        // 之后的显示数字
        return 'text'
      }
    },
    // 排行序列号文案
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>