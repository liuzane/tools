// 基础模块
import Vue from 'vue';

// 样式
import '@/styles';

// 组件
import App from './App.vue';

// 配置
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');