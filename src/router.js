import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'

import Furniture from './views/Furniture'
import GachaPool from './views/GachaPool'
import GachaUp from './views/GachaUp'
import Handbook from './views/Handbook'
import Character from './views/Character'
import Stage from './views/Stage'
import Story from './views/Story'
import Store from './views/Store'
import Material from './views/Material'

import Layout from './layouts/ArkLayout'
import PlanList from './components/PlanList'
import PlanGround from './components/PlanGround'
import CharacterChooser from './components/CharacterChooser'
import CharacterInfo from './components/CharacterInfo'
import StockList from './components/StockList'
import StockInfo from './components/StockInfo'
import Convert from './views/Convert'
import Ocr from './views/Ocr'
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
      path: '/story',
      name: 'story',
      component: Story
    },
    {
      path: '/store',
      name: 'store',
      component: Store
    },
    {
      path: '/material',
      name: 'material',
      component: Material
    },
    {
      path: '/ocr',
      name: 'ocr',
      component: Ocr
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: 'plan',
          components: {
            default: PlanGround,
            list: PlanList
          }
        }, {
          path: 'character',
          components: {
            default: CharacterInfo,
            list: CharacterChooser
          }
        }, {
          path: 'stock',
          components: {
            default: StockInfo,
            list: StockList
        },
      }]
    },
    // {
    //   path: '/plan',
    //   name: 'plan',
    //   component: PlanList
    // },
    // {
    //   path: '/character',
    //   name: 'character',
    //   component: Character
    // },
    // {
    //   path: '/stock',
    //   name: 'stock',
    //   component: Stock
    // },
    {
      path: '/convert',
      name: 'convert',
      component: Convert
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
