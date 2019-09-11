import { StoreOrderMaterialIds, CustomizeOrderMaterialGroupIds } from '../data/Statics.js'
import resources from '../data/resources.json'
import store from '../store.js'

let StockManager = {};

StockManager.init = () => {
    let stocks = store.state.stocks;
    const MATERIALS = Object.assign({}, resources.materials, resources.chips, resources.skill_books, resources.others);
    let formulateds = store.state.formulateds;
    const [NEEDS, FORMULATEDNEEDS] = StockManager.calNeeds();
    
    for(let i in CustomizeOrderMaterialGroupIds)
    {
        for(let j in CustomizeOrderMaterialGroupIds[i])
        {
            let id = CustomizeOrderMaterialGroupIds[i][j];
            stocks[id] = {
                id: id,
                name: MATERIALS[id].name,
                have: stocks[id]?stocks[id].have:0,
                need: NEEDS[id]?NEEDS[id]:0,
                formulatedNeed: FORMULATEDNEEDS[id]?FORMULATEDNEEDS[id]:0
            };
            formulateds[id] = false;
        }
    }
    store.commit('updateStocks', stocks);
    store.commit('updateFormulateds', formulateds);
};

StockManager.calNeeds = () => {
    let needs = {};
    let formulatedNeeds = {};
    const PLANS = store.state.plans;
    const STOCKS = store.state.stocks;
    const FORMULATEDS = store.state.formulateds;
    for(let i in PLANS)
    {
        for(let j in PLANS[i])
        {
            for(let k in PLANS[i][j].needs)
            {
                needs[k] = needs[k]?(needs[k]+PLANS[i][j].needs[k]):PLANS[i][j].needs[k];
            }
        }
    }
    formulatedNeeds = Object.assign({}, needs);
    for(let i in CustomizeOrderMaterialGroupIds)
    {
        for(let j in CustomizeOrderMaterialGroupIds[i])
        {
            let id = CustomizeOrderMaterialGroupIds[i][j];
            if(FORMULATEDS[id])
            {
                for(let k in resources.materials[id].formula)
                {
                    let shortage = needs[id]-STOCKS[id].have;
                    shortage = shortage<0 ? 0 : shortage;
                    let formulatedShortage = resources.materials[id].formula[k]*shortage;
                    formulatedNeeds[k] = formulatedNeeds[k]?(formulatedNeeds[k]+formulatedShortage):formulatedShortage;
                }
            }
        }
    }
    return [needs, formulatedNeeds];
};

StockManager.getRequirements = () => {
    let stocks = store.state.stocks;
    const MATERIALS = Object.assign({}, resources.materials, resources.chips, resources.skill_books, resources.others);
    const FORMULATEDS = store.state.formulateds;
    const [NEEDS, FORMULATEDNEEDS] = StockManager.calNeeds();
    let requirements = {};
    const GROUPS = Object.keys(CustomizeOrderMaterialGroupIds);
    for(let i in GROUPS)
        requirements[GROUPS[i]] = [];
    for(let i in CustomizeOrderMaterialGroupIds)
    {
        for(let j in CustomizeOrderMaterialGroupIds[i])
        {
            let id = CustomizeOrderMaterialGroupIds[i][j];
            let ableFormulated = false;
            if(['t2','t3','t4','t5'].includes(i) && Object.keys(resources.materials[id].formula).length)
                ableFormulated = true;
            let ableMerge = true;
            for(let k in MATERIALS[id].formula)
            {
                if(stocks[k].have<MATERIALS[id].formula[k]) ableMerge = false;
            }
            requirements[i].push({
                id: id,
                ableFormulated: ableFormulated,
                ableMerge: ableMerge,
                formulated: FORMULATEDS[id],
                formula: MATERIALS[id].formula,
                require: FORMULATEDNEEDS[id]?FORMULATEDNEEDS[id]:0,
                stock:stocks[id].have,
                shortage:stocks[id].formulatedNeed-stocks[id].have
            });
            stocks[id] = {
                id: id,
                name: MATERIALS[id].name,
                have: stocks[id]?stocks[id].have:0,
                need: NEEDS[id]?NEEDS[id]:0,
                formulatedNeed: FORMULATEDNEEDS[id]?FORMULATEDNEEDS[id]:0
            };
        }
    }
    store.commit('updateStocks', stocks);
    return requirements;
};

StockManager.displaySort = () => {
    let ids = [];
    const MATERIALS = Object.assign({}, resources.materials, resources.chips, resources.skill_books, resources.others);
    for(let i in StoreOrderMaterialIds)
    {
        ids.push({
            id: StoreOrderMaterialIds[i],
            rarity: MATERIALS[StoreOrderMaterialIds[i]].rarity,
            iconId: MATERIALS[StoreOrderMaterialIds[i]].iconId
        });
    }
    return ids;
};

StockManager.displayCustomize = () => {
    let ids = {};
    const MATERIALS = Object.assign({}, resources.materials, resources.chips, resources.skill_books, resources.others);
    const GROUPS = Object.keys(CustomizeOrderMaterialGroupIds);
    for(let i in GROUPS)
        ids[GROUPS[i]] = [];

    for(let i in CustomizeOrderMaterialGroupIds)
    {
        for(let j in CustomizeOrderMaterialGroupIds[i])
        {
            let item = MATERIALS[CustomizeOrderMaterialGroupIds[i][j]];
            ids[i].push({
                id: item.id,
                rarity: item.rarity,
                iconId: item.iconId
            });
        }
    }
    return ids;
};

StockManager.getPlanner = () => {
    let data = {
        required: {},
        owned: {},
        exp_demand: false,
        extra_outc: false,
        gold_demand: false
    };
    const STOCKS = store.state.stocks;
    const MATERIALS_IDS = Object.keys(resources.materials);
    for(let i in STOCKS)
    {
        if(!MATERIALS_IDS.includes(i))
            continue;
        if(STOCKS[i].need>0)
            data.required[STOCKS[i].name] = parseInt(STOCKS[i].need);
        if(STOCKS[i].have>0)
            data.owned[STOCKS[i].name] = parseInt(STOCKS[i].have);
    }
    return data;
};

export default StockManager