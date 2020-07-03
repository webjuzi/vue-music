// end
import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay } from 'common/js/cache'

// 默认播放配置
export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  // 如果是随机播放
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 随机播放配置
export const randomPlay = function({commit}, {list}) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomlist = shuffle(list)
  commit(types.SET_PLAY_LIST, randomlist)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 给随机列表找正确的index
function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

// -------------------------------------------------------------------

// 搜搜列表点击歌曲
export const insertSong = function ({commit, state}, song) {
  // 播放列表
  let playList = state.playList.slice()
  // 顺序列表
  let sequenceList = state.sequenceList.slice()
  // 当前播放的音乐的索引
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 判断当前列表是否已经有待插入的歌曲，并返回其索引
  let fpIndex = findIndex(playList, song)
  // 因为要插入歌曲，所以索引➕1
  currentIndex++
  // 插入到当前索引的位置
  playList.splice(currentIndex, 0, song)
  // 列表已经有这个歌曲了
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表的序号
    if (currentIndex > fpIndex) {
      // 先删除列表的这个歌曲
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 如果当前插入的序号小于列表的序号
      playList.splice(fpIndex + 1, 1)
    }
  }
  // currentSong应该要插入sequenceList的索引
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  // 判断当前列表是否已经有待插入的歌曲，并返回其索引
  let fsIndex = findIndex(sequenceList, song)
  // 插入到当前索引的位置
  sequenceList.splice(currentSIndex, 0, song)
  // -----------列表没有这个歌曲-----------
  if (fsIndex > -1) {
    // 如果当前插入的序号大于列表的序号
    if (currentSIndex > fsIndex) {
      // 删除列表的这个歌曲
      sequenceList.splice(fsIndex, 1)
    } else {
      // 删除列表的这个歌曲
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  // 修改数据
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// -----------------------------------------------

// 保存搜索历史
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
// 删除
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
// 删除全部
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 保存历史歌曲
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// --------------------------------------------

// 删除列表歌曲
export const deleteSong = function ({commit, state}, song) {
  // 播放列表
  let playList = state.playList.slice()
  // 顺序列表
  let sequenceList = state.sequenceList.slice()
  // 当前播放的音乐的索引
  let currentIndex = state.currentIndex
  // 判断当前列表要删除的这首歌曲
  let pIndex = findIndex(playList, song)
  // 删除
  playList.splice(pIndex, 1)
  // 找到index
  let sIndex = findIndex(sequenceList, song)
  // 删除
  sequenceList.splice(sIndex, 1)
  // 当前播放的歌曲在要删除的歌曲的后面
  if (currentIndex > pIndex || currentIndex === playList.length) {
    // 当前歌曲的index--
    currentIndex--
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

// 删除全部
export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}
