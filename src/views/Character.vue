<template>
  <el-card>
    <el-table
      :data="list"
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
      class="character-list">
      <el-table-column prop="name" label="代号" width="100"></el-table-column>
      <el-table-column
        prop="profession"
        label="职业"
        :filters="[{text: '近卫', value: 'warrior'}, {text: '重装', value: 'tank'}, {text: '医疗', value: 'medic'}, {text: '狙击', value: 'sniper'}, {text: '术师', value: 'caster'}, {text: '特种', value: 'special'}, {text: '辅助', value: 'support'}, {text: '先锋', value: 'pioneer'}]"
        :filter-method="filterEqual"
        filter-placement="bottom"
        width="100">
        <template slot-scope="scope">
          {{professions[scope.row.profession]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="rarity"
        label="稀有度"
        width="150"
        :filters="[{text: '6星', value: 5}, {text: '5星', value: 4}, {text: '4星', value: 3}, {text: '3星', value: 2}, {text: '2星', value: 1}, {text: '1星', value: 0}]"
        :filter-method="filterEqual"
        sortable>
        <template slot-scope="scope">
          <div class="rarity">
            <div v-for="i in scope.row.rarity+1" :key="i" class="star"></div>
          </div>
        </template>
      </el-table-column>
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
      <el-table-column label="技能" sortable :sort-method="skillSort(null,null,0)">
        <el-table-column prop="skill1" label="技能1" sortable :sort-method="skillSort(null,null,1)">
          <template slot-scope="scope">
            <div v-if="scope.row.skillDetails[0]" class="skill">
              <div class="name">{{scope.row.skillDetails[0].name}}</div>
              <div :class="'rank-'+scope.row.skillDetails[0].level">
                <div></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="skill2" label="技能2" sortable :sort-method="skillSort(null,null,2)">
          <template slot-scope="scope">
            <div v-if="scope.row.skillDetails[1]" class="skill">
              <div class="name">{{scope.row.skillDetails[1].name}}</div>
              <div :class="'rank-'+scope.row.skillDetails[1].level">
                <div></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="skill3" label="技能3" sortable :sort-method="skillSort(null,null,3)">
          <template slot-scope="scope">
            <div v-if="scope.row.skillDetails[2]" class="skill">
              <div class="name">{{scope.row.skillDetails[2].name}}</div>
              <div :class="'rank-'+scope.row.skillDetails[2].level">
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
  data() {
    return {
      characters: [],
      professions: {warrior: '近卫', tank: '重装', medic: '医疗', sniper: '狙击', caster: '术师', special: '特种', support: '辅助', pioneer: '先锋'},
      editing: false,
      editingCharacter: false,
      maxLevel: maxLevel
    }
  },
  computed: {
    list() {
      let list = [...this.characters];
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
    cellStyle({row, column, rowIndex, columnIndex}) {
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
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.potential === -1) {
        if(column.property === 'potential') return [1, 5];
        if(['level', 'skill1', 'skill2', 'skill3'].includes(column.property)) return [1, 0];
      }
    },
    skillSort(a, b, skill) {
      if(skill) {
        return (a, b) => {
          const la = a.skills[skill-1] ? a.skills[skill-1] : -1;
          const lb = b.skills[skill-1] ? b.skills[skill-1] : -1;
          return la - lb;
        }
      } else {
        return (a, b) => {
          const la = a.skills.reduce((sum, x)=>sum+x,0);
          const lb = b.skills.reduce((sum, x)=>sum+x,0);
          return la - lb;
        }
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
        if (column.property=='skill1') {
          sums[index] = '精英化: '+phaseCount[2]+'(2)/'+phaseCount[1]+'(1)/'+phaseCount[0];
          return;
        }
        if (column.property=='skill2') {
          sums[index] = '专精: '+masterCount[2]+'(3)/'+masterCount[1]+'(2)/'+masterCount[0]+'(1)';
          return;
        }
      });

      return sums;
    },
    editCharacter(row, column, event) {
      this.editing = true;
      this.editingCharacter = row;
    },
    updateEditingCharacter(id) {
      this.editingCharacter = id?this.$store.getters.characters(id):id;
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
  top: 20px;
  left: 535px;
  width: calc(100% - 555px);
}
</style>
<style lang="less">
.pane-edit {
  .character-info {
    height: 480px;
  }
}
</style>