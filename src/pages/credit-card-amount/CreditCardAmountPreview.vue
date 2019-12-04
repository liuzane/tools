<template>
  <div style="width: 100%;">
    <div class="wrapper">
      <h2 class="subtitle">Preview</h2>
    </div>

    <table ref="table" class="table">
      <thead>
        <tr>
          <th colspan="2">Credit Card Amount</th>
        </tr>
        <tr>
          <th align="center" width="100px">Date</th>
          <th align="left">Amount</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in data.amountList" :key="item.date">
          <td>{{ item.date }} {{ item.week }}</td>
          <td>{{ item.moneys }}</td>
        </tr>
      </tbody>

      <tfoot>
        <tr class="total-item">
          <td align="right">Total Amount</td>
          <td>{{ data.totalAmount }}</td>
        </tr>
        <tr class="total-item">
          <td align="right">Total Count</td>
          <td>{{ data.totalCount }}</td>
        </tr>
        <tr class="total-item">
          <td align="right">Crated Date</td>
          <td>{{ new Date().format('YYYY.MM.DD') }}</td>
        </tr>
      </tfoot>
    </table>

    <div class="wrapper">
      <button class="button" @click="handleExportPicture">Export Picture</button>
    </div>
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
            const blob = this.base64ToBlob(picture);
            const url = URL.createObjectURL(blob);

            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i)) {
              window.location.href = url;
            } else {
              download(new Date().format('YYYY-MM-DD.png'), url);
            }
          }
        );
      },

      base64ToBlob(code) {
        const parts = code.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
      }
    },
  };
</script>

<style>
  .table {
    margin: 0 auto;
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
  .total-item {
    font-weight: 600;
  }

  .total-item {

  }
</style>