// 排行页面数据获取

import jsonp from 'common/js/jsonp'
import { axios } from 'common/js/axios'
import {commonParams, options, juzi} from './config'

// 排行榜单
export async function getTopList() {
  // 从我的服务器获取Url uin needNewCode platform
  let topUrl = ''
  let uin = ''
  let needNewCode = ''
  let platform = ''
  await axios({
    url: `${juzi}/top`
  }).then(res => {
    topUrl = res.data.url[0]
    uin = res.data.url[1]
    needNewCode = res.data.url[2]
    platform = res.data.url[3]
  })
  const data = Object.assign({}, commonParams, {
    uin: uin,
    needNewCode: needNewCode,
    platform: platform
  })
  return jsonp(topUrl, data, options)
}

// 排行榜单歌曲详情
export async function getMusicList(topid) {
  let toplistUrl = ''
  const data = Object.assign({}, commonParams, {
    topid: topid
  })
  await axios({
    url: `${juzi}/toplist`
  }).then(res => {
    toplistUrl = res.data.url[0]
  })
  return jsonp(toplistUrl, data, options)
}