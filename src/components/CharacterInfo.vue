<template>
<el-dialog
  v-if="data"
  custom-class="character-info"
  :visible="open"
  :show-close="false"
  :modal="false"
  width="98%"
  top="10px">
  <el-divider></el-divider>
  <el-row>
    <el-col :span="12">
      <div class="pane-public range-exp">
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
          <el-slider v-model="level" :min="1" :max="maxLevel" class="slider-input" show-input input-size="mini"></el-slider>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="pane-public range-favor">
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
          <el-slider v-model="favor" :min="0" :max="200" class="slider-input" show-input input-size="mini"></el-slider>
        </div>
      </div>
    </el-col>
  </el-row>
  <div class="pane-skills">
    <div v-for="(skill,i) in activeSkills" :key="i" class="pane-skill skill">
      <span class="name">{{skill.name}}</span>
      <div class="pane-icon">
        <el-row>
          <el-col :span="16">
            <div :class="'rank-'+skill.level">
            <div></div>
          </div>
          </el-col>
          <el-col :span="8">
            <div><i @click="skillOperate(i, 1)" class="el-icon-plus icon-operate"></i></div>
            <div><i @click="skillOperate(i, -1)" class="el-icon-minus icon-operate"></i></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
  <div slot="title" :class="['summary', {'summary-none': data.potential==-1}]">
    <span class="name">{{data.name}}</span>
    <div :class="'rarity-'+data.rarity"></div>
    <div v-if="data.potential>-1" class="summary-info">
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
  <div slot="footer" class="dialog-footer">
    <div>
      <el-button @click="closeInfo" size="small">关闭</el-button>
      <el-button @click="setInfo" size="small" type="success">设置</el-button>
      <el-button @click="setPlan" size="small" type="primary">计划</el-button>
    </div>
    <div v-if="plans.length">
      <el-divider content-position="left">计划中</el-divider>
      <ul class="list-plan">
        <li v-for="plan in plans" :key="plan.id">{{plan.item+' '+plan.from+'->'+plan.to}}</li>
      </ul>
    </div>
  </div>
</el-dialog>
</template>

<script>
import { maxLevel, evolveGoldCost } from '@/data/source/gamedata_const.json'
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
      skills: [],
      plans: [],
      planMsgs: [],
      goldId: '4001'
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
      handler(newVal) {
        if(!newVal) return;
        this.resetInfo();
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
    resetInfo() {
      this.phase = this.data.phase;
      this.level = this.data.level;
      this.potential = this.data.potential;
      this.favor = this.data.favor;
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
      this.updatePlans();
    },
    setPlan() {
      this.planMsgs = [];
      const present = this.$store.getters.characters(this.data.id);
      const info = charactersData[this.data.id];
      if(this.phase > present.phase) {
        for(let i=present.phase+1;i<this.phase+1;i++) {
          this.addPlan({
            id: this.data.id+'-phase-'+(i-1)+'-'+i,
            chara: info.name,
            item: '精英化',
            from: i-1,
            to: i,
            mats: info.phases[i].evolveCost
          });
        }
      }
      let publicUp = [0, 0];
      for(let i=0;i<this.skills.length;i++) {
        if(this.skills[i].phase>this.phase) continue;
        present.skills[i] || (present.skills[i] = 1);
        if(this.skills[i].level <= present.skills[i]) continue;
        if(this.skills[i].level <=7) {
          publicUp = [present.skills[i], this.skills[i].level];
        } else {
          for(let j=Math.max(present.skills[i],7)+1;j<this.skills[i].level+1;j++) {
            this.addPlan({
              id: this.data.id+'-master-'+i+'-'+(j-1)+'-'+j,
              chara: info.name,
              item: skillsData[this.skills[i].id].levels[0].name,
              from: j-8,
              to: j-7,
              mats: info.skills[i].levelUpCostCond[j-8].levelUpCost
            });
          }
        }
      }
      for(let i=publicUp[0];i<publicUp[1];i++) {
        this.addPlan({
          id: this.data.id+'-rank-'+i+'-'+(i+1),
          chara: info.name,
          item: '技能',
          from: i,
          to: i+1,
          mats: info.allSkillLvlup[i-1].lvlUpCost
        });
      }
      this.$notify({
        type: 'success',
        dangerouslyUseHTMLString: true,
        title: '添加计划 '+info.name,
        message: '<p>'+this.planMsgs.join('</p></p>')+'</p>'
      });
      this.resetInfo();
    },
    addPlan(info) {
      let plan = {...info};
      plan.hide = false;
      let materials = [];
      for(const cost of info.mats) {
        materials.push([cost.id, cost.count]);
      }
      if(plan.item=='精英化') {
        materials.push([this.goldId, evolveGoldCost[this.data.rarity][plan.from]]);
      }
      plan.materials = materials;
      this.$delete(plan, 'mats');
      this.$store.dispatch('setPlan', {
        id: plan.id,
        data: plan
      });
      this.planMsgs.push(plan.item+' '+plan.from+'->'+plan.to);
    },
    updatePlans() {
      this.plans = [];
      const plans = this.$store.getters.plans();
      for(const i in plans) {
        if(plans[i].chara == this.data.name) {
          this.plans.push(plans[i]);
        }
      }
    }
  }
};
</script>
