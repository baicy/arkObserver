//todo:在这里import json没用
let Converter = {};

const NEEDEDS = {
    materials: ["30011", "30012", "30013", "30014", "30021", "30022", "30023", "30024", "30031", "30032", "30033", "30034", "30041", "30042", "30043", "30044", "30051", "30052", "30053", "30054", "30061", "30062", "30063", "30064", "30073", "30074", "30083", "30084", "30093", "30094", "30103", "30104", "30115", "30125", "30135"],
    skill_books: ["3301", "3302", "3303"],
    chips: ["3211", "3212", "3213", "3221", "3222", "3223", "3231", "3232", "3233", "3241", "3242", "3243", "3251", "3252", "3253", "3261", "3262", "3263", "3271", "3272", "3273", "3281", "3282", "3283"],
    others: ["4001","4006","32001"]
};
const DROPPERCENTS = {
    'ALWAYS': '固定掉落',
    'ALMOST': '大概率',
    'USUAL': '概率掉落',
    'OFTEN': '小概率',
    'SOMETIMES': '罕见'
};
Converter.gameData = {
    toCharacters(characters,skills) {
        var result = {};
        for(var i in characters)
        {
            var r = {};
            var o = characters[i];
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
                var p = {};
                for(var k in o.allSkillLvlup[j]['lvlUpCost'])
                {
                    p[o.allSkillLvlup[j]['lvlUpCost'][k]['id']] = o.allSkillLvlup[j]['lvlUpCost'][k]['count'];
                }
                r.skills_up[j] = p;
            }
            if(o.rarity>2)
            {
                r.skill_ups = [];
                r.phases_up = [];
                for(var j in o.phases)
                {
                    var p = {};
                    if(o.phases[j].evolveCost==null) {
                        continue;
                    }
                    for(var k in o.phases[j]['evolveCost'])
                    {
                        p[o.phases[j]['evolveCost'][k]['id']] = o.phases[j]['evolveCost'][k]['count'];
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
                        var q = {};
                        var t = o.skills[j]['levelUpCostCond'][k]['levelUpCost'];
                        for(var m in t)
                        {
                            q[[t[m]['id']]] = t[m]['count'];
                        }
                        p[k] = q;
                    }
                    r.skill_ups[j] = p;
                }
            }
            result[o.appellation] = r;
        }
        return result;
    },
    // item_table:items, stage, building_data:workshopFormulas.id.costs
    //item.type in [GOLD,MATERIAL]
    // GOLD:龙门币4001
    // MATERIAL:
    //  classifyType=NORMAL:采购凭证，赤金，龙骨，碳，建材，家具币,源石碎片
    //  classifyType=MATERIAL:材料，技能书，芯片助剂，芯片，信物
    //      ObtainApproach=null:龙门币，赤金，采购凭证，材料，技能书，碳，建材，芯片，家具币
    //      ObtainApproach!=null:龙骨，芯片助剂，信物
    //      需要的只有龙门币4001，采购凭证4006，
    //          材料30011-30135，技能书3301-3303
    //          芯片3211-3283，芯片助剂32001
    //      仓库展示只有材料，技能书，采购凭证，芯片助剂，芯片
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
    toResources(items, stages, buildings) {
        var result = {materials:{}, skill_books:{}, chips:{}, others:{}};
        items = items.items;
        stages = stages.stages;
        var formulas = buildings.workshopFormulas;
        var neededIds = [
            ...NEEDEDS.materials,
            ...NEEDEDS.skill_books,
            ...NEEDEDS.chips,
            ...NEEDEDS.others
        ];
        for(var i in items)
        {
            if(!neededIds.includes(i))
                continue;
            var r = {};
            r.id = items[i].itemId;
            r.sortId = items[i].sortId;
            r.name = items[i].name;
            r.rarity = items[i].rarity;
            r.iconId = items[i].iconId;
            r.drops = {};
            if(items[i]['stageDropList'].length)
            {
                for(var j in items[i]['stageDropList'])
                {
                    var stageCode = stages[items[i]['stageDropList'][j]['stageId']].code;
                    r.drops[stageCode] = DROPPERCENTS[items[i]['stageDropList'][j]['occPer']];
                }
            }
            r.formula = {};
            r.formulaGoldCost = 0;
            if(items[i]['buildingProductList'].length && items[i]['buildingProductList'][0].roomType=='WORKSHOP')
            {
                var formula = formulas[items[i]['buildingProductList'][0]['formulaId']];
                r.formulaGoldCost = formula.goldCost;
                for(var j in formula.costs)
                {
                    r.formula[formula.costs[j]['id']] = formula.costs[j]['count'];
                }
            }
            var group = this.getItemGroup(i);
            result[group][i] = r;
        }
        return result;
    },
    getItemGroup(id) {
        if(NEEDEDS.materials.includes(id)) return 'materials';
        if(NEEDEDS.skill_books.includes(id)) return 'skill_books';
        if(NEEDEDS.chips.includes(id)) return 'chips';
        if(NEEDEDS.others.includes(id)) return 'others';
    }
}
export default Converter