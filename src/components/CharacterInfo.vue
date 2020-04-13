<template>
<el-dialog
  v-if="data"
  custom-class="character-info"
  :visible="open"
  :before-close="closeInfo"
  :modal="false"
  width="98%"
  top="10px">
  <el-divider></el-divider>
  <el-row>
    <el-col class="pane-public range-exp" :span="12">
      <div class="pane-icon">
        <el-row>
          <el-col :span="16">
            <div :class="'elite elite-'+phase"></div>
          </el-col>
          <el-col :span="8">
            <el-row><i @click="iconOperate('phase', 1)" class="el-icon-plus icon-operate"></i></el-row>
            <el-row><i @click="iconOperate('phase', -1)" class="el-icon-minus icon-operate"></i></el-row>
          </el-col>
        </el-row>
      </div>
      <span class="range-value">等级</span>
      <div class="pane-range">
        <el-slider v-model="level" :min="1" :max="maxLevel"></el-slider>
      </div>
      <span class="range-value">{{level}}</span>
    </el-col>
    <el-col class="pane-public range-favor" :span="12">
      <div class="pane-icon">
        <el-row>
          <el-col :span="16">
            <div :class="'potential potential-'+potential"></div>
          </el-col>
          <el-col :span="8">
            <el-row><i @click="iconOperate('potential', 1)" class="el-icon-plus icon-operate"></i></el-row>
            <el-row><i @click="iconOperate('potential', -1)" class="el-icon-minus icon-operate"></i></el-row>
          </el-col>
        </el-row>
      </div>
      <span class="range-value">信赖</span>
      <div class="pane-range">
        <el-slider v-model="favor" :min="0" :max="200"></el-slider>
      </div>
      <span class="range-value">{{favor}}</span>
    </el-col>
  </el-row>
  <el-row>
    <el-col v-for="(skill,i) in activeSkills" :key="i" :span="8">
      <div class="pane-icon pane-skill">
        <el-row>
          <el-col class="skill" :span="20">
            <span class="name">{{skill.name}}</span>
            <div :class="'rank-'+skill.level">
              <div></div>
            </div>
          </el-col>
          <el-col :span="4" class="operates">
            <el-row><i @click="skillOperate(i, 1)" class="el-icon-plus icon-operate"></i></el-row>
            <el-row><i @click="skillOperate(i, -1)" class="el-icon-minus icon-operate"></i></el-row>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
  <div slot="title" :class="['summary', {'summary-none': data.potential==-1}]">
    <span class="name">{{data.name}}</span>
    <div v-if="data.potential>-1">
      <div :class="'potential potential-'+data.potential"></div>
      <div :class="'elite elite-'+data.phase"></div>
      <div class="level">
        <div class="lv-text"></div>
        <div class="lv-number">{{data.level}}</div>
      </div>
      <div v-for="(skill,i) in data.skills" :key="i" class="skill">
        <div :class="'rank-'+skill">
          <div></div>
        </div>
      </div>
      <span class="favor">{{data.favor}}</span>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeInfo" size="small">关闭</el-button>
    <el-button @click="setInfo" size="small" type="success">设置</el-button>
    <el-button @click="setPlan" size="small" type="primary">计划</el-button>
  </span>
</el-dialog>
</template>

<script>
import { maxLevel } from '@/data/source/gamedata_const.json'
import charactersData from '@/data/source/character_table.json'
import skillsData from '@/data/source/skill_table.json'
import '@/assets/styles/character.less'

export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    data: {
      type: [Boolean, Object],
      default: false
    }
  },
  data() {
    return {
      phase: 0,
      level: 0,
      potential: 0,
      favor: 0,
      skills: []
    }
  },
  computed: {
    maxLevel() {
      return maxLevel[this.data.rarity][this.phase];
      
    },
    activeSkills() {
      return this.skills.filter(s=>s.phase<=this.phase);
    }
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        if(!newVal) return;
        this.phase = newVal.phase;
        this.level = newVal.level;
        this.potential = newVal.potential;
        this.favor = newVal.favor;
        this.skills = [];
        for(let i=0;i<charactersData[this.data.id].skills.length;i++) {
          const skill = charactersData[this.data.id].skills[i];
          this.skills.push({
            id: skill.skillId,
            name: skillsData[skill.skillId].levels[0].name,
            phase: skill.unlockCond.phase,
            level: this.data.skills[i] || 1
          });
        }
      },
      deep: true
    }
  },
  methods: {
    closeInfo() {
      this.$emit('updateInfo', false);
      this.$emit('update:open', false);
    },
    iconOperate(type, action) {
      const min = type=='phase' ? 0 : -1;
      const max = type=='phase' ? 2 : 5;
      let value = this[type]+action;
      value = Math.max(min, value);
      value = Math.min(max, value);
      this[type] = value;
    },
    skillOperate(index, action) {
      const min = 1;
      const max = [4,7,10][this.phase];
      let value = this.skills[index].level+action;
      value = Math.max(min, value);
      value = Math.min(max, value);
      if(value<=7) {
        for(let i=0;i<this.skills.length;i++) {
          this.skills[i].level = value;
        }
      } else {
        this.skills[index].level = value;
      }
    },
    setInfo() {
      let info = {};
      info.id = this.data.id;
      info.name = this.data.name;
      info.rarity = this.data.rarity;
      info.phase = this.phase;
      info.level = this.level;
      info.potential = this.potential;
      info.favor = this.favor;
      info.skills = [];
      for(let i=0;i<this.skills.length;i++) {
        if(this.skills[i].phase>this.phase) continue;
        info.skills.push(this.skills[i].level);
      }
      this.$store.dispatch('setCharacter', {
        id: this.data.id,
        data: info
      });
      this.$emit('updateInfo', this.data.id);
    },
    setPlan() {
      const present = this.$store.getters.characters(this.data.id);
      const info = charactersData[this.data.id];
      if(this.phase > present.phase) {
        for(let i=present.phase+1;i<this.phase+1;i++) {
          let plan = {};
          plan.id = this.data.id+'-phase-'+(i-1)+'-'+i;
          plan.chara = info.name;
          plan.item = '精英化';
          plan.from = i-1;
          plan.to = i;
          plan.hide = false;
          let materials = [];
          for(const cost of info.phases[i].evolveCost) {
            materials.push([cost.id, cost.count]);
          }
          plan.materials = materials;
          this.$store.dispatch('setPlan', {
            id: plan.id,
            data: plan
          });
        }
      }
      let publicUp = [0, 0];
      for(let i=0;i<this.skills.length;i++) {
        if(this.skills[i].level <= present.skills[i]) continue;
        if(this.skills[i].level <=7) {
          publicUp = [present.skills[i], this.skills[i].level];
        } else {
          for(let j=Math.max(present.skills[i],7)+1;j<this.skills[i].level+1;j++) {
            let plan = {};
            plan.id = this.data.id+'-master-'+(j-1)+'-'+j;
            plan.chara = info.name;
            plan.item = skillsData[this.skills[i].id].levels[0].name;
            plan.from = j-8;
            plan.to = j-7;
            plan.hide = false;
            let materials = [];
            for(const cost of info.skills[i].levelUpCostCond[j-8].levelUpCost) {
              materials.push([cost.id, cost.count]);
            }
            plan.materials = materials;
            this.$store.dispatch('setPlan', {
              id: plan.id,
              data: plan
            });
          }
        }
      }
      for(let i=publicUp[0];i<publicUp[1];i++) {
        let plan = {};
        plan.id = this.data.id+'-rank-'+i+'-'+(i+1);
        plan.chara = info.name;
        plan.item = '技能';
        plan.from = i;
        plan.to = i+1;
        plan.hide = false;
        let materials = [];
        for(const cost of info.allSkillLvlup[i-1].lvlUpCost) {
          materials.push([cost.id, cost.count]);
        }
        plan.materials = materials;
        this.$store.dispatch('setPlan', {
          id: plan.id,
          data: plan
        });
      }
    }
  }
};
</script>
