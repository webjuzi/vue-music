// 获取推荐页面的数据

import jsonp from 'common/js/jsonp'
import { axios } from 'common/js/axios'
import { commonParams } from './config'

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

// 获取歌单的歌单列表
// export function getSongList(contentId) {
//   const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
//   const data = Object.assign({}, commonParams, {
//     disstid: contentId,
//     type: 1,
//     json: 1,
//     utf8: 1,
//     onlysong: 0,
//     platform: 'yqq',
//     hostUin: 0,
//     needNewCode: 0
//   })
//   return jsonp(url, data, options)
// }

export function getSongList(disstid) {
  const url = `/juzi/api/getDiscList?disstid=${disstid}`
  const data = Object.assign({}, commonParams, {
    // platform: 'yqq',
    // hostUin: 0,
    // sin: 0,
    // ein: 29,
    // sortId: 5,
    // needNewCode: 0,
    // categoryId: disstid,
    // rnd: Math.random(),
    // format: 'json' // json数据
  })
  return axios(url, { // 返回值也不是jsonp，而是要通过axios实现
    params: data // 参数
  }).then((res) => { // 拿到数据（response对象）
    // return Promise.resolve(res.data)
    return res.data
  })
}