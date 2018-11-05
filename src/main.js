// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueX from 'vuex'
import VueI18n from 'vue-i18n'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import videoMeeting from './install'
Vue.use(iview)
Vue.use(VueX)
Vue.use(VueI18n)
Vue.config.productionTip = false
Vue.use(videoMeeting)

const i18n = new VueI18n({
  locale: 'zh-CN', // set locale
  messages: videoMeeting.locales // set locale messages
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  components: { App },
  template: '<App/>'
})
