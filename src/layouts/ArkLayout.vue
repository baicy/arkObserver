<template>
    <v-layout>
        <v-navigation-drawer app v-model="drawer" :width="($vuetify.breakpoint.mdAndUp?24:20)+'rem'">
            <router-view name="list"/>
        </v-navigation-drawer>
        <v-app-bar
            color="black"
            dark
            fixed
            app
            dense
            clipped-right
            >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-items>
                <v-btn text router-link to='/'>首页</v-btn>
                <v-btn text router-link to='/plan'>规划</v-btn>
                <v-btn text router-link to='/character'>干员</v-btn>
                <v-btn text router-link to='/stock'>仓库</v-btn>
            </v-toolbar-items>
            <v-spacer />
        </v-app-bar>
        <v-content>
            <transition
                name="slide-fade"
                mode="out-in"
                >
                <router-view />
            </transition>
        </v-content>
    </v-layout>
</template>

<script>
    export default {
        name: 'ArkLayout',
        components: {
            //
        },
        data() {
            return {
                drawer: !this.$vuetify.breakpoint.xsOnly
            }
        },
        methods: {
            //
        }
    };
</script>