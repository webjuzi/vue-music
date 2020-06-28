<template>
<!-- 歌手详情 -->
  <transition name="slide" appear>
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data() {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    // 计算头像传入详情页
    title() {
      return this.singer.name
    },
    // 计算背景图传入详情页
    bgImage() {
      return this.singer.avatar
    },
    // 取到vuex的值
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail()
  },
  methods: {
    // 获取歌手的歌曲信息
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
          // console.log(this.songs)
          // console.log(res.data.list)
        }
      })
    },
    // 格式化歌曲格式
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          // ret.push(createSong(musicData))
          createSong(musicData).then(res => {
            ret.push(res)
          })
        }
      })
      return ret
    }
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
