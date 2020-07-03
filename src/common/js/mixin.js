import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('组件必须实现handlePlayList方法')
    }
  }
}

export const plyerMixin = {
  computed: {
    // 播放模式图标切换
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode'
    ])
  },
  methods: {
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
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  }
}

// 搜索
export const searchMixin = {
  data() {
    return {
      query: '' // 搜索关键词
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    // 监听关键词的变化
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    // 保存搜索结果
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    // 调用searchBox的接口改变query的值
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    // 删除一条搜索记录
    deleteOne(item) {
      this.deleteSearchHistory(item)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}