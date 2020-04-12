<template>
  <el-card>
    <el-table
      :data="list"
      border
      height="500"
      :default-sort="{prop: 'level', order: 'descending'}"
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
        <template slot-scope="scope">
          <el-tag v-if="scope.row.potential==-1" type="danger" effect="dark" disable-transitions>未持有</el-tag>
          <div v-else :class="'potential-'+scope.row.potential"></div>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="等级" width="80" sortable :sort-by="['phase', 'level', 'rarity']">
        <template slot-scope="scope">
          <div :class="'elite-'+scope.row.phase"></div>
          <div class="level">
            <div class="lv-text"></div>
            <div class="lv-number">{{scope.row.level}}</div>
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
      professions: {warrior: '近卫', tank: '重装', medic: '医疗', sniper: '狙击', caster: '术师', special: '特种', support: '辅助', pioneer: '先锋'}
    }
  },
  computed: {
    list() {
      let list = [...this.characters];
      return list;
    }
  },
  created() {
    this.characters = charactersData;
    for(let i in this.characters) {
      this.characters[i].profession = charactersDetails[this.characters[i].id].profession.toLowerCase();

      let skills = [];
      for(let j in this.characters[i].skills) {
        let skillId = charactersDetails[this.characters[i].id].skills[j].skillId;
        skills.push({
          name: skillsData[skillId] ? skillsData[skillId].levels[0].name :'',
          level: this.characters[i].skills[j]
        });
      }
      this.characters[i].skillDetails = [...skills];
    }
  },
  methods: {
    cellStyle({row, column, rowIndex, columnIndex}) {
      if(['potential', 'level'].includes(column.property) && row.potential!=-1) {
        return {
          backgroundColor: '#313131'
        }
      }
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.potential === -1 && column.property === 'potential') {
        return [1, 5]
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
    }
  }
}
</script>