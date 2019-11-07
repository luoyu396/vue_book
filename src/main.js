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

import VueAMap from 'vue-amap';

Vue.prototype.$ajax = axios
Vue.prototype.$url = process.env.API_HOST
import './assets/css/common.scss'
Vue.use(ElementUI);
// 引入富文本框的组件开始
import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
// 引入富文本框操作结束

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
