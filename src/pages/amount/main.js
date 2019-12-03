import Vue from 'vue';
import Amount from './Amount.vue';

// 定义原型链方法
import '@/utils/prototypes';

// 样式
import '@/styles';

Vue.config.productionTip = false;

new Vue({
  render: h => h(Amount),
}).$mount('#app');