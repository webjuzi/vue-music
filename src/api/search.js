// 搜索

import jsonp from 'common/js/jsonp'
import {commonParams, options, yqqapi} from './config'
import { axios } from 'common/js/axios'

// 热门关键字
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    platfrom: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// 搜索内容
export async function search(query, page, num, zhida) {
  let data = []
  await axios({
    url: `${yqqapi}/music/list?w=${query}&p=${page}&n=${num}&catZhida=${zhida}`
  }).then(res => {
    data = res.data
  })
  // console.log(data)
  return data
}
