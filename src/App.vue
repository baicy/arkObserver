<template>
  <v-app>
    <router-view/>
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
  created() {
    var loadStockManager = () => import('./utils/StockManager.js');
    loadStockManager().then((data) => {
        var stockManager = data.default;
        stockManager.init();
        var loadCharacterManager = () => import('./utils/CharacterManager.js');
        loadCharacterManager().then((data) => {
            var characterManager = data.default;
            characterManager.init();
        });
    });
  },
  mounted() {
    // this.$loading.show();
    // var app = this;
    // document.addEventListener('readystatechange', function(){
    //   if (document.readyState === 'complete') {
    //     app.$loading.hide();
    //   }
    // });
  }
};
</script>

<style>
</style>