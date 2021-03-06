// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import VueMaterial from 'vue-material'

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VueFire)
Vue.material.registerTheme('default', {
  primary: 'blue',
  accent: 'purple',
  warn: 'deep-orange',
  background: 'white'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
