// local Storage
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
// 最多保存的数据条数
const SEARCH_MAX_LENGTH = 15

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