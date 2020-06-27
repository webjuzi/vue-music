<template>
<!-- 歌手页面 -->
    <div class="singer">
      <list-view :data="singers" @select="selectSinget"></list-view>
      <router-view></router-view>
    </div>
</template>

<script>
import { getSinger } from 'api/singer'
import { ERR_OK } from 'api/config'
import vPinyin from 'common/js/vue-py'
import ListView from 'base/listview/listview'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
// 热门歌手个数
const HOT_SINGER_LEN = 10

export default {
  data() {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  created() {
    // 获取歌手列表
    this._getSinget()
  },
  methods: {
    // 传入vuex的值
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    // 接收到singer的实例跳转到歌手详情页面
    selectSinget(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    // 获取歌手列表
    _getSinget() {
      getSinger().then(res => {
        if (res.code === ERR_OK) {
          this.singerList = res.singerList.data.singerlist
          // 生成分组
          this._normalizeSinger(this.singerList)
        }
      })
    },
    // 生成分组
    _normalizeSinger(list) {
      // console.log(list)
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // 遍历
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push({
            id: item.singer_mid,
            name: item.singer_name,
            avatar: item.singer_pic
          })
        }
        // 取到每个歌手的首字母
        let salesmanName = item.singer_name
        let namePinyin = vPinyin.chineseToPinYin(salesmanName)
        const key = namePinyin
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push({
          id: item.singer_mid,
          name: item.singer_name,
          avatar: item.singer_pic
        })
      })
      // console.log(map)
      // 整理有序列表，热门在最前面
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 给ret排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // console.log(hot.concat(ret))
      // 合并数组
      this.singers = hot.concat(ret)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
