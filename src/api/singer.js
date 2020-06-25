// 获取歌手页面的数据

import jsonp from 'common/js/jsonp'
import { axios } from 'common/js/axios'
// import { commonParameters } from './config'

// 轮播图数据
export async function getSinger() {
  const data = ''
  let singerUrl = ''
  // 从我的服务器获取QQ音乐的接口url
  await axios({
    url: '/juzi/singer'
  }).then(res => {
    singerUrl = res.data.url[0]
    console.log()
  })

  // 拿到接口去QQ音乐获取数据
  return jsonp(singerUrl, data)
}