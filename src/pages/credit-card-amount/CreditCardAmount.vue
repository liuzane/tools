<template>
  <div class="container">
    <Title>Credit Card Amount</Title>
    <div class="wrapper">
      <CreditCardAmountOptions @update="update"/>
      <CreditCardAmountSetting :list="data.amountList" @update="update"/>
      <CreditCardAmountPreview :data="data" />
    </div>
  </div>
</template>

<script>
  // 公共组件
  import Title from '@/components/Title';

  // 组件
  import CreditCardAmountOptions from './CreditCardAmountOptions';
  import CreditCardAmountSetting from './CreditCardAmountSetting';
  import CreditCardAmountPreview from './CreditCardAmountPreview';

  export default {
    name: 'CreditCardAmount',

    components: {
      Title,
      CreditCardAmountOptions,
      CreditCardAmountSetting,
      CreditCardAmountPreview,
    },

    data() {
      return {
        data: {
          amountList: [],
          totalAmount: 0.00,
          totalCount: 0,
        },
      };
    },

    methods: {
      update(data) {
        this.data = data;
      },
    }
  };
</script>

<style>
  .subtitle {
    font-size: 1.2rem;
    font-weight: 100;
  }

  .wrapper {
    width: 320px;
    margin: 0 auto;
    padding: 1rem;
  }

  .button {
    display: block;
    margin: 0 auto;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    font-weight: 100;
  }
</style>