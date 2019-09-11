<template>
    <div class="d-flex flex-column ak-menu" :style="'transform: perspective(1000px) rotateY('+rotateY+'deg);'">
        <v-hover v-slot:default="{ hover }">
            <v-card tile class="d-flex mt-2 ml-10 justify-end ak-block-link ak-block-plan"
                :elevation="hover?12:3"
                @click="$router.push('/plan')">
                <div class="d-flex display-2 mt-6 mr-4">{{planNum}}</div>
                <div class="d-flex display-1 font-weight-medium mr-5 mt-7 pr-12" style="width:190px">
                    规划
                </div>
            </v-card>
        </v-hover>
        <div class="d-flex mt-2">
            <v-hover v-slot:default="{ hover }">
                <v-card tile class="ml-2 px-6 py-2 ak-block-link"
                    width="160px" height="75px"
                    :elevation="hover?12:3"
                    @click="$router.push('/character')">
                    <div class="headline font-weight-medium mt-1">干员</div>
                    <div class="caption grey--text my-0 ml-1">角色管理</div>
                </v-card>
            </v-hover>
            <v-hover v-slot:default="{ hover }">
                <v-card tile class="ml-2 px-6 py-2 ak-block-link"
                    width="160px" height="75px"
                    :elevation="hover?12:3"
                    @click="$router.push('/stock')">
                    <div class="headline font-weight-medium mt-1">仓库</div>
                    <div class="caption grey--text my-0 ml-1">材料管理</div>
                </v-card>
            </v-hover>
        </div>
        <v-card tile dark color="primary lighten-2" width="340px" class="d-flex flex-column mt-2 ml-6 px-1 pt-1">
            <v-card dark tile class="d-flex px-2 py-1 body-2">数据来源</v-card>
            <div class="d-flex my-1 px-0">
                <div class="d-flex px-3 body-2 ak-block-link" @click="goToLink('https://planner.penguin-stats.io/')">
                    Ark Planner
                </div>
                <v-divider vertical></v-divider>
                <div class="d-flex px-3 body-2 ak-block-link" @click="goToLink('https://penguin-stats.io/')">
                    Penguin Statistics
                </div>
                <v-divider vertical></v-divider>
                <div class="d-flex px-3 body-2 ak-block-link" @click="goToLink('https://github.com/Perfare/ArknightsGameData')">
                    Arknights GameData
                </div>
            </div>
        </v-card>
    </div>
</template>
<script>
    import PlanManager from '../utils/PlanManager.js'
    export default {
        name: 'ArklikeMenu',
        data() {
            return {
                rotateY: -10
            }
        },
        computed: {
            planNum: () => PlanManager.num()
        },
        methods: {
            rotateWithMouse(event) {
                const e = event || window.event || arguments.callee.caller.arguments[0];
                if(!e) return;
                this.rotateY = 10 * (event.pageX / window.innerWidth) - 15;
            },
            goToLink(href) {
                window.open(href);
            }
        },
        mounted() {
            window.addEventListener('mousemove',this.rotateWithMouse);
        }
    };
</script>
<style>
    .ak-menu {
        width: 320px;
        transform-style: preserve-3d;
    }
    .ak-menu .ak-block-plan {
        width: 500px;
        height: 100px;
        border-bottom: 4px solid;
        border-image: linear-gradient(to right, white, white 35%, orangered 35%, orangered 90%, white 90%, white) 1;
    }
    .ak-menu .ak-block-link {
        cursor: pointer;
    }
</style>