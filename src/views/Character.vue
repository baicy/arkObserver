<template>
  <el-card>
    <el-table
      :data="list"
      ref="charas"
      id="charas"
      @row-click="editCharacter"
      border
      height="500"
      :default-sort="{prop: 'level', order: 'descending'}"
      header-row-class-name="row-dense"
      row-class-name="row-dense row-content"
      :cell-style="cellStyle"
      :span-method="spanMethod"
      show-summary
      :summary-method="getSummaries"
      highlight-current-row
      class="character-list">
      <el-table-column prop="name" label="代号" width="100"></el-table-column>
      <el-table-column
        prop="profession"
        label="职业"
        :filters="[{text: '近卫', value: 'warrior'}, {text: '重装', value: 'tank'}, {text: '医疗', value: 'medic'}, {text: '狙击', value: 'sniper'}, {text: '术师', value: 'caster'}, {text: '特种', value: 'special'}, {text: '辅助', value: 'support'}, {text: '先锋', value: 'pioneer'}]"
        :filter-method="filterEqual"
        filter-placement="bottom"
        width="100">
        <template slot-scope="{row}">
          {{professions[row.profession]}}
        </template>
      </el-table-column>
      <!-- 把稀有度从循环输出图片去掉之后速度提升特别大，其他的都不需要换了 -->
      <el-table-column
        prop="rarity"
        label="稀有度"
        width="100"
        :filters="[{text: '6星', value: 5}, {text: '5星', value: 4}, {text: '4星', value: 3}, {text: '3星', value: 2}, {text: '2星', value: 1}, {text: '1星', value: 0}]"
        :filter-method="filterEqual"
        :formatter="(row)=>(row.rarity+1)+'星'"
        sortable>
      </el-table-column>
      <el-table-column prop="favor" label="信赖" width="75" sortable></el-table-column>
      <el-table-column prop="potential" label="潜能" width="80" sortable>
        <template slot-scope="{row}">
          <el-tag v-if="row.potential==-1" size="small" type="danger" effect="dark" disable-transitions>未持有</el-tag>
          <div v-else class="icon-pane potential-pane">
            <div :class="'potential-'+row.potential"></div>
            <span>{{row.potential+1}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="等级" width="90" sortable :sort-by="['phase', 'level', 'rarity']">
        <template slot-scope="{row}">
          <div class="icon-pane elite-pane">
            <div :class="'elite-'+row.phase"></div>
            <div class="level-circle">
              <el-progress :percentage="Math.floor(row.level / maxLevel[row.rarity][row.phase] * 100)" :width="35" :stroke-width="2" :show-text="false" color="#f8d206" type="circle"></el-progress>
              <div class="level-number">{{row.level}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="operator">
        <template slot="header" slot-scope="{}">
          <div class="operators">
            <el-input v-model="newerName" @change="newCharacter" class="character-search" size="mini"></el-input>
            <el-switch v-model="onlyHaves" class="character-have" active-text="只显示持有干员"></el-switch>
          </div>
        </template>
        <el-table-column v-for="i in 3" :key="i" :label="'技能'+i" sortable :sort-method="skillSort(null,null,i)">
          <template slot-scope="{row}">
            <div v-if="row.skillDetails[i-1]" class="skill">
              <div class="name">{{row.skillDetails[i-1].name}}</div>
              <div :class="'rank-'+row.skillDetails[i-1].level">
                <div></div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <Info
      :open.sync="editing"
      :data="editingCharacter"
      @updateInfo="updateEditingCharacter"
      class="pane-edit"></Info>
  </el-card>
</template>
<script>
import defaultData from '@/data/config/character.json'
import details from '@/data/source/character_table.json'
import skillsData from '@/data/source/skill_table.json'
import { maxLevel } from '@/data/source/gamedata_const.json'
import '@/assets/styles/character.less'
import Info from '@/components/CharacterInfo'

export default {
  components: { Info },
  data: () => ({
    characters: [],
    professions: {warrior: '近卫', tank: '重装', medic: '医疗', sniper: '狙击', caster: '术师', special: '特种', support: '辅助', pioneer: '先锋'},
    editing: false,
    editingCharacter: false,
    maxLevel: maxLevel,
    newerName: '',
    onlyHaves: true
  }),
  computed: {
    list() {
      let list = [...this.characters];
      if(this.onlyHaves) {
        list = list.filter(c=>c.potential>-1);
      }
      for(let i in list) {
        list[i].profession = details[list[i].id].profession.toLowerCase();
        let skills = [];
        for(let j in list[i].skills) {
          let skillId = details[list[i].id].skills[j].skillId;
          skills.push({
            name: skillsData[skillId] ? skillsData[skillId].levels[0].name :'',
            level: list[i].skills[j]
          });
        }
        list[i].skillDetails = [...skills];
      }
      return list;
    }
  },
  created() {
    let characters = this.$store.getters.characters();
    if(Object.keys(characters).length) {
      this.characters = characters;
    } else {
      characters = defaultData;
      this.$store.dispatch('setCharacter', characters);
      this.characters = this.$store.getters.characters();
    }
  },
  methods: {
    cellStyle({row, column}) {
      if(row.potential==-1 && 'potential' == column.property) {
        return {
          padding: '10px 0'
        }
      }
      if(row.potential!=-1 && ['potential', 'level'].includes(column.property)) {
        return {
          backgroundColor: '#313131',
          padding: '3px 0'
        }
      }
    },
    spanMethod({ row, column, columnIndex }) {
      if (row.potential === -1) {
        if(column.property === 'potential') return [1, 5];
        if(columnIndex>4) return [1, 0];
      }
    },
    skillSort(a, b, skill) {
      return (a, b) => {
        const la = a.skills[skill-1] ? a.skills[skill-1] : -1;
        const lb = b.skills[skill-1] ? b.skills[skill-1] : -1;
        return la - lb;
      }
    },
    filterEqual(value, row, column) {
      return row[column.property] === value;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let owned = 0;
      let phaseCount = [0, 0, 0];
      let masterCount = [0, 0, 0];
      for(let item of data) {
        if(item.potential>-1) owned++;
        phaseCount[item.phase]++;
        for(let level of item.skills) {
          if(level>7)
            masterCount[level-8]++;
        }
      }
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = owned+'/'+data.length;
          return;
        }
        if (index==6) {
          sums[index] = '精英化: '+phaseCount[2]+'(2)/'+phaseCount[1]+'(1)/'+phaseCount[0];
          return;
        }
        if (index==7) {
          sums[index] = '专精: '+masterCount[2]+'(3)/'+masterCount[1]+'(2)/'+masterCount[0]+'(1)';
          return;
        }
      });

      return sums;
    },
    editCharacter(row) {
      this.editing = true;
      this.editingCharacter = row;
    },
    updateEditingCharacter(id) {
      this.editingCharacter = id?this.$store.getters.characters(id):id;
    },
    newCharacter() {
      const newerName = this.newerName.trim();
      if(!newerName) return;
      if(!this.findCharacter(newerName)) {
        for(const i in details) {
          if(details[i].name!=newerName) continue;
          const chara = {
            id: i,
            name: details[i].name,
            rarity: details[i].rarity,
            potential: -1,
            favor: 0,
            phase: 0,
            level: 1,
            skills: Array(details[i].skills.length).fill(1)
          };
          this.$store.dispatch('setCharacter', {
            id: i,
            data: chara
          });
          this.$notify.success({
            message: '新增干员 ' + newerName
          });
          this.$nextTick(()=>{
            this.findCharacter(newerName);
          });
        }
      }
    },
    findCharacter(name) {
      if(this.characters.findIndex(c=>c.name==name)==-1) return false;
      const data = this.$refs.charas.tableData;
      const index = data.findIndex(c=>c.name==name);
      if(index==-1) return true;
      const row = document.getElementById('charas').getElementsByClassName('row-content')[index];
      row.scrollIntoView();
      this.$refs.charas.setCurrentRow(data[index]);
      return true;
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  position: relative;
}
.pane-edit {
  position: absolute;
  top: 12px;
  left: 560px;
  width: calc(100% - 575px);
}
</style>
<style lang="less">
.pane-edit {
  .character-info {
    height: 490px;
  }
}
</style>