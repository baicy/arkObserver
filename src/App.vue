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
  computed: {
    router() {
      return this.$route.name
    }
  },
  watch: {
    router(newVal, oldVal) {
      this.$loading.show();
    }
  },
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