/**
 * Created by shy on 2018/10/18.
 */

import ins from './store'

/**
 * vuex实例
 */
const instance = ins

/**
 * 向内存中读取或存数据
 * @param {string} keys 字符串以.分割
 * @param {*} val 存的值，为undefined的时候表示读
 */
function store (keys, val) {
  if (typeof val === 'undefined') {
    return keys.split('.').reduce((v, k) => {
      if (v && v.hasOwnProperty(k)) {
        return v[k]
      } else {
        return null
      }
    }, instance.state)
  } else {
    instance.commit('set', {
      keys,
      val
    })
  }
}

/**
 * 清除内存中所有数据
 */
function clean () {
  instance.commit('clean')
}

export default {
  instance,
  store,
  clean
}
