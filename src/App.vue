<template>
  <v-app>
        <v-app-bar app dark>
        <v-toolbar-title class="headline mr-5">
            <router-link tag="span" to="/">
                <span>Arknights Observer</span>
                <span class="font-weight-light subtitle-2"> Demo</span>
            </router-link>
        </v-toolbar-title>
        <v-toolbar-items>
            <v-btn text router-link to="/">计划</v-btn>
            <v-btn text router-link to="/character">练度</v-btn>
            <v-btn text router-link to="/stock">仓库</v-btn>
        </v-toolbar-items>
    </v-app-bar>
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
};
</script>

<style>
    .headline {
        cursor: pointer;
    }
</style>