<template>
<div id="app">
  <NavMenu class="top-nav-menu" />
  <router-view class="container-content" />
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

<style lang="less" scoped>
#app {
  height: 100%;
  .top-nav-menu {
    height: 60px;
  }
  .container-content {
    height: calc(100% - 63px);
    overflow-y: auto;
  }
}
</style>