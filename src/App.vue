<template>
  <section class="container">
    <header class="header">
      <Title>Tools</Title>
    </header>

    <section class="content">
      <a
        v-for="(tool, index) in tools"
        :key="index"
        :href="tool.link"
      >
        {{ tool.title }}
      </a>
    </section>
  </section>
</template>

<script>
  // 公共组件
  import Title from '@/components/Title';

  export default {
    name: 'App',

    components: {
      Title,
    },

    data() {
      return {
        tools: [
          {
            title: 'Credit Card Amount',
            link: './credit-card-amount.html',
          },
          {
            title: 'MCC Query',
            link: './mcc-query.html',
          },
        ],
      };
    },
  };
</script>

<style>
  .container {
    height: 100%;
    text-align: center;
  }

  .header {
    width: 100%;
  }

  .content {
    margin-top: 2rem;
  }

  .content a {
    display: block;
    margin: 1rem 0;
    color: #000;
    font-size: 1rem;
    font-weight: 100;
  }
</style>