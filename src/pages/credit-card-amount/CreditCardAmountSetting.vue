<template>
  <ul class="setting">
    <li>
      <h2 class="subtitle">Setting</h2>
    </li>

    <li v-for="item in data" :key="item.date">
      <label>{{ item.date }} {{ item.week }}</label>：
      <input v-model="item.moneys" type="text"/>
    </li>

    <li>
      <button class="button" @click="comfirm">Comfirm</button>
    </li>
  </ul>
</template>

<script>
  import { cloneDeep } from '@/utils/assist';

  export default {
    name: 'AmountSetting',

    props: {
      list: Array
    },

    data() {
      return {
        data: [],
      };
    },

    watch: {
      list(newList) {
        this.data = cloneDeep(newList);
      },
    },

    methods: {
      comfirm() {
        this.$emit('update', this.computeTotal());
      },

      computeTotal() {
        let totalAmount = 0;
        let totalCount = 0;

        this.data.forEach(dateItem => {
          const moneys = dateItem.moneys ? dateItem.moneys.split('、') : [];
          totalAmount += Number(moneys.reduce((previousValue, currentValue) => (Number(previousValue) + Number(currentValue)), 0));
          totalCount += moneys.length;
        });

        return {
          amountList: this.data.filter(dateItem => dateItem.moneys.length > 0),
          totalAmount: Math.round(totalAmount * 100) / 100,
          totalCount,
        };
      },
    },
  };
</script>

<style>
  .setting > li {
    margin: 1rem 0;
  }

  .setting label {
    display: inline-block;
    width: 110px;
    text-align: left;
  }
</style>