// 获取推荐页面的数据

import jsonp from 'common/js/jsonp'
import { axios } from 'common/js/axios'
// import { commonParameters } from './config'

// 轮播图数据
export async function getRecommend() {
  const data = ''
  let lbtUrl = ''
  // 从我的服务器获取QQ音乐的接口url
  await axios({
    url: '/juzi/recommend'
  }).then(res => {
    lbtUrl = res.data.url[0]
  })

  // 拿到接口去QQ音乐获取数据
  return jsonp(lbtUrl, data)

  // const data = Object.assign({}, commonParameters, {
  //   loginUin: '85640610',
  //   needNewCode: 0,
  //   hostUin: 0,
  //   notice: 0,
  //   format: 'json'
  // })
}

// 热门歌单数据
export async function getDiscList() {
  const data = ''
  let hotUrl = ''
  // 从我的服务器获取QQ音乐的接口url
  await axios({
    url: '/juzi/recommend'
  }).then(res => {
    hotUrl = res.data.url[0]
  })

  // 拿到接口去QQ音乐获取数据
  return jsonp(hotUrl, data)
}
