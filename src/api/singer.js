// 获取歌手页面的数据

import jsonp from 'common/js/jsonp'
import { axios } from 'common/js/axios'
import {commonParams, options, juzi, yqqapi} from './config'
// import { commonParameters } from './config'

// 轮播图数据
export async function getSinger() {
  const data = ''
  let singerUrl = ''
  // 从我的服务器获取QQ音乐的接口url
  await axios({
    url: `${juzi}/singer`
  }).then(res => {
    singerUrl = res.data.url[0]
    console.log()
  })

  // 拿到接口去QQ音乐获取数据
  return jsonp(singerUrl, data)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })
  return jsonp(url, data, options)
}

// 获取歌曲源地址
export async function getSong(mid) {
  let url = ''
  await axios({
    url: `${yqqapi}/music/song?songmid=${mid}&guid=85640610&lyric=1`
  }).then(res => {
    // console.log(res)
    url = res.data
  })
  return url
}