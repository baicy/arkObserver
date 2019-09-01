<template>
    <!-- <v-data-table
        :headers="headers"
        :items="heroes"
        :sort-by="['name']"
        hide-default-footer
        class="elevation-1"
    ></v-data-table> -->
    <v-container>
        <v-row>
            <v-btn @click="convertJson()">转换</v-btn>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div>
                    {{result}}
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    // item_table:items, stage, building_data:workshopFormulas.id.costs
    //item.type in [GOLD,MATERIAL]
    // GOLD:龙门币
    // MATERIAL:
    //  classifyType=NORMAL:采购凭证，赤金，龙骨，碳，建材，家具币,源石碎片
    //  classifyType=MATERIAL:材料，技能书，芯片助剂，芯片，信物
    //      ObtainApproach=null:龙门币，赤金，采购凭证，材料，技能书，碳，建材，芯片，家具币
    //      ObtainApproach!=null:龙骨，芯片助剂，信物
    // stageDropList
    // stageDrop occPer
    // ALWAYS: 固定掉落
    // ALMOST: 大概率
    // USUAL: 概率掉落
    // OFTEN: 小概率
    // SOMETIMES: 罕见
    // buildingProductList->formulaId
    // iconId
    // name
    // rarity 白0 绿1 蓝2 紫3 金4
    import items from "../data/item_table.json"
    import skills from "../data/skill_table.json"
export default {
    name: "PlanList",
    data () {
        return {
            origin:items,
            result:'',
            sortBy: 'name',
            headers:[
                { text: '', value: 'option' },
                { text: '干员', value: 'name' },
                { text: '星级', value: 'star' },
                { text: '升级项目', value: 'item' },
            ],
            heroes:[
                { name: '星熊', star: 6, item: '精英化 1->2' },
                { name: '安洁莉娜', star: 6, item: '精英化 1->2' },
                { name: '塞雷娅', star: 6, item: '技能 5->6' },
                { name: '塞雷娅', star: 6, item: '技能 6->7' },
                { name: '蓝毒', star: 5, item: '技能 5->6' },
            ],
        }
    },
    methods: {
        convertJson: function() {
            var result = {};
            for(var i in this.origin)
            {
                var r = {};
                var o = this.origin[i];
                if(o.rarity<2 || o.profession=='TOKEN')
                    continue;
                r.key = o.appellation;
                r.name = o.name;
                r.index = i;
                r.rarity = o.rarity+1;
                r.profession = o.profession;
                r.skills_up = [];
                for(var j in o.allSkillLvlup)
                {
                    var p = [];
                    for(var k in o.allSkillLvlup[j]['lvlUpCost'])
                    {
                        p.push([
                            o.allSkillLvlup[j]['lvlUpCost'][k]['id'],
                            o.allSkillLvlup[j]['lvlUpCost'][k]['count']
                        ]);
                    }
                    r.skills_up[j] = p;
                }
                if(o.rarity>2)
                {
                    r.skill_ups = [];
                    r.phases_up = [];
                    for(var j in o.phases)
                    {
                        var p = [];
                        if(o.phases[j].evolveCost==null) {
                             continue;
                        }
                        for(var k in o.phases[j]['evolveCost'])
                        {
                            p.push([
                                o.phases[j]['evolveCost'][k]['id'],
                                o.phases[j]['evolveCost'][k]['count']
                            ]);
                        }
                        r.phases_up[j-1] = p;
                    }
                }
                r.skill_names = [];
                for(var j in o.skills)
                {
                    r.skill_names[j] = skills[o.skills[j]['skillId']]['levels'][0]['name'];
                    if(o.rarity>2)
                    {
                        var p = [];
                        for(var k in o.skills[j]['levelUpCostCond'])
                        {
                            var q = [];
                            var t = o.skills[j]['levelUpCostCond'][k]['levelUpCost'];
                            for(var m in t)
                            {
                                q[m] = [t[m]['id'], t[m]['count']];
                            }
                            p[k] = q;
                        }
                        r.skill_ups[j] = p;
                    }
                }
                result[o.appellation] = r;
            }
            this.result = result;
        }
    },
};
</script>
