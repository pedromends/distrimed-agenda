<template>
  <router-view />
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'App'
  });
</script>

<style>
  p {
    margin: 0
  }

  * {
    font-family: "Poppins", serif;
    font-weight: 500;
    font-style: normal;
  }
</style>
