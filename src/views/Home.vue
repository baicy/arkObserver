<template>
    <v-content>
        <v-row class="mt-6">
            <v-col cols="12" md="6" offset-md="2">
                <v-card dark tile class="elevation-3 fill-height">
                    <v-card-text>
                        <p>检测博士上线</p>
                        <p>不计算合成副产物</p>
                        <p>不计算大量经验需求</p>
                        <p>不计算大量龙门币需求</p>
                        <p v-if="planner">
                            当前规划期望消耗理智{{planner.cost}}点
                            作战{{planner.stage}}次
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <ArkMenu></ArkMenu>
            </v-col>
        </v-row>
    </v-content>
</template>

<script>
    import ArkMenu from '@/components/ArkTypeMenu'
    import StockManager from '@/utils/StockManager.js'
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
        computed: {
            planner() {
                if(!this.info)
                    return null;
                let stageSum = 0;
                for(let i of this.info.stages)
                {
                    stageSum += parseInt(i.count);
                }
                return { cost: this.info.cost, stage: stageSum };
            }
        },
        created() {
            // this.$loading.hide();
            let data = StockManager.getPlanner();
            const axios = require('axios');
            axios.post('https://planner.penguin-stats.io/plan/', data)
                .then(response => (this.info = response.data));
        }
    };
</script>
