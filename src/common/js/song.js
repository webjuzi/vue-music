// import axios from 'axios'
import { getSong } from 'api/singer'

// 歌曲类
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url, lyric}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    // this.token = token
    this.lyric = lyric
  }
}

// 这个不能用了
// 获取vkey
// function getVkey(songid) {
//   const url = '/vkey'
//   const data = Object.assign({}, {
//     "-": "getplaysongvkey5524479761838634",
//     "g_tk": "2071098943",
//     "sign": "zzap2g6ugxv0ouske98ba9b7bd0df5a92341e8279788434e",
//     "loginUin": "85640610",
//     "hostUin": "0",
//     "format": "json",
//     "inCharset": "utf8",
//     "outCharset": "utf-8",
//     "notice": "0",
//     "platform": "yqq.json",
//     "needNewCode": "0",
//     "data": {
//       "req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"7062177752","calltype":0,"userip":""}},
//       "req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"7062177752","songmid":[`${songid}`],"songtype":[0],"uin":"85640610","loginflag":1,"platform":"20"}},
//       "comm":{"uin":85640610,"format":"json","ct":24,"cv":0}}
//   })
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     console.log(Promise.resolve(res.data))
//     return Promise.resolve(res.data)
//   })
// }

// 格式化歌曲格式
export async function createSong(musicData) {
  // getVkey(musicData.songmid)
  // 网上找的接口获取vkey和歌曲播放地址
  let songUrl = ''
  let songLyric = ''
  await getSong(musicData.songmid).then(res => {
    if (res.data) {
      songUrl = res.data.musicUrl
      songLyric = res.data.lyric
    }
  })
  let songs = new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}_1.jpg?max_age=2592000`,
    url: songUrl,
    // token: `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid=${musicData.songmid}&filename=C400${musicData.songmid}&guid=126548448`
    lyric: songLyric
  })
  return songs
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(sin => {
    ret.push(sin.name)
  })
  return ret.join('/')
}