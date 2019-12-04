<template>
  <ul class="options">
    <li>
      <h2 class="subtitle">Options</h2>
    </li>

    <li>
      <label>Max Amount</label>：
      <input v-model.number="maxAmount" type="text" />
    </li>

    <li>
      <label>Workday</label>：
      <label>Day Count</label>：
      <input
        v-model.number="workdayCount"
        class="small-input"
        type="text"
      />
    </li>

    <li>
      <label />：
      <label>Min Amount</label>：
      <input
        v-model.number="workdayMinMoney"
        class="small-input"
        type="text"
      />
    </li>

    <li>
      <label />：
      <label>Max Amount</label>：
      <input
        v-model.number="workdayMaxMoney"
        class="small-input"
        type="text"
      />
    </li>

    <li>
      <label>Weekend</label>：
      <label>Day Count</label>：
      <input
        v-model.number="weekendCount"
        class="small-input"
        type="text"
      />
    </li>

    <li>
      <label />：
      <label>Min Amount</label>：
      <input
        v-model.number="weekendMinMoney"
        class="small-input"
        type="text"
      />
    </li>

    <li>
      <label />：
      <label>Max Amount</label>：
      <input
        v-model.number="weekendMaxMoney"
        class="small-input"
        type="text"
      />
    </li>

    <li>
      <label>Begin Date</label>：
      <input
        v-model="startDate"
        type="text"
        placeholder="yyyy/mm/dd"
      />
    </li>

    <li>
      <label>Float</label>：
      <input v-model="isFloat" type="checkbox">
    </li>

    <li>
      <button class="button" @click="handleCreateData">Create Data</button>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'AmountOptions',

    data() {
      return {
        maxAmount: 10000.00,
        workdayCount: 1,
        workdayMinMoney: 300.00,
        workdayMaxMoney: 500.00,
        weekendCount: 2,
        weekendMinMoney: 700.00,
        weekendMaxMoney: 1000.00,
        startDate: new Date().format('YYYY/MM/DD'),
        isFloat: false,
      };
    },

    mounted() {
      this.handleCreateData();
    },

    methods: {
      handleCreateData() {
        const data = this.init();
        if (data) {
          this.$emit('update', data);
        }
      },

      init() {
        const {
          maxAmount,
          workdayCount,
          workdayMinMoney,
          workdayMaxMoney,
          weekendCount,
          weekendMinMoney,
          weekendMaxMoney,
          startDate,
        } = this;
        const amountList = [];
        let nextDate = startDate || new Date().format('YYYY/MM/DD');
        let totalAmount = 0;
        let totalCount = 0;

        if (maxAmount <= 0) return;

        while (totalAmount < maxAmount) {
          const dateParam = nextDate.split('/');
          const date = new Date(dateParam);
          const dateItem = {
            date: date.format('YYYY-MM-DD'),
            week: date.format('EEE'),
            millisecond: date.getTime(),
            moneys: [],
          };
          let moneys = [];
          let tempTotalAmount = 0;

          if (date.getDay() === 0 || date.getDay() === 6) {
            moneys = weekendCount <= 0 ? [] : this.getRandomMoneys(weekendCount, weekendMinMoney, weekendMaxMoney);
          } else {
            moneys = workdayCount <= 0 ? [] : this.getRandomMoneys(workdayCount, workdayMinMoney, workdayMaxMoney);
          }

          tempTotalAmount = totalAmount + (moneys.length === 0 ? 0 : moneys.reduce((prev, curr) => prev + curr));

          if (tempTotalAmount > maxAmount) {
            break;
          }

          totalAmount = tempTotalAmount;
          totalCount += moneys.length;
          dateItem.moneys = moneys.join('、');
          amountList.push(dateItem);
          nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000).format('YYYY/MM/DD');
        }

        return {
          amountList: amountList.filter(dateItem => dateItem.moneys.length > 0),
          totalAmount: Math.round(totalAmount * 100) / 100,
          totalCount,
        };
      },

      getRandomMoneys(count, min, max) {
        const randomNumber = () => {
          const number = Math.random() * (max - min) + min;
          return this.isFloat ? Math.round(number * 100) / 100 : Math.round(number);
        };
        return Array.apply(null, {length: count}).map(() => randomNumber());
      },
    },
  };
</script>

<style>
  .options > li {
    margin: 1rem 0;
  }

  .options label {
    display: inline-block;
    width: 80px;
    text-align: left;
  }

  input.small-input {
    width: 80px;
  }
</style>