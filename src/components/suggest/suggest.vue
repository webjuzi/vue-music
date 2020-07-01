<template>
  <!-- 搜索结果 -->
  <scroll class="suggest"
          :data="result"
          ref="suggest"
          :pullup="pullup"
          :beforeScrool="beforeScrool"
          @beforeScrool="listScroll">
    <ul class="suggest-list">
      <!-- 遍历 -->
      <li class="suggest-item"
          v-for="(item, index) in result"
          :key="index"
          @click.once="selectItem(item)">
        <div class="icon">
          <img :src="item.zhida_singer.singerPic"
               class="icon-img"
               v-if="item.type">
          <i :class="getIconCls(item)"
             v-else></i>
        </div>
        <div class="name"
             :class="{isImg: item.type}">
          <p class="text"
             v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="result.length < 10"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import { search } from 'api/search'
import { createSong } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import NoResult from 'base/no-result/no-result'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    num: {
      type: Number,
      default: 20 // 一页多少数据
    }
  },
  data() {
    return {
      page: 1, // 获取第几页
      result: [], // 接收数据
      pullup: true, // 到底部加载更多数据
      hsaMore: true,
      beforeScrool: true // 滑动的时候隐藏键盘
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
  methods: {
    // 请求数据
    _search() {
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.num).then(res => {
        // 处理数据
        this._genResult(res.data)
        // 计算是否还有更多的数据
        // this._cheResult(res)
        // console.log(res)
      })
    },
    // 处理接收到的数据
    _genResult(data) {
      // console.log(data)
      if (data.zhida.zhida_singer && this.page === 1) {
        this.result.push(data.zhida)
      }
      if (data.list) {
        // console.log(data.list)
        this._normalizeSongs(data.list)
        // ret = ret.concat(data.list)
      }
    },
    // 格式化列表
    _normalizeSongs(list) {
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          createSong(musicData).then(res => {
            this.result.push(res)
            // console.log(this.result, 1)
          })
        }
      })
    },
    // 每一个搜索结果的图标
    getIconCls(item) {
      if (item.type) {
        return 'y-img'
      } else {
        return 'icon-music'
      }
    },
    // 每一个搜索结果的文本
    getDisplayName(item) {
      if (item.type) {
        return (
          '歌手：' +
          item.zhida_singer.singerName +
          '<hr style="height:1px;border:none;border-top:1px dashed #536165;" />' +
          '专辑：' +
          item.zhida_singer.albumNum
        )
      } else {
        return `${item.name}--${item.singer}`
      }
    },
    // 列表点击事件
    selectItem(item) {
      if (item.type) {
        // 是一个歌手
        const singer = new Singer({
          id: item.zhida_singer.singerMID,
          name: item.zhida_singer.singerName
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    // 滑动的时候传递给父组件隐藏键盘
    listScroll() {
      this.$emit('listScroll')
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
    // 拉倒最底部的时候触发
    // searchMore() { // 关闭功能了
    //   // 没有更多数据了
    //   if (!this.hsaMore) {
    //     return
    //   }
    //   // 页数➕1再次搜索
    //   this.page++
    //   search(this.query, this.page, this.num).then(res => {
    //     this._genResult(res.data)
    //     this._cheResult(res.data)
    //   })
    // },
    // 计算还有没有更多的数据
    // _cheResult(data) {
    //   const song = data.data
    //   if (!song.list.length || (song.curnum * song.curpage + song.curnum) >= song.totalnum) {
    //     this.hsaMore = false
    //   }
    // }
  },
  watch: {
    // 监听搜索词的变化
    query() {
      // 请求数据
      this.result = []
      this._search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      align-items center
      padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
        .icon-img
          width 60px
          height 60px
          border-radius 50%
          margin-left 15px
        .icon-music
          font-size 14px
          color $color-text-d
      .isImg
        margin-left 60px
      .name
        font-size $font-size-medium
        color $color-text-d
        overflow hidden
        .text
          no-wrap()
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>