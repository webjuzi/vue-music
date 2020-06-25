import _axios from 'axios'

export function axios(config) {
  let newAxios = _axios.create({
    timeout: 5000
  })
  return newAxios(config)
}