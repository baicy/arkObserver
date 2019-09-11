// import { CustomizeOrderMaterialGroupIds } from '../data/Statics.js'
// import resources from '../data/resources.json'
import characters from '../data/characters.json'
import store from '../store.js'

let PlanManager = {};

PlanManager.num = () => {
    let l = 0;
    const PLANS = store.state.plans;
    for(let i in PLANS)
    {
        l += Object.keys(PLANS[i]).length;
    }
    return l;
};

PlanManager.display = () => {
    let displayPlans = [];
    const PLANS = store.state.plans;
    const STOCKS = store.state.stocks;
    for(let i in PLANS)
    {
        for(let j in PLANS[i])
        {
            let plan = Object.assign({}, PLANS[i][j]);
            plan.key = j;
            let completed = true;
            for(let k in plan.needs)
            {
                if(plan.needs[k]>STOCKS[k].have)
                    completed = false;
            }
            plan.completed = completed;
            let stage = store.state.characters[i];
            if(!stage)
            {
                stage = [0,1,[0,0,0],[0,1,[0,0,0]]];
            }
            let onstage = false;
            let titles = j.split('-');
            if(titles[1]=='phase') {
                onstage = (stage[0] == titles[2]);
            } else if(titles[2]=='all'){
                onstage = (stage[1] == titles[3]);
            } else {
                onstage = (stage[2][titles[2]] == titles[3]);
            }
            plan.onstage = onstage;
            displayPlans.push(plan);
        }
    }
    return displayPlans;
};

PlanManager.addPre = (item) => {
    if(item=='6-phase-2')
    {
        for(let i in characters)
        {
            let c = characters[i];
            if(c.rarity!=6) continue;
            let status = store.getters.getCharacter(i);
            let plans = Object.assign({}, store.state.plans);
            if(status){
                status[3][0] = 2;
            } else {
                status = [0,1,[0,0,0],[0,1,[0,0,0]]];
            }
            let key = '';
            let title = '';
            if(!plans[c.key]) plans[c.key] = {};
            for(let j=status[0];j<2;j++)
            {
                key = c.key+'-phase-'+j;
                title = '精英化 '+j+'→'+(parseInt(j)+1);
                plans[c.key][key] = { charKey:c.key, charName:c.name, item:title, needs:c.phases_up[j] };
            }
            store.commit('updateCharacter', {key: c.key, status: status});
            store.commit('updatePlans', plans);
        }
    } else if(item=='6-skill-7') {
        for(let i in characters)
        {
            let c = characters[i];
            if(c.rarity!=6) continue;
            let status = store.getters.getCharacter(i);
            let plans = Object.assign({}, store.state.plans);
            if(status){
                status[3][1] = 7;
            } else {
                status = [0,1,[0,0,0],[0,7,[0,0,0]]];
            }
            let key = '';
            let title = '';
            if(!plans[c.key]) plans[c.key] = {};
            for(let j=status[1];j<7;j++)
            {
                key = c.key+'-skill-all-'+j;
                title = '技能等级 '+j+'→'+(parseInt(j)+1);
                plans[c.key][key] = { charKey:c.key, charName:c.name, item:title, needs:c.skills_up[j-1] };
            }
            store.commit('updateCharacter', {key: c.key, status: status});
            store.commit('updatePlans', plans);
        }
    }
};

PlanManager.reset = () => {
    let infos = store.getters.getCharacters();
    for(let i in characters)
    {
        infos[i][3] = [0,1,[0,0,0]];
    }
    store.commit('resetPlans');
};

PlanManager.remove = (plan) => {
    // 更新存储的人物数据
    const TITLES = plan.key.split('-');
    let status = store.getters.getCharacter(plan.charKey);
    if(TITLES[1]=='phase') {
        if(status[3][0]==(parseInt(TITLES[2])+1))
            status[3][0] = parseInt(TITLES[2]);
    } else if(TITLES[2]=='all'){
        if(status[3][1]==(parseInt(TITLES[3])+1))
            status[3][1] = parseInt(TITLES[3]);
    } else {
        if(status[3][2][TITLES[2]]==(parseInt(TITLES[3])+1))
            status[3][2][TITLES[2]] = parseInt(TITLES[3]);
    }
    store.commit('removePlan', { char: plan.charKey, key: plan.key});
};

PlanManager.complete = (plan) => {
    // 更新存储的人物数据
    const TITLES = plan.key.split('-');
    let status = store.getters.getCharacter(plan.charKey);
    if(TITLES[1]=='phase') {
        status[0] = parseInt(TITLES[2])+1;
    } else if(TITLES[2]=='all'){
        status[1] = parseInt(TITLES[3])+1;
    } else {
        status[2][TITLES[2]] = parseInt(TITLES[3])+1;
    }
    // 更新库存
    const STOCKS = store.getters.getStocks();
    for(let i in plan.needs)
    {
        let newStock = STOCKS[i].have-plan.needs[i];
        if(newStock<0) newStock = 0;
        store.commit('updateStock', {id: i, amount: newStock});
    }
    store.commit('removePlan', { char: plan.charKey, key: plan.key});
};

export default PlanManager