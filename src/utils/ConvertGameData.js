let Converter = {};

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
        return result;
    }
    toResources() {
        var result = {};
        return result;
    }
}
export default Converter