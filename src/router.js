import Vue from 'vue'
import Router from 'vue-router'

import Furniture from './views/Furniture'
import GachaPool from './views/GachaPool'
import GachaUp from './views/GachaUp'
import Handbook from './views/Handbook'
import Character from './views/Character'
import Stage from './views/Stage'
import Material from './views/Material'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: GachaPool
    },
    {
      path: '/furniture',
      name: 'furniture',
      component: Furniture
    },
    {
      path: '/gacha/pool',
      name: 'gachaPool',
      component: GachaPool
    },
    {
      path: '/gacha/up',
      name: 'gachaUp',
      component: GachaUp
    },
    {
      path: '/handbook',
      name: 'handbook',
      component: Handbook
    },
    {
      path: '/character',
      name: 'character',
      component: Character
    },
    {
      path: '/stage',
      name: 'stage',
      component: Stage
    },
    {
      path: '/material',
      name: 'material',
      component: Material
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
