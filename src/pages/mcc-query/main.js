// 基础模块
import Vue from 'vue';

// 样式
import '@/styles';

// 组件
import MCCQuery from './MCCQuery.vue';

// 配置
Vue.config.productionTip = false;

new Vue({
  render: h => h(MCCQuery),
}).$mount('#app');