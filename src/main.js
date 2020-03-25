import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import router from './router'
import loading from './plugins/loading'
import {fetch,post} from './utils/http'
import path from '@/utils/paths'
import less from 'less'

Vue.use(loading)
Vue.use(ElementUI)
Vue.use(less)

Vue.config.productionTip = false

Vue.prototype.$fetch = fetch;
Vue.prototype.$post = post;
Vue.prototype.$path = path;

import * as filters from './filters'
Object.keys(filters).forEach((key) => {
 Vue.filter(key, filters[key]);
});

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
