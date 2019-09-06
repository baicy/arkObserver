<template>
    <v-container fluid class="px-0 py-0">
        <v-row v-resize="onResize">
            <v-col cols="12" md="4" class="py-0">
                <v-data-table
                    :headers="headers"
                    :items="plans_array"
                    class="elevation-1"
                    fixed-header
                    :height="windowSize.height-80"
                    :items-per-page="-1"
                    hide-default-footer
                    show-expand
                    :expanded.sync="expanded"
                    item-key="key"
                    calculate-widths
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
                    <template v-slot:header.option="{ header }">
                        <v-btn text tile small outlined class="mr-1 mb-1" color="primary" router-link to="/character">添加</v-btn>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    text tile small outlined class="mr-1 mb-1" color="green lighten-1"
                                    v-on="on"
                                    >
                                    预设
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item
                                    v-for="(item, index) in preItems"
                                    :key="index"
                                    @click="addPrePlans(index)"
                                    >
                                <v-list-item-title>{{ item }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <v-btn text tile small outlined class="mb-1" color="red lighten-1" @click="resetPlans">清空</v-btn>
                    </template>
                    <template v-slot:expanded-item="{ item }">
                        <td :colspan="headers.length+1">
                            <Item size="xsmall" v-for="(quantity,itemId) in item.needs" :key="itemId" :item="materials[itemId]" :need-quantity="quantity"></Item>
                        </td>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="12" md="8" class="py-0">
                <v-card tile :height="windowSize.height-80" class= "d-flex flex-column px-3 py-3" style="overflow-y:auto">
                    <div v-for="n in ['t5','t4','t3','t2','t1','chip3','chip1','books']" class="d-flex flex-row flex-wrap">
                        <RequirementItem
                            v-if="m.require>0"
                            v-for="(m,index) in requirements[n]"
                            :key="n+'-'+index"
                            :item="materials[m.id]"
                            :info="m"
                            ></RequirementItem>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    import Item from '../components/ResourceItem.vue'
    import resources from '../data/resources.json'
    import RequirementItem from '../components/RequirementItem.vue'
    import characters from '../data/characters.json'
    import Icon from '../components/ResourceIcon.vue'
    export default {
        name: "PlanList",
        components: {
            Item,
            RequirementItem,
            Icon
        },
        data () {
            return {
                result:'',
                windowSize:{width:0, height:0},
                plans: {},
                plans_array: [],
                stock: {},
                headers:[
                    { text: '干员', value: 'charName' },
                    { text: '项目', value: 'item' },
                    { text: '', value: 'option', sortable: false },
                ],
                expanded: [],
                preItems: {
                    '6-phase-2':'6星精2',
                    '6-skill-7':'6星技能7'
                },
                materials: {},
                groupMaterials: {}
            }
        },
        computed: {
            requirements: function() {
                var requirement = {};
                var formulateds = this.$store.getters.getFormulateds();
                var ableMerges = {};
                var ableFormulateds = {};
                for(var i in this.plans_array)
                {
                    var needs = this.plans_array[i].needs;
                    for(var j in needs) {
                        requirement[j]?Vue.set(requirement,j, requirement[j]+needs[j]):Vue.set(requirement,j,needs[j]);
                    }
                }
                var mids = Object.keys(resources.materials);
                mids.sort(function(a,b){
                    return resources.materials[b].rarity-resources.materials[a].rarity;
                });
                for(var i in mids)
                {
                    if(requirement[mids[i]])
                    {
                        var ableMerge = true;
                        for(var j in resources.materials[mids[i]].formula)
                        {
                            if(this.stock[j]<resources.materials[mids[i]].formula[j]) ableMerge = false;
                            if(formulateds[mids[i]])
                            {
                                var tshortage = requirement[mids[i]]-this.stock[mids[i]];
                                tshortage= tshortage<0?0:tshortage;
                                var t = resources.materials[mids[i]].formula[j]*tshortage;
                                requirement[j]?Vue.set(requirement,j,requirement[j]+t):Vue.set(requirement,j,t);
                            }
                        }
                        ableMerges[mids[i]] = ableMerge;
                        if(resources.materials[mids[i]].rarity>0 && Object.keys(resources.materials[mids[i]].formula).length) ableFormulateds[mids[i]] = true;
                    }
                }
                var groupRequirements = {};
                for(var i in this.groupMaterials)
                {
                    groupRequirements[i] = [];
                    for(var j in this.groupMaterials[i])
                    {
                        var mid = this.groupMaterials[i][j];
                        groupRequirements[i].push({
                            id: mid,
                            ableFormulated: ableFormulateds[mid]?ableFormulateds[mid]:false,
                            ableMerge: ableMerges[mid]?ableMerges[mid]:false,
                            formulated: formulateds[mid],
                            formula: this.materials[mid].formula,
                            require:requirement[mid],
                            stock:this.stock[mid],
                            shortage:requirement[mid]-this.stock[mid]
                        });
                    }
                }
                return groupRequirements;
            }
        },
        watch: {
            plans: {
                handler(newValue, oldValue) {
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
                            if(!stage)
                            {
                                stage = [0,1,[0,0,0],[0,1,[0,0,0]]];
                            }
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
                },
                deep: true
            },
            stock: {
                handler(newVal, oldVal) {
                    for(var i in this.plans_array)
                    {
                        var completed = true;
                        for(var j in this.plans_array[i].needs)
                        {
                            if(this.plans_array[i].needs[j]>this.stock[j])
                                completed = false;
                        }
                        this.plans_array[i].completed = completed;
                    }
                },deep:true
            }
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
            },
            addPrePlans(item) {
                if(item=='6-phase-2')
                {
                    for(var i in characters)
                    {
                        var c = characters[i];
                        if(c.rarity!=6) continue;
                        var status = this.$store.getters.getCharacter(i);
                        if(status){
                            status[3][0] = 2;
                        } else {
                            status = [0,1,[0,0,0],[0,1,[0,0,0]]];
                        }
                        var key = '';
                        var title = '';
                        if(!this.plans[c.key]) Vue.set(this.plans, c.key, {});
                        for(var j=status[0];j<2;j++)
                        {
                            key = c.key+'-phase-'+j;
                            title = '精英化 '+j+'→'+(parseInt(j)+1);
                            Vue.set(this.plans[c.key], key, { charKey:c.key, charName:c.name, item:title, needs:c.phases_up[j] });
                        }
                        this.$store.commit('updateCharacter', {key: c.key, status: status});
                        this.$store.commit('updatePlansData', this.plans);
                    }
                } else if(item=='6-skill-7') {
                    for(var i in characters)
                    {
                        var c = characters[i];
                        if(c.rarity!=6) continue;
                        var status = this.$store.getters.getCharacter(i);
                        if(status){
                            status[3][1] = 7;
                        } else {
                            status = [0,1,[0,0,0],[0,7,[0,0,0]]];
                        }
                        var key = '';
                        var title = '';
                        if(!this.plans[c.key]) Vue.set(this.plans, c.key, {});
                        for(var j=status[1];j<7;j++)
                        {
                            key = c.key+'-skill-all-'+j;
                            title = '技能等级 '+j+'→'+(parseInt(j)+1);
                            Vue.set(this.plans[c.key], key, { charKey:c.key, charName:c.name, item:title, needs:c.skills_up[j-1] });
                        }
                        this.$store.commit('updateCharacter', {key: c.key, status: status});
                        this.$store.commit('updatePlansData', this.plans);
                    }
                }
            },
            resetPlans() {
                var characters = this.$store.getters.getCharacters();
                for(var i in characters)
                {
                    characters[i][3] = [0,1,[0,0,0]];
                }
                this.plans = {};
                this.$store.commit('resetPlansData');
            }
        },
        mounted() {
            this.plans = this.$store.getters.getPlans();
            var stock = this.$store.getters.getStocks();
            this.groupMaterials = {
                t1:[],t2:[],t3:[],t4:[],t5:[],chip1:[],chip2:[],chip3:[],books:[]
            };
            for(var i in resources.materials)
            {
                this.groupMaterials['t'+(resources.materials[i].rarity+1)].push(i);
                if(!stock[i]) Vue.set(stock, i, 0);
            }
            for(var i in resources.chips)
            {
                this.groupMaterials['chip'+(resources.chips[i].rarity-1)].push(i);
                if(!stock[i]) Vue.set(stock, i, 0);
            }
            for(var i in resources.skill_books)
            {
                this.groupMaterials['books'].push(i);
                if(!stock[i]) Vue.set(stock, i, 0);
            }
            this.stock = stock;
            this.materials = Object.assign({}, resources.materials, resources.chips, resources.skill_books, resources.others);
            // this.$store.commit('updateStocks', stock);
        }
    };
</script>
<style>
    .require-table table {
        border: 1px solid rgba(0, 0, 0, 0.12);
        width: inherit;
    }
</style>