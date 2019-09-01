import Vue from 'vue'
import Router from 'vue-router'
import PlanList from './components/PlanList.vue'
import Character from './views/Character.vue'
import Stock from './views/Stock.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'planList',
      component: PlanList
    },
    {
      path: '/character',
      name: 'character',
      component: Character
    },
    {
      path: '/stock',
      name: 'stock',
      component: Stock
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
