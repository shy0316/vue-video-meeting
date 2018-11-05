import axios from 'axios'
import qs from 'qs'
import { Message, ApiError } from '../common'

const TIMEOUT = 10000 // 单位：毫秒

let Axios = axios.create({
  timeout: TIMEOUT
})

/**
 * post请求
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 */
function post (url, params) {
  return Axios.post(url, qs.stringify(params), {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }).catch(e => {
    Message.error('network error')
    return Promise.reject(new ApiError(
      'network error', -1
    ))
  })
}

/**
 * get请求
 * @param {string} url 请求地址
 */
function get (url) {
  return axios
    .get(url, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      timeout: TIMEOUT
    })
    .catch(e => {
      Message.error('network error')
      return Promise.reject(new ApiError(
        'network error', -1
      ))
    })
}

/**
 * 并发的发多个请求
 * @param {array} promises
 * @param {function} success
 */
function all (promises, success) {
  Axios.all(promises).then(Axios.spread(success))
}

export default {
  post,
  get,
  all
}
