<template>
    <v-container fluid class="px-0 py-0">
        <v-row v-resize="onResize">
            <v-col cols="12" md="4" class="py-0">
                <v-data-table
                    :headers="headers"
                    :items="plans_array"
                    class="elevation-1"
                    fixed-header
                    :height="windowSize.height-100"
                    :items-per-page="-1"
                    hide-default-footer
                    show-expand
                    :expanded.sync="expanded"
                    item-key="key"
                    >
                    <template v-slot:item.option="{item}">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn text icon color="green lighten-1" v-on="on" :disabled="!(item.completed&&item.onstage)" @click="completePlan(item)">
                                    <v-icon v-if="item.completed && !item.onstage">mdi-check-circle-outline</v-icon>
                                    <v-icon v-else="item.onstage">mdi-check</v-icon>
                                </v-btn>
                            </template>
                            <span>完成</span>
                        </v-tooltip>
                        
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn text icon color="red lighten-1" v-on="on" @click="removePlan(item)">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </template>
                            <span>移除</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:no-data>
                        <v-btn text icon color="primary" router-link to="/character">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <template v-slot:expanded-item="{ item }">
                         <td :colspan="headers.length+1">
                             <Item size="xsmall" v-for="(quantity,itemId) in item.needs" :key="itemId" :item="materials[itemId]" :need-quantity="quantity"></Item>
                         </td>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="12" md="8" class="py-0">
                <v-row>
                    <v-col cols="6" md="3" v-for="(quantity, index) in requirement" :key="'require-'+index" class="py-1">
                        <RequirementItem
                            :item="materials[index]"
                            :requirement="requirement[index]"
                            :stock="stock[index]"
                            :shortage="shortage[index]"
                            ></RequirementItem>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Item from '../components/ResourceItem.vue'
    import resources from '../data/resources.json'
    import RequirementItem from '../components/RequirementItem.vue'
    export default {
        name: "PlanList",
        components: {
            Item,
            RequirementItem
        },
        data () {
            return {
                result:'',
                windowSize:{width:0, height:0},
                plans: this.$store.getters.getPlans(),
                plans_array: [],
                stock: {},
                headers:[
                    { text: '干员', value: 'charName' },
                    { text: '项目', value: 'item' },
                    { text: '', value: 'option', sortable: false },
                ],
                expanded: [],
                materials: Object.assign({},resources.materials,resources.skill_books,resources.chips)
            }
        },
        computed: {
            requirement: function() {
                var requirement = {};
                for(var i in this.plans_array)
                {
                    var needs = this.plans_array[i].needs;
                    for(var j in needs) {
                        requirement[j] = requirement[j]?(requirement[j]+needs[j]):needs[j];
                    }
                }
                return requirement;
            },
            shortage: function() {
                var shortage = {};
                for(var i in this.requirement)
                {
                    shortage[i] = this.requirement[i]-this.stock[i];
                }
                return shortage;
            },
        },
        methods: {
            updatePlan: function(item) {
                // 更新存储的人物数据
                var titles = item.key.split('-');
                var status = this.$store.getters.getCharacter(item.charKey);
                if(titles[1]=='phase') {
                    status[0] = parseInt(titles[2])+1;
                } else if(titles[2]=='all'){
                    status[1] = parseInt(titles[3])+1;
                } else {
                    status[2][titles[2]] = parseInt(titles[3])+1;
                }
                // 更新库存
                for(var i in item.needs)
                {
                    this.stock[i] -= item.needs[i];
                }
                this.$store.commit('updateStocks', this.stock);
            },
            deletePlan: function(item) {
                // 更新存储的人物数据
                var titles = item.key.split('-');
                var status = this.$store.getters.getCharacter(item.charKey);
                if(titles[1]=='phase') {
                    if(status[3][0]==(parseInt(titles[2])+1))
                        status[3][0] = parseInt(titles[2]);
                } else if(titles[2]=='all'){
                    if(status[3][1]==(parseInt(titles[3])+1))
                        status[3][1] = parseInt(titles[3]);
                } else {
                    if(status[3][2][titles[2]]==(parseInt(titles[3])+1))
                        status[3][2][titles[2]] = parseInt(titles[3]);
                }
            },
            removePlanCommon: function(item) {
                // 更新页面显示，移除该行
                //done:remove无法实时移除该行，刷新页面其实已经删了数据,是因为操作的数组是computed
                //     complete的时候会移除下一行
                //     还可以直接watch plans，但只监听删除目前意义不大
                const index = this.plans_array.indexOf(item);
                this.plans_array.splice(index, 1);
                // 移除该计划项目
                delete this.plans[item.charKey][item.key];
                this.$store.commit('updatePlansData', this.plans);
            },
            completePlan: function(item) {
                this.updatePlan(item);
                this.removePlanCommon(item);
            },
            removePlan: function(item) {
                this.deletePlan(item);
                this.removePlanCommon(item);
            },
            onResize () {
                this.windowSize = {width: window.innerWidth, height:window.innerHeight};
            }
        },
        mounted() {
            var plans_array = [];
            var stock = this.$store.getters.getStocks();
            for(var i in this.plans)
            {
                for(var j in this.plans[i])
                {
                    var plan = Object.assign({}, this.plans[i][j]);
                    plan.key = j;
                    var completed = true;
                    for(var k in this.plans[i][j].needs)
                    {
                        if(!stock[k]) stock[k] = 0;
                        if(this.plans[i][j].needs[k]>stock[k])
                            completed = false;
                    }
                    plan.completed = completed;
                    var stage = this.$store.getters.getCharacter(i);
                    var onstage = false;
                    var titles = j.split('-');
                    if(titles[1]=='phase') {
                        onstage = (stage[0] == titles[2]);
                    } else if(titles[2]=='all'){
                        onstage = (stage[1] == titles[3]);
                    } else {
                        onstage = (stage[2][titles[2]] == titles[3]);
                    }
                    plan.onstage = onstage;
                    plans_array.push(plan);
                }
            }
            this.plans_array = plans_array;
            this.stock = stock;
            this.$store.commit('updateStocks', stock);
        }
    };
</script>
