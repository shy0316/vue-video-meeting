import videoMeetingPane from './components/conferencePane/conferencePane.vue'
import locales from './locales'
import {setVMEnv, setVMChannelID} from './services/index'
import axois from 'axios'
import Qs from 'qs'
import _ from 'lodash'
import './styles/index.css'
const install = function (Vue) {
  Vue.prototype.axios = axois
  Vue.prototype.qs = Qs
  Vue.prototype._ = _
  if (typeof window !== 'undefined' && window.Vue) {
    Vue = window.Vue
  }
  Vue.component(videoMeetingPane.name, videoMeetingPane)
  Vue.prototype.$vmconfigure = {
    setVMEnv: setVMEnv,
    setVMChannelID: setVMChannelID
  }
}

export default {
  locales,
  install,
  videoMeetingPane
}
