import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Layout from './layouts/ArkLayout'
import PlanList from './components/PlanList'
import PlanGround from './components/PlanGround'
import CharacterChooser from './components/CharacterChooser'
import CharacterInfo from './components/CharacterInfo'
import StockList from './components/StockList'
import StockInfo from './components/StockInfo'
import Convert from './views/Convert'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/',
      component: Layout,
      children: [{
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
        }
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
