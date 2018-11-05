import { ApiError, Http } from '../common'
import store from './store/index'
import Vue from 'vue'

function call (api, params) {
  const url = apiToUrl(api)
  const par = _params(params)

  return Http.post(url, par).then(response => {
    if (!response || !response.data) {
      return Promise.reject(new ApiError('network error response', -1))
    }
    const data = response.data
    if (!data || typeof data !== 'object' || !data.hasOwnProperty('state')) {
      return Promise.reject(new ApiError('network error format', -1))
    }

    if (data.state && data.state === 1) {
      return Promise.resolve(data.data)
    }

    if (!data.hasOwnProperty('code') || !data.hasOwnProperty('msg')) {
      return Promise.reject(new ApiError('network error format', -1))
    }
    return Promise.reject(new ApiError(data.msg, data.code))
  })
}

function apiToUrl (api) {
  let domain = getDomain()
  if (!domain) {
    console.error('no damain')
  }
  const apiArr = api.split('.')

  if (apiArr.length < 2) {
    console.error('error api' + apiArr)
  }

  if (apiArr.length === 3) {
    return `${domain}/main.php/json/${apiArr[1]}/${apiArr[2]}`
  }
}

function _params (params) {
  if (!params || typeof params !== 'object') {
    params = {}
  }
  let loginInfo
  try {
    loginInfo = store.store('loginInfo')
  } catch (e) {
    console.log(e)
  }
  params.token = loginInfo ? loginInfo.token : ''
  params.channel = getChannel()
  return params
}

/* function getEnv () {
  return Vue.prototype.$vmenv.env
} */

function getDomain () {
  console.log('api',Vue.prototype.$vmApiDomain)
  return Vue.prototype.$vmApiDomain
}

function getChannel () {
  return Vue.prototype.$vmchannelid
}

const Api = {
  call,
  apiToUrl
}

export default Api
