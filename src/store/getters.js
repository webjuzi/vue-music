// 4
// 歌手
export const singer = state => state.singer
// 播放状态
export const playing = state => state.playing
// 是否全屏
export const fullScreen = state => state.fullScreen
// 播放列表
export const playList = state => state.playList
// 顺序列表
export const sequenceList = state => state.sequenceList
// 播放模式
export const mode = state => state.mode
// 当前播放的音乐的索引
export const currentIndex = state => state.currentIndex
// 当前播放的音乐
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || []
}
// 歌单
export const disc = state => state.disc