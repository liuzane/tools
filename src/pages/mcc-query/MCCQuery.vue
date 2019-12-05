<template>
  <div class="container">
    <Title>MCC Query</Title>

    <input
      class="query"
      type="text"
      placeholder="Please type keyword"
      @input="search"
    />

    <table
      v-for="(table, index) in mcc"
      :key="index"
      class="table"
    >
      <thead>
        <tr>
          <th colspan="3">{{ table.title }}</th>
        </tr>
        <tr>
          <th style="width: 3rem">MCC码</th>
          <th>商户类别名称</th>
          <th style="width: 6rem">费率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in table.data" :key="item.mcc">
          <td align="center" v-html="item.mcc"/>
          <td v-html="item.name"/>
          <td align="center">{{ item.rate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  // 公共组件
  import Title from '@/components/Title';

  // MCC码
  import mcc from './mcc.json';

  export default {
    name: 'MccQuery',

    components: {
      Title,
    },

    data() {
      return {
        mcc: JSON.parse(JSON.stringify(mcc)),
        time: null,
      };
    },

    methods: {
      search(e) {
        clearTimeout(this.time);

        this.time = setTimeout(() => {
          const value = e.target.value;
          const regexp = new RegExp(value);
          const data = JSON.parse(JSON.stringify(mcc));
          const Keyword = (keyword) => `<em class="keyword">${ keyword }</em>`;

          if (!value) {
            this.mcc = data;
            return;
          }

          this.mcc = data.filter(table => {
            let list = table.data;
            list = list.filter(item => {
              const isMCCMatch = regexp.test(item.mcc);
              const isNameMatch = regexp.test(item.name);

              if (isMCCMatch) {
                item.mcc = item.mcc.replace(regexp, Keyword);
              }

              if (isNameMatch) {
                item.name = item.name.replace(regexp, Keyword);
              }

              return isMCCMatch || isNameMatch;
            });
            table.data = list;
            return list.length > 0;
          });
        }, 500);
      },
    },
  };
</script>

<style>
  .container {
    width: 479px;
    margin: 0 auto;
  }

  input.query {
    display: block;
    width: 320px;
    margin: 30px auto;
    padding: 0.2rem 0.5rem;
  }

  .table {
    width: 100%;
    margin: 30px 0;
    border-right: 1px solid #e1e1e1;
    border-bottom: 1px solid #e1e1e1;
  }

  .table th,
  .table td {
    border-top: 1px solid #e1e1e1;
    border-left: 1px solid #e1e1e1;
    padding: 0.2rem 0.4rem;
  }

  .table th {
    font-weight: 600;
  }

  .keyword {
    color: red;
  }

  @media screen and (max-width: 479px) {
    .container {
      width: 100%;
    }
  }
</style>