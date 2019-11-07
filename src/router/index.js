import Vue from 'vue'
import Router from 'vue-router'
import index from '../view/index'
import login from '../view/login'
import user_list from '../view/user/user-list'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children: [
        {
          path: '*',
          redirect: '/user_list'
        },
        {
          path: '/user_list',
          name: 'user_list',
          component: user_list,
        },
      ]
    }
  ]
})
