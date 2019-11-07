import Vue from 'vue'
import Router from 'vue-router'
import index from '../view/index'
import login from '../view/login'
import user_list from '../view/user/user-list'
import type_list from '../view/type/type-list'
import book_list from '../view/book/book-list'
import order_info_list from '../view/orderInfo/order-info-list'
import statistics_list from '../view/statistics/statistics-list'

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
        {
          path: '/book_list',
          name: 'book_list',
          component: book_list,
        },
        {
          path: '/order_info_list',
          name: 'order_info_list',
          component: order_info_list,
        },
        {
          path: '/statistics_list',
          name: 'statistics_list',
          component: statistics_list,
        }
      ]
    }
  ]
})
