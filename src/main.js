// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from './axios/ajax.js'
import 'babel-polyfill'
import 'url-search-params-polyfill'

Vue.prototype.$ajax = axios
Vue.prototype.$url = process.env.API_HOST
Vue.prototype.$imgUrl = process.env.IMG_PATH
import './assets/css/common.scss'
Vue.use(ElementUI);

import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
