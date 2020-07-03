<template>
<!-- 点开排行榜 -->
  <transition name="slide" appear>
    <music-list :songs="songs" :title="title" :bgImage="bgImage" :rank="rank" :rankIco="rankIco"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'

export default {
  data() {
    return {
      songs: [],
      rank: true,
      rankIco: true
    }
  },
  created() {
    // 获取榜单歌曲数据
    this._getMusicList()
  },
  methods: {
    // 获取榜单歌曲数据
    _getMusicList() {
      // 刷新的时候获取不到数据返回
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    // 格式化列表 创建实例
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          createSong(musicData).then(res => {
            ret.push(res)
          })
        }
      })
      return ret
    }
  },
  computed: {
    // 计算标题
    title() {
      return this.topList.topTitle
    },
    // 计算背景图
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return this.topList.picUrl
    },
    // 拿到Vuex的数据
    ...mapGetters([
      'topList'
    ])
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>