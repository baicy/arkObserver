<template>
  <v-app>
        <v-app-bar app dark>
        <v-toolbar-title class="headline">
            <span router-link to="/">Arknights Observer</span>
            <span class="font-weight-light subtitle-2"> Demo</span>
        </v-toolbar-title>
        <v-toolbar-items>
            <v-btn text router-link to="/">计划</v-btn>
            <v-btn text router-link to="/character">练度</v-btn>
            <v-btn text router-link to="/stock">仓库</v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
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
