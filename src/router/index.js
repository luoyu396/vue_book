import Vue from 'vue'
import Router from 'vue-router'
import index from '../view/index'
import login from '../view/login'
import user_list from '../view/user/user-list'
import type_list from '../view/type/type-list'

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
          path: '/user_list',
          name: 'user_list',
          component: user_list,
        },
        {
          path: '/type_list',
          name: 'type_list',
          component: type_list,
        },
      ]
    }
  ]
})
