<template>
<!-- 排行页面 -->
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="(item, index) in topList" :key="index"
            @click="selectItem(item)">
          <!-- 排行榜图片 -->
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <!-- 右侧歌曲 -->
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{ index + 1}}</span>
              <span>{{song.songname + '--' + song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { playListMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playListMixin],
  data() {
    return {
      topList: [] // 排行榜榜单
    }
  },
  created() {
    // 获取排行榜榜单数据
    this._getTopList()
  },
  components: {
    Loading,
    Scroll
  },
  methods: {
    // 获取排行榜榜单数据
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    // 存在迷你播放器的时候
    handlePlayList(playlist) {
      const bottom = playlist.length ? '60px' : ''
      // 设置底部
      this.$refs.rank.style.bottom = bottom
      // 重置scroll组件
      this.$refs.toplist.refresh()
    },
    // 跳转到榜单详情
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    // 混入
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
