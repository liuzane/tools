// 基础模块
import Vue from 'vue';

// 定义原型链方法
import '@/utils/prototypes';

// 样式
import '@/styles';

// 组件
import CreditCardAmount from './CreditCardAmount.vue';

// 配置
Vue.config.productionTip = false;

new Vue({
  render: h => h(CreditCardAmount),
}).$mount('#app');