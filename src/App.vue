<template>
  <v-app>
        <RandomBackground />
        <v-app-bar app dark>
        <v-toolbar-title class="headline">
            <span>Arknights Observer</span>
            <span class="font-weight-light subtitle-2"> Demo</span>
        </v-toolbar-title>
        <v-toolbar-items>
            <v-btn text router-link to="/">计划</v-btn>
            <v-btn text router-link to="/character">干员</v-btn>
            <v-btn text>刷图</v-btn>
            <v-btn text>库存</v-btn>
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
import PlanList from './components/PlanList'
import RandomBackground from './components/RandomBackground'

export default {
  name: 'App',
  components: {
    PlanList,
    RandomBackground
  },
  data: () => ({
    //
  }),
};
</script>
