import { axios } from 'common/js/axios'
import { juzi } from './config'
export async function getNewVersion() {
  let newVersion = ''
  await axios({
    url: `${juzi}/version`
  }).then(res => {
    newVersion = res
  })
  return newVersion
}