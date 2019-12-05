<template functional>
  <h1 class="title"><slot/></h1>
</template>

<script>
export default {
  name: 'Title',
};
</script>

<style>
  .title {
    font-size: 2.4rem;
    font-weight: 100;
    text-align: center;
    padding-top: 1rem;
  }
</style>