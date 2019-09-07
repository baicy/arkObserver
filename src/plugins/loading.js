let Loading = require('../components/Loading.vue').default; // cli3.0以后引入vue模板需要default

export default {
    install(Vue, options) {
        // 如果存在loading 不重复创建DOM
        if (document.getElementsByClassName('ark-observer-loading').length) return;
        
        // 创建一个VUE构造器
        let LoadingPlugin  = Vue.extend(Loading);

        // 提供一个在页面上已存在的DOM元素作为Vue实例的挂载目标。
        // 在实例挂载之后，可以通过$vm.$el访问。
        // 如果这个选项在实例化时有用到，实例将立即进入编译过程。否则，需要显示调用vm.$mount()手动开启编译
        // 提供的元素只能作为挂载点。所有的挂载元素会被vue生成的dom替换。因此不能挂载在顶级元素(html, body)上
        // let tpl = $vm.$mount().$el;
        // document.body.appendChild(tpl);
        let $vm = new LoadingPlugin({
             el: document.createElement('div')
        });

        Vue.prototype.$loading = { //在Vue的原型上添加实例方法，以全局调用
            show(options) {
                $vm.show = true;
                document.getElementsByClassName('v-content')[0].appendChild($vm.$el);
            },
            hide() {
                $vm.show = false;
            }
        }
    }
}