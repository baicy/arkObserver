<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
      //
  },
  data: () => ({
    //
  }),
  mounted() {
    this.$loading.show();
    var app = this;
    document.addEventListener('readystatechange', function(){
      if (document.readyState === 'complete') {
        app.$loading.hide();
      }
    });
  }
};
</script>

<style>
</style>