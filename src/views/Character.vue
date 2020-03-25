<template>
  <el-card>
    <div slot="header">
      <div>
        <div class="filter-box filter-box-inline" style="margin-right:120px">
          <div class="group">
            <el-button @click="allRarity" :type="filtersByRarity.length==6?'':'success'" :icon="filtersByRarity.length==6?'':'el-icon-refresh-right'" size="small">稀有度</el-button>
          </div>
          <div class="methods">
            <el-button @click="toggleRarity(6-i)" :type="filtersByRarity.includes(6-i)?'primary':''" v-for="i in 6" :key="i" size="small" icon="el-icon-star-on">{{7-i}}</el-button>
          </div>
        </div>
        <div class="filter-box filter-box-inline">
          <div class="group">
            <el-button @click="allProfession" :type="filtersByProfession.length==8?'':'success'" :icon="filtersByProfession.length==8?'':'el-icon-refresh-right'" size="small">职业</el-button>
          </div>
          <div class="methods">
            <el-button @click="toggleProfession(i)" :type="filtersByProfession.includes(i)?'primary':''" v-for="i in filtersOfProfession" :key="i" size="small">{{professions[i]}}</el-button>
          </div>
        </div>
      </div>
      <div class="filter-box">
        <div class="group">
          <el-button @click="clearSort" :type="sortBy==''?'':'danger'" :icon="sortBy==''?'':'el-icon-circle-close'" size="small">排序</el-button>
        </div>
        <div class="methods">
          <el-button @click="toggleSort('level')" :type="sortBy=='level'?'primary':''" :icon="sortBy=='level'?('el-icon-sort-'+(sortDesc?'down':'up')):''" size="small">等级</el-button>
          <el-button @click="toggleSort('rarity')" :type="sortBy=='rarity'?'primary':''" :icon="sortBy=='rarity'?('el-icon-sort-'+(sortDesc?'down':'up')):''" size="small">稀有度</el-button>
        </div>
      </div>
    </div>
    <el-row>
      <el-col v-for="(character,i) in list" :key="i" :span="4">
        <div class="character-list">
          <el-image
            class="avatar"
            :src="require('../assets/images/avatars/'+character.id+'_'+(character.phase<2?'1':'2')+'.png')"></el-image>
          <div :class="'profession-icon-'+character.profession"></div>
          <div class="info-label">
            <div :class="'rarity-'+character.rarity"></div>
            <div :class="'elite-'+character.phase"></div>
            <div :class="'potential-'+character.potential"></div>
            <div class="level">
              <div class="lv-text"></div>
              <div class="lv-number">{{character.level}}</div>
            </div>
          </div>
          <div class="right-label">
            <el-tooltip v-for="skill in character.skillDetails" :key="skill.id" effect="dark" :content="skill.name" placement="right">
              <div class="skill">
                <el-image
                  class="icon"
                  :src="require('../assets/images/skills/skill_icon_'+skill.id+'.png')"></el-image>
                <div :class="'rank-'+skill.level">
                  <div></div>
                </div>
              </div>
            </el-tooltip>
            <div class="name">{{character.name}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import charactersData from '@/data/config/character.json'
import charactersDetails from '@/data/source/character_table.json'
import skillsData from '@/data/source/skill_table.json'
import '@/assets/styles/character.less'
export default {
  components: {},
  data() {
    return {
      characters: [],
      sortBy: 'level',
      sortDesc: true,
      filtersOfRarity: [5, 4, 3, 2, 1, 0],
      filtersOfProfession: ['warrior', 'tank', 'medic', 'sniper', 'caster', 'special', 'support', 'pioneer'],
      filtersByRarity: [],
      filtersByProfession: [],
      professions: {warrior: '近卫', tank: '重装', medic: '医疗', sniper: '狙击', caster: '术师', special: '特种', support: '辅助', pioneer: '先锋'}
    }
  },
  computed: {
    list() {
      if(this.filtersByRarity.length==0) {
        return [];
      }
      if(this.filtersByProfession.length==0) {
        return [];
      }
      let list = [...this.characters];
      if(this.filtersByRarity.length<6) {
        list = list.filter(c=>this.filtersByRarity.includes(c.rarity));
      }
      if(this.filtersByProfession.length<8) {
        list = list.filter(c=>this.filtersByProfession.includes(c.profession));
      }
      if(this.sortBy) {
        list.sort((a,b)=>a.profession<b.profession?1:-1);
        if(this.sortBy=='level') {
          list.sort((a,b)=>b.rarity-a.rarity);
          if(this.sortDesc) {
            list.sort((a,b)=>b.level-a.level).sort((a,b)=>b.phase-a.phase);
          } else {
            list.sort((a,b)=>a.level-b.level).sort((a,b)=>a.phase-b.phase);
          }
        } else {
          list.sort((a,b)=>b.level-a.level).sort((a,b)=>b.phase-a.phase);
          if(this.sortDesc) {
            list.sort((a,b)=>b.rarity-a.rarity);
          } else {
            list.sort((a,b)=>a.rarity-b.rarity);
          }
        }
      }
      return list;
    }
  },
  created() {
    this.characters = charactersData.filter(c=>c.potential>-1);
    for(let i in this.characters) {
      this.characters[i].profession = charactersDetails[this.characters[i].id].profession.toLowerCase();

      let skills = [];
      for(let j in this.characters[i].skills) {
        let skillId = charactersDetails[this.characters[i].id].skills[j].skillId;
        skills.push({
          id: skillsData[skillId].iconId?skillsData[skillId].iconId:skillId,
          name: skillsData[skillId].levels[0].name,
          level: this.characters[i].skills[j]
        });
      }
      this.characters[i].skillDetails = [...skills];
    }
    this.allRarity();
    this.allProfession();
  },
  methods: {
    clearSort() {
      this.sortBy = '';
    },
    toggleSort(type) {
      if(this.sortBy!=type) {
        this.sortBy = type;
        this.sortDesc = true;
      } else {
        if(this.sortDesc) {
          this.sortDesc = false;
        } else {
          this.sortBy = '';
        }
      }
    },
    allRarity() {
      this.filtersByRarity = [...this.filtersOfRarity];
    },
    toggleRarity(rarity) {
      const index = this.filtersByRarity.indexOf(rarity);
      if(index!=-1) {
        this.filtersByRarity.splice(index, 1);
      } else {
        this.filtersByRarity.push(rarity);
      }
    },
    allProfession() {
      this.filtersByProfession = [...this.filtersOfProfession];
    },
    toggleProfession(profession) {
      const index = this.filtersByProfession.indexOf(profession);
      if(index!=-1) {
        this.filtersByProfession.splice(index, 1);
      } else {
        this.filtersByProfession.push(profession);
      }
    }
  }
}
</script>
<style lang="less" scoped>
.filter-box-inline {
  display: inline-block;
}
.el-row .el-col {
  margin-top: 15px;
  &:nth-child(-n+6) {
    margin-top: 0;
  }
}
</style>