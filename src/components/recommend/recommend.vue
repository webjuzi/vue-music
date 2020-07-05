<template>
  <!-- 推荐页面 -->
  <div class="recommend"
       ref="recommend">
    <scroll ref="scroll"
            class="recommend-content"
            :data="discList">
      <div>
        <!-- 轮播图 -->
        <div class="slider-wrapper"
             v-if="recommends.length">
          <slider>
            <div v-for="(item, index) in recommends"
                 :key="index">
              <div @click="_push(item)">
                <img class="needsclick"
                     @load="loadImage"
                     :src="_getLbtImg(item.img)"
                     alt="">
              </div>
            </div>
          </slider>
        </div>
        <!-- 推荐 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList"
                :key="index"
                class="item"
                @click="selectItem(item)">
              <div class="icon">
                <img width="60"
                     height="60"
                     v-lazy="item.cover"
                     alt="">
              </div>
              <div class="text">
                <h2 class="name">{{ item.title }}</h2>
                <p class="desc">{{'播放量：' + _listen_num(item.listen_num) + '万' }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container"
           v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <!-- 子路由页面 -->
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { playListMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
import Loading from 'base/loading/loading'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Singer from 'common/js/singer'

export default {
  mixins: [playListMixin],
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    // 获取轮播图数据
    _getRecommend() {
      getRecommend().then(res => {
        // if (res.code === ERR_OK) {
        //   this.recommends = res.focus.data.shelf.v_niche[0].v_card
        // console.log(this.recommends)
        // }
        this.recommends = res.lbt.data
      })
    },
    // 拼接轮播图专辑的Url
    _push(item) {
      const singer = new Singer({
        id: item.songid,
        name: item.name
      })
      this.$router.push({
        path: `/search/${singer.id}`
      })
      this.setSinger(singer)
    },
    // 计算图片的路径
    _getLbtImg(img) {
      return `http://www.zhouyongju.com/usr/themes/zhouyongju/resource/app/music/lbt/${img}.jpg`
    },
    // 获取热门歌单数据
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.recomPlaylist.data.v_hot
          // console.log(this.discList)
        }
      })
    },
    // 播放量改为“万”单位
    _listen_num(num) {
      return (num / 10000).toFixed(1)
    },
    // 图片加载好后触发，防止歌单列表高度计算不正确
    loadImage() {
      if (!this.checkLoad) {
        this.$refs.scroll.refresh()
        this.checkLoad = true
      }
    },
    // 有播放列表的时候滑动组件的底部要加bottom
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    // 歌单点击事件
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.content_id}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: 'SET_DISC',
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend-content
    height 100%
    overflow hidden
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .recommend-list
      .list-title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-medium
        color $color-theme
      .item
        display flex
        box-sizing border-box
        align-items center
        padding 0 20px 20px 20px
        .icon
          flex 0 0 60px
          width 60px
          padding-right 20px
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-text
          .desc
            color $color-text-d
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
