<template>
  <div class="preview">
    <h2 class="subtitle">Preview</h2>

    <table ref="table" class="table">
      <thead>
        <tr>
          <th colspan="2">Credit Card Amount</th>
        </tr>
        <tr>
          <th align="center" style="min-width: 100px">Date</th>
          <th>Amount</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in data.amountList" :key="item.date">
          <td>{{ item.date }} {{ item.week }}</td>
          <td>{{ item.moneys }}</td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td align="right">Total Amount</td>
          <td>{{ data.totalAmount }}</td>
        </tr>
        <tr>
          <td align="right">Total Count</td>
          <td>{{ data.totalCount }}</td>
        </tr>
        <tr>
          <td align="right">Create Date</td>
          <td>{{ new Date().format('YYYY.MM.DD') }}</td>
        </tr>
      </tfoot>
    </table>

    <div
      v-if="pictureVisible"
      class="picture-frame"
      @click="pictureVisible = false"
    >
      <p class="pictrue-tooltip">Long press to save the picture</p>
      <img class="picture-img" :src="pictrue" alt="">
    </div>

    <button class="button" @click="handleExportPicture">Export Picture</button>
  </div>
</template>

<script>
  // 第三方插件
  import html2canvas from 'html2canvas';

  // 方法
  import { download } from '@/utils/assist';

  export default {
    name: 'AmountPreview',

    props: {
      data: Object,
    },

    data() {
      return {
        pictrue: '',
        pictureVisible: false,
      };
    },

    methods: {
      handleExportPicture() {
        const EleTable = this.$refs.table;
        const options = {
          logging: false,
          scale: 2,
          scrollX: 0,
          scrollY: 0,
        };

        EleTable.className = 'table screenshot';
        html2canvas(EleTable, options).then(
          (canvas) => {
            EleTable.className = 'table';
            const picture = canvas.toDataURL('image/png');

            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i)) {
              this.pictrue = picture;
              this.pictureVisible = true;
            } else {
              download(new Date().format('YYYY-MM-DD.png'), picture);
            }
          }
        );
      },
    },
  };
</script>

<style>
  .preview {
    margin-bottom: 100px;
  }

  .table {
    max-width: 320px;
    margin: 1rem auto;
    border-right: 1px solid #e1e1e1;
    border-bottom: 1px solid #e1e1e1;
  }

  .screenshot {
    position: fixed;
    top: 0;
    left: 0;
  }

  .table th,
  .table td {
    border-top: 1px solid #e1e1e1;
    border-left: 1px solid #e1e1e1;
    padding: 0.2rem 0.4rem;
  }

  .table th,
  .table tfoot td {
    font-weight: 600;
  }

  .picture-frame {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding-bottom: 3rem;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .pictrue-tooltip {
    color: #fff;
    font-size: 1rem;
    margin: 1rem 0 ;
  }

  .picture-img {
    width: 75%;
  }
</style>