<template>
    <v-container fluid>
        <v-row class="mt-6">
            <v-col cols="12" md="6" offset-md="2">
                <v-card dark tile class="elevation-3 fill-height" width="200px">
                    &nbsp;
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <ArkMenu></ArkMenu>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ArkMenu from '@/components/ArkTypeMenu'

    export default {
        name: 'home',
        components: {
            ArkMenu
        },
        data() {
            return {
                info: null
            }
        },
        mounted() {
            this.$loading.hide();
            // var data = JSON.parse('{"required":{"提纯源岩":6,"双极纳米片":4},"owned":{"源岩":8,"固源岩":17,"固源岩组":1,"提纯源岩":1,"代糖":1,"糖":11,"糖组":28,"糖聚块":12,"酯原料":11,"聚酸酯":16,"聚酸酯组":5,"聚酸酯块":4,"异铁碎片":2,"异铁":22,"异铁组":7,"异铁块":1,"双酮":8,"酮凝集":9,"酮凝集组":3,"酮阵列":6,"破损装置":7,"装置":9,"全新装置":3,"改量装置":1,"扭转醇":103,"轻锰矿":31,"研磨石":68,"五水研磨石":5,"RMA70-12":1,"RMA70-24":7,"聚合剂":3,"双极纳米片":3,"D32钢":3},"exp_demand":true,"extra_outc":true,"gold_demand":true}');
            // console.log(data);
            // const axios = require('axios');
            // axios.post('https://planner.penguin-stats.io/plan/', data)
            //     .then(response => (this.info = response));
        }
    };
</script>
