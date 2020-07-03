// local Storage
import storage from 'good-storage'

// 搜索的Key
const SEARCH_KEY = '__search__'
// 最多保存的数据条数
const SEARCH_MAX_LENGTH = 15
// 播放的Key
const PLAY_KEY = '__play__'
// 最多两百首歌曲
const PLAY_MAX_LENGTH = 100
// 我喜欢的
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

export function saveSearch(query) {
  // 获取缓存中的列表
  let searches = storage.get(SEARCH_KEY, [])
  inserArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  // 保存
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 插入数据的方法
function inserArray(arr, val, compare, maxLen) {
  // 查找当前数组是否有待插入的值
  const index = arr.findIndex(compare)
  if (index === 0) {
    // 已经是第一条数据，什么都不
    return
  }
  if (index > 0) {
    // 先删除
    arr.splice(index, 1)
  }
  // 插入
  arr.unshift(val)
  // 存在条数限制，并超出条数的时候
  if (maxLen && arr.length > maxLen) {
    // 删除最后一个
    arr.pop()
  }
}

// 打开的时候state里面搜索历史的初始值
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 删除历史列表数据
export function deleteSearch(query) {
  // 获取缓存中的列表
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  // 重新保存
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 删除全部搜索历史
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 删除方法
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 最近播放保存
export function savePlay(song) {
  // 查询有没有这个key，没有就定义一个空数组
  let songs = storage.get(PLAY_KEY, [])
  // 插入
  inserArray(songs, song, (item) => {
    // 如果已经存在就调整到最前面
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  // 保存到本地
  storage.set(PLAY_KEY, songs)
  return songs
}

// 读取最近播放
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

// 保存到我喜欢的
export function saveFavorite(song) {
  // 拿到当前的列表,没有就定义一个空数组
  let songs = storage.get(FAVORITE_KEY, [])
  inserArray(songs, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 从我的喜欢删除
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 初始我的喜欢
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}