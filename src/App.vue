<template>

  <div id="app">
    <NavMenu />
    <router-view />
  </div>
</template>

<script>
import NavMenu from '@/components/layouts/NavMenu.vue';
export default {
  name: 'App',
  components: {
    NavMenu
  },
  data: () => ({
    //
  })
};
</script>

<style>
</style>