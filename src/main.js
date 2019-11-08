import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import router from './router'
import loading from './plugins/loading'
import {fetch,post} from './utils/http'

Vue.use(loading)
Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.prototype.$fetch = fetch;
Vue.prototype.$post = post;

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
