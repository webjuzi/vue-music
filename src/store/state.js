// 1
import { playMode } from 'common/js/config'
import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache'

const state = {
  singer: {}, // 歌手
  playing: false, // 播放状态
  fullScreen: false, // 是否全屏
  playList: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放的音乐的索引
  disc: {}, // 歌单
  topList: {}, // 排行榜单
  searchHistory: loadSearch(), // 搜索历史初始值
  playHistory: loadPlay(), // 播放历史初始值
  favoriteList: loadFavorite() // 我喜欢的
}

export default state