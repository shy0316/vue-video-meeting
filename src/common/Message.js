
import { Message } from 'iview'

export default {
  /**
   * 弹出错误消息
   * @param {string} msg 消息字符串
   */
  error (msg) {
    Message.error(msg)
  },
  /**
   * 弹出成功消息
   * @param {string} msg 消息字符串
   */
  success (msg) {
    Message.success(msg)
  },
  /**
   * 弹出警告消息
   * @param {string} msg 消息字符串
   */
  warn (msg) {
    Message.warning(msg)
  }
}
