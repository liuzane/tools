<template>
  <div class="container">
    <h1 class="title">Credit card amount table</h1>

    <ul class="options">
      <li>
        <h2 class="subtitle">Options</h2>
      </li>
      <li>
        <label>Max Amount</label>：
        <input v-model.number="maxAmount" type="text">
      </li>
      <li>
        <label>Workday</label>：
        <label>Day Count</label>：
        <input v-model.number="workdayCount" class="small-input" type="text">
      </li>
      <li>
        <label />：
        <label>Min Amount</label>：
        <input v-model.number="workdayMinMoney" class="small-input" type="text">
      </li>
      <li>
        <label />：
        <label>Max Amount</label>：
        <input v-model.number="workdayMaxMoney" class="small-input" type="text">
      </li>
      <li>
        <label>Weekend</label>：
        <label>Day Count</label>：
        <input v-model.number="weekendCount" class="small-input" type="text">
      </li>
      <li>
        <label />：
        <label>Min Amount</label>：
        <input v-model.number="weekendMinMoney" class="small-input" type="text">
      </li>
      <li>
        <label />：
        <label>Max Amount</label>：
        <input v-model.number="weekendMaxMoney" class="small-input" type="text">
      </li>
      <li>
        <label>Date</label>：
        <input v-model="startDate" type="text">
      </li>
      <li>
        <label>Float</label>：
        <input v-model="isFloat" type="checkbox">
      </li>
      <li>
        <button class="button" @click="test">Create Data</button>
      </li>
    </ul>

    <ul class="setting">
      <li>
        <h2 class="subtitle">Setting</h2>
      </li>
      <li v-for="item in cloneData" :key="item.date">
        <label>{{ item.date }} {{ item.week }}</label>：
        <input v-model="item.moneys" type="text"/>
      </li>
      <li>
        <button class="button" @click="comfirm">Comfirm</button>
      </li>
    </ul>

    <div class="preview">
      <h2 class="subtitle">Preview</h2>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th colspan="2">Credit card amount table</th>
        </tr>
        <tr>
          <th align="center" width="90px">Date</th>
          <th align="left">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in liftcycle" :key="item.date">
          <td>{{ item.date }} {{ item.week }}</td>
          <td>{{ item.moneys }}</td>
        </tr>
        <tr>
          <td align="right">Total Amount</td>
          <td>{{ totalAmount }}</td>
        </tr>
        <tr>
          <td align="right">Total Count</td>
          <td>{{ totalCount }}</td>
        </tr>
        <tr>
          <td align="right">Crated Date</td>
          <td>{{ new Date().format('YYYY.MM.DD') }}</td>
        </tr>
      </tbody>
    </table>

    <div class="preview">
      <button class="button" @click="exportPicture">Export Picture</button>
    </div>
  </div>
</template>

<script>
  import { cloneDeep, download } from '@/utils/assist';

  export default {
    name: 'Amount',

    data() {
      return {
        maxAmount: 10000.00,
        workdayCount: 1,
        workdayMinMoney: 300.00,
        workdayMaxMoney: 500.00,
        weekendCount: 2,
        weekendMinMoney: 1000.00,
        weekendMaxMoney: 2000.00,
        startDate: new Date().format('YYYY/MM/DD'),

        liftcycle: [],
        cloneData: [],
        totalAmount: 0.00,
        totalCount: 0,

        isFloat: true,
      };
    },

    mounted() {
      this.init();
    },

    methods: {
      test() {
        this.init();
      },

      comfirm() {
        this.liftcycle = cloneDeep(this.cloneData).filter(item => item.moneys && item.moneys !== '0');
        this.computeTotal(this.liftcycle);
        this.renderAmount(this.liftcycle);
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
        const liftcycle = [];
        let nextDate = startDate;
        let totalAmount = 0;
        let totalCount = 0;

        while (totalAmount < maxAmount) {
          const dateParam = nextDate.split('/');
          const date = new Date(dateParam);
          const dateItem = {
            date: date.format('YYYY-MM-DD'),
            week: date.format('EEE'),
            millisecond: date.getTime(),
            moneys: '',
          };
          let moneys = [];
          let tempTotalAmount = 0;

          if (date.getDay() === 0 || date.getDay() === 6) {
            moneys = this.getRandomMoneys(weekendCount, weekendMinMoney, weekendMaxMoney);
          } else {
            moneys = this.getRandomMoneys(workdayCount, workdayMinMoney, workdayMaxMoney);
          }

          tempTotalAmount = totalAmount + moneys.reduce((previousValue, currentValue) => previousValue + currentValue);

          if (tempTotalAmount > maxAmount) {
            break;
          }

          totalAmount = tempTotalAmount;
          totalCount += moneys.length;
          dateItem.moneys = moneys.join('、');
          liftcycle.push(dateItem);
          nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000).format('YYYY/MM/DD');
        }

        this.liftcycle = liftcycle;
        this.cloneData = cloneDeep(liftcycle);
        this.totalAmount = Math.round(totalAmount * 100) / 100;
        this.totalCount = totalCount;
        this.renderAmount(liftcycle);
      },

      computeTotal(list) {
        let totalAmount = 0;
        let totalCount = 0;

        list.forEach(dateItem => {
          const moneys = dateItem.moneys.split('、');
          totalAmount += Number(moneys.reduce((previousValue, currentValue) => (Number(previousValue) + Number(currentValue))));
          totalCount += moneys.length;
        });

        this.totalAmount = Math.round(totalAmount * 100) / 100;
        this.totalCount = totalCount;
      },

      renderAmount(list) {
        const {totalAmount, totalCount} = this;
        const amountPicture = document.getElementById('amount-picture');
        const ctx = amountPicture.getContext('2d');
        const width = amountPicture.width;
        const lineHeight = 28;
        const headerHeight = 64;
        const footerHeight = lineHeight * 3;
        const centerWidth = width / 2;
        const height = list.length * lineHeight + lineHeight + footerHeight * 2;
        let index = 0;
        amountPicture.height = height;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff6766';
        ctx.shadowColor = '#2e2e2e';
        ctx.font = '100 18px -apple-system,BlinkMacSystemFont';
        ctx.shadowBlur = '1';
        ctx.fillText('Credit card amount list', centerWidth, headerHeight / 2);
        ctx.font = '100 14px -apple-system,BlinkMacSystemFont';
        ctx.fillStyle = 'black';
        for (let i = 0; i < list.length; i++) {
          index = i + 1;
          let text = list[i].date + ' ' + list[i].week + ' ' + list[i].moneys;
          ctx.fillText(text, centerWidth, headerHeight + lineHeight * index - lineHeight / 2);
        }
        let footerPosition = headerHeight + lineHeight * index;
        let date = new Date().getFullYear() + ' 年 ' + (new Date().getMonth() + 1) + ' 月 ' + new Date().getDate() + ' 日';
        ctx.fillStyle = '#ff6766';
        ctx.fillText('合计金额： ' + totalAmount, centerWidth, footerPosition + footerHeight / 2);
        ctx.fillText('合计笔数： ' + totalCount, centerWidth, footerPosition + lineHeight + footerHeight / 2);
        ctx.fillText('日期： ' + date, centerWidth, footerPosition + lineHeight * 2 + footerHeight / 2);
      },

      getRandomMoneys(count, min, max) {
        const randomNumber = () => {
          const number = Math.random() * (max - min) + min;
          return this.isFloat ? Math.round(number * 100) / 100 : Math.round(number);
        };
        return Array.apply(null, {length: count}).map(() => randomNumber());
      },

      exportPicture() {
        const canvas = document.getElementById('amount-picture');
        const picture = canvas.toDataURL('image/png');

        download(new Date().format('YYYY/MM/DD'), picture);
      },
    }
  };
</script>

<style>
  .title {
    font-size: 2.4rem;
    font-weight: 100;
    text-align: center;
    margin-top: 1rem;
  }

  .subtitle {
    font-size: 1rem;
    font-weight: 100;
  }

  .options,
  .setting,
  .preview {
    width: 320px;
    margin: 0 auto;
    padding: 1rem;
  }

  .options > li,
  .setting > li {
    margin: 1rem 0;
  }

  .options label,
  .setting label {
    display: inline-block;
    text-align: left;
  }

  .options label {
    width: 80px;
  }

  .setting label {
    width: 110px;
  }

  .small-input {
    width: 80px;
  }

  .button {
    display: block;
    margin: 0 auto;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    font-weight: 100;
  }

  .table {
    margin: 0 auto;
    border-right: 1px solid #e1e1e1;
    border-bottom: 1px solid #e1e1e1;
  }

  .table th,
  .table td {
    border-top: 1px solid #e1e1e1;
    border-left: 1px solid #e1e1e1;
    padding: 0.2rem 0.4rem;
  }

  @media screen and (max-width: 479px) {
    .container {
      width: 100%;
    }
  }

  @media screen and (min-width: 480px) and (max-width: 768px) {
    .container {
      width: 90%;
      margin: 0 auto;
    }
  }

  @media screen and (min-width: 769px) {
    .container {
      width: 769px;
      margin: 0 auto;
    }
  }
</style>