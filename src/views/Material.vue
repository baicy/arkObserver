<template>
<el-card class="workshop">
  <div slot="header">
    <div class="pane-gold">合成所需龙门币: {{goldCost}}</div>
    <div class="pane-plan">
      <div class="pane-material pane-need">
        <div :class="[{ 'grid-0': i&&material.rarity<neededMaterials[i-1].rarity }]" v-for="(material,i) in neededMaterials" :key="i">
          <el-popover
            placement="bottom-start"
            trigger="focus">
            <div v-if="material.formula" class="popover-material">
            <div class="formula">
              <Material v-for="(c,i) in material.formula.costs" :key="i" :item="materials[indexes[c[0]]]" :number="c[1]" :store="stores[c[0]]" class="cost"></Material>
            </div>
            </div>
            <div v-else>不可合成</div>
            <Material slot="reference" class="material" :item="material" :number="needs[material.itemId]"></Material>
          </el-popover>
        </div>
      </div>
      <el-table
        :data="planList"
        header-row-class-name="row-dense"
        :row-class-name="rowClass"
        border
        height="205"
        class="list-plan">
        <el-table-column width="90">
          <template slot-scope="{row}">
            <el-button @click="hideOrShowPlan(row)" class="icon-tool-hide" type="text"><i class="el-icon-view"></i></el-button>
            <el-button @click="removePlan(row.id)" class="icon-tool-remove" type="text"><i class="el-icon-close"></i></el-button>
            <el-button @click="completePlan(row)" :disabled="!completeds[row.id]" :class="{'icon-tool-complete': completeds[row.id]}" type="text"><i class="el-icon-check"></i></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="chara" label="干员" width="100" sortable></el-table-column>
        <el-table-column prop="item" label="项目" width="180">
          <template slot-scope="{row}">
            {{ row.item ? (row.item+' '+row.from+'->'+row.to) : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="materials" label="材料">
          <template slot-scope="{row}">
            <div class="materials">
              <Material v-for="(m,i) in row.materials" :key="i" :item="materials[indexes[m[0]]]" :number="m[1]" class="material"></Material>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="toolbar-ground">
    <el-switch
      v-model="onlyNeeded"
      active-text="只显示需求材料">
    </el-switch>
  </div>
  <div class="pane-material pane-ground">
    <div :class="['require', { 'grid-0': (material.type=='book'&&!groundMaterials[i-1].type)||(material.type!='book'&&i&&(material.type!=groundMaterials[i-1].type||material.rarity<groundMaterials[i-1].rarity)) }, { 'needed': totalNeeds[material.itemId] }]" v-for="(material,i) in groundMaterials" :key="i">
      <el-popover
        class="name"
        placement="bottom-start"
        trigger="click">
        <div v-if="material.formula" class="popover-material">
          <el-button :disabled="ableMergeds[material.itemId]" @click="mergeMaterial(material)" size="mini" type="primary">合成</el-button>
          <div class="formula">
            <Material v-for="(c,i) in material.formula.costs" :key="i" :item="materials[indexes[c[0]]]" :number="c[1]" :store="stores[c[0]]" class="cost"></Material>
          </div>
        </div>
        <div>
          <el-input-number v-model="extra" class="number-mini" size="mini" :min="0" controls-position="right"></el-input-number>
          <el-button @click="addExtraPlan(material.itemId)" type="primary" size="mini">extra</el-button>
        </div>
        <Material slot="reference" class="material" :item="material" :show-number="false"></Material>
      </el-popover>
      <el-tag size="medium" type="primary" effect="dark">{{totalNeeds[material.itemId]}}</el-tag>
      <el-input-number v-model="requires[material.itemId]" :min="0" class="number-mini number" size="mini" controls-position="right"></el-input-number>
      <el-tag
        v-if="material.formula"
        :type="stores[material.itemId]+cals[material.itemId]<totalNeeds[material.itemId]?'primary':(cals[material.itemId]&&stores[material.itemId]+cals[material.itemId]>totalNeeds[material.itemId]?'danger':'info')"
        @click="calMax(material.itemId)"
        class="tag-cal"
        size="medium"
        effect="dark">
          <i class="el-icon-s-tools"></i>
      </el-tag>
      <el-input-number v-if="material.formula" class="number-mini number" size="mini" v-model="cals[material.itemId]" :min="0" :max="totalNeeds[material.itemId]||Infinity" controls-position="right"></el-input-number>
      <el-tag
        :type="stores[material.itemId]+cals[material.itemId]>=totalNeeds[material.itemId]?'success':'danger'"
        class="tag-store"
        size="medium"
        effect="dark">
          <i class="el-icon-coin"></i>
      </el-tag>
      <el-input-number class="number-mini number" size="mini" v-model="stores[material.itemId]" :min="0" controls-position="right"></el-input-number>
    </div>
  </div>
</el-card>
</template>
<script>
import '@/assets/styles/material.less'
import { material, book, chip, money } from '@/data/config/material.json'
import Material from '@/components/Material'

export default {
  components: { Material },
  data() {
    return {
      materials: [],
      indexes: {},
      goldCost: 0,
      requires: {},
      cals: {},
      stores: {},
      totalNeeds: {},
      ableMergeds: {},
      onlyNeeded: true,
      extra: 0,
      plans: {},
      planList: [],
      completeds: {}
    }
  },
  computed: {
    needs() {
      let results = {};
      for(const m of this.materials) {
        this.$set(results, m.itemId, 0);
        this.$set(this.totalNeeds, m.itemId, 0);
      }
      let goldCost = 0;
      for(const m of this.materials) {
        const need = results[m.itemId] + this.requires[m.itemId] - this.cals[m.itemId] - this.stores[m.itemId];
        this.$set(results, m.itemId, (need>0 ? need : 0));
        this.$set(this.totalNeeds, m.itemId, this.totalNeeds[m.itemId] + this.requires[m.itemId]);
        if(!m.formula) continue;
        goldCost += this.cals[m.itemId]*m.formula.goldCost;
        for(const cost of m.formula.costs) {
          this.$set(results, cost[0], results[cost[0]] + (this.cals[m.itemId] * cost[1]));
          this.$set(this.totalNeeds, cost[0], this.totalNeeds[cost[0]] + (this.cals[m.itemId] * cost[1]));
        }
      }
      this.$set(this, 'goldCost', goldCost);
      this.updatePlanList();
      return results;
    },
    neededMaterials() {
      return this.materials.filter(m=>this.needs[m.itemId]).sort((a,b)=>b.rarity-a.rarity);
    },
    groundMaterials() {
      return this.onlyNeeded ? this.materials.filter(m=>this.totalNeeds[m.itemId]||this.cals[m.itemId]) : this.materials;
    }
  },
  watch:{
    stores: {
      handler(newVal) {
        for(const m of this.materials) {
          if(!m.formula) continue;
          this.$set(this.ableMergeds, m.itemId, !(m.formula.costs.reduce((r, c)=>r && this.stores[c[0]]>=c[1], true)));
          this.$store.dispatch('setStore', newVal);
        }
      },
      deep: true
    },
    cals: {
      handler(newVal) {
        this.$store.dispatch('setCal', newVal);
      },
      deep: true
    },
    plans: {
      handler() {
        this.updatePlanList();
      },
      deep: true
    }
  },
  methods: {
    calMax(mid) {
      this.$set(this.cals, mid, this.totalNeeds[mid] - this.stores[mid]);
    },
    mergeMaterial(material) {
      this.$set(this.stores, material.itemId, this.stores[material.itemId]+1);
      for(const cost of material.formula.costs) {
        this.$set(this.stores, cost[0], this.stores[cost[0]] - cost[1]);
      }
      if(this.cals[material.itemId]) {
        this.$set(this.cals, material.itemId, this.cals[material.itemId]-1);
      }
    },
    updatePlanList() {
      this.planList = [];
      for(const i in this.materials) {
        this.$set(this.requires, this.materials[i].itemId, 0);
      }
      for(const i in this.plans) {
        let completed = true;
        for(const m of this.plans[i].materials) {
          if(!this.plans[i].hide) {
            this.$set(this.requires, m[0], this.requires[m[0]]+m[1]);
          }
          if(m[1]>this.stores[m[0]]) completed = false;
        }
        this.$set(this.completeds, i, completed);
        this.planList.push(this.plans[i]);
      }
      this.planList.sort((a,b)=>{
        const la = a.hide?1:-1;
        const lb = b.hide?1:-1;
        return la-lb;
      });
    },
    rowClass({row}) {
      let classes = ['row-dense'];
      if(row.hide) {
        classes.push('row-hide');
      }
      return classes;
    },
    hideOrShowPlan(row) {
      row.hide = !row.hide;
      this.$store.dispatch('setPlan', {
        id: row.id,
        data: row
      });
    },
    removePlan(id) {
      this.$store.dispatch('removePlan', id);
    },
    completePlan(row) {
      for(const m of row.materials) {
        this.$set(this.stores, m[0], this.stores[m[0]]-m[1]);
      }
      if(row.id.substr(0, 5)!='extra') {
        let info = this.$store.getters.characters(row.charaId);
        switch(row.itemType) {
          case 'phase':
            info.phase = row.target;
            break;
          case 'skill':
            info.skills = Array(row.skillCount).fill(row.target);
            break;
          case 'master':
            info.skills[row.skillIndex] = row.target;
            break;
        }
        this.$store.dispatch('setCharacter', {
          id: row.charaId,
          data: info 
        });
      }
      this.$store.dispatch('removePlan', row.id);
    },
    addExtraPlan(mid) {
      let plan = {
        id: 'extra-'+new Date().getTime(),
        chara: '',
        item: '',
        hide: false,
        materials: [[mid, this.extra]]
      };
      this.$store.dispatch('setPlan', {
        id: plan.id,
        data: plan
      });
      this.extra = 0;
    }
  },
  created() {
    this.materials = [
      ...material.sort((a,b)=>b.rarity-a.rarity),
      ...book.sort((a,b)=>b.rarity-a.rarity),
      ...chip.sort((a,b)=>b.rarity-a.rarity),
      ...money
    ];
    for(const i in this.materials) {
      this.$set(this.indexes, this.materials[i].itemId, i);
      this.$set(this.requires, this.materials[i].itemId, 0);
      this.$set(this.cals, this.materials[i].itemId, 0);
    }
    let stores = this.$store.getters.stores();
    for(const m of this.materials) {
      if(stores[m.itemId]===undefined) {
        this.$set(stores, m.itemId, 0);
      }
    }
    this.$store.dispatch('setStore', stores);
    this.stores = this.$store.getters.stores();
    let cals = this.$store.getters.cals();
    for(const m of this.materials) {
      if(cals[m.itemId]===undefined) {
        this.$set(cals, m.itemId, 0);
      }
    }
    this.$store.dispatch('setCal', cals);
    this.cals = this.$store.getters.cals();
    this.plans = this.$store.getters.plans();
  }
}
</script>