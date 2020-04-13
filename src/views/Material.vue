<template>
<el-card class="workshop">
  <div slot="header" class="pane-plan">
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
      :row-style="rowStyle"
      border
      height="140"
      class="list-plan">
      <el-table-column width="60">
        <template slot-scope="{row}">
          <i @click="hideOrShowPlan(row)" class="el-icon-view"></i>
          <i @click="removePlan(row.id)" class="el-icon-minus"></i>
        </template>
      </el-table-column>
      <el-table-column prop="chara" label="干员" width="100"></el-table-column>
      <el-table-column prop="item" label="项目" width="180">
        <template slot-scope="{row}">
          {{row.item}} {{row.from}}->{{row.to}}
        </template>
      </el-table-column>
      <el-table-column prop="materials" label="材料" width="380">
        <template slot-scope="{row}">
          <div style="display:flex;">
            <Material v-for="(m,i) in row.materials" :key="i" :item="materials[indexes[m[0]]]" :number="m[1]"></Material>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="toolbar-ground">
    <el-switch
      v-model="onlyNeeded"
      active-text="只显示需求材料">
    </el-switch>
  </div>
  <div class="pane-material pane-ground">
    <div :class="['require', { 'grid-0': (material.type&&!groundMaterials[i-1].type)||(!material.type&&i&&material.rarity<groundMaterials[i-1].rarity) }, { 'needed': totalNeeds[material.itemId] }]" v-for="(material,i) in groundMaterials" :key="i">
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
        <div v-else>不可合成</div>
        <Material slot="reference" class="material" :item="material" :show-number="false"></Material>
      </el-popover>
      <el-tag size="medium" type="primary" effect="dark">{{totalNeeds[material.itemId]}}</el-tag>
      <el-input-number class="number" size="mini" v-model="requires[material.itemId]" :min="0" controls-position="right"></el-input-number>
      <el-tag
        v-if="material.formula"
        :type="stores[material.itemId]+cals[material.itemId]<totalNeeds[material.itemId]?'primary':(cals[material.itemId]&&stores[material.itemId]+cals[material.itemId]>totalNeeds[material.itemId]?'danger':'info')"
        @click="calMax(material.itemId)"
        class="tag-cal"
        size="medium"
        effect="dark">
          <i class="el-icon-s-tools"></i>
      </el-tag>
      <el-input-number v-if="material.formula" class="number" size="mini" v-model="cals[material.itemId]" :min="0" :max="totalNeeds[material.itemId]" controls-position="right"></el-input-number>
      <el-tag
        :type="stores[material.itemId]+cals[material.itemId]>=totalNeeds[material.itemId]?'success':'danger'"
        class="tag-store"
        size="medium"
        effect="dark">
          <i class="el-icon-coin"></i>
      </el-tag>
      <el-input-number class="number" size="mini" v-model="stores[material.itemId]" :min="0" controls-position="right"></el-input-number>
    </div>
  </div>
</el-card>
</template>
<script>
import '@/assets/styles/material.less'
import { material, book, chip } from '@/data/config/material.json'
import characters from '@/data/source/character_table.json'
import skills from '@/data/source/skill_table.json'
import Material from '@/components/Material'

export default {
  components: { Material },
  data() {
    return {
      materials: [],
      indexes: {},
      requires: {},
      cals: {},
      stores: {},
      ableMergeds: {},
      onlyNeeded: false,
      plans: []
    }
  },
  computed: {
    needs() {
      let results = {};
      for(const m of this.materials) {
        this.$set(results, m.itemId, 0);
      }
      for(const m of this.materials) {
        const need = results[m.itemId] + this.requires[m.itemId] - this.cals[m.itemId] - this.stores[m.itemId];
        this.$set(results, m.itemId, (need>0 ? need : 0));
        if(!m.formula) continue;
        for(const cost of m.formula.costs) {
          this.$set(results, cost[0], results[cost[0]] + (this.cals[m.itemId] * cost[1]));
        }
      } 
      return results;
    },
    neededMaterials() {
      return this.materials.filter(m=>this.needs[m.itemId]).sort((a,b)=>b.rarity-a.rarity);
    },
    totalNeeds() {
      let results = {};
      for(const m of this.materials) {
        this.$set(results, m.itemId, 0);
      }
      for(const m of this.materials) {
        this.$set(results, m.itemId, results[m.itemId] + this.requires[m.itemId]);
        if(this.cals[m.itemId]>results[m.itemId]) {
          this.$set(this.cals, m.itemId, results[m.itemId]);
        }
        if(!m.formula) continue;
        for(const cost of m.formula.costs) {
          this.$set(results, cost[0], results[cost[0]] + (this.cals[m.itemId] * cost[1]));
        }
      } 
      return results;
    },
    groundMaterials() {
      return this.onlyNeeded ? this.materials.filter(m=>this.totalNeeds[m.itemId]) : this.materials;
    },
    planList() {
      for(const i in this.materials) {
        this.$set(this.requires, this.materials[i].itemId, 0);
      }
      let list = [];
      for(const i in this.plans) {
        if(!this.plans[i].hide) {
          for(const m of this.plans[i].materials) {
            this.$set(this.requires, m[0], this.requires[m[0]]+m[1]);
          }
        }
        list.push(this.plans[i]);
      }
      list.sort((a,b)=>{
        const la = a.hide?1:-1;
        const lb = b.hide?1:-1;
        return la-lb;
      });
      return list;
    }
  },
  watch:{
    stores: {
      handler(newVal, oldVal) {
        for(const m of this.materials) {
          if(!m.formula) continue;
          this.$set(this.ableMergeds, m.itemId, !(m.formula.costs.reduce((r, c)=>r && this.stores[c[0]]>=c[1], true)));
          this.$store.dispatch('setStore', newVal);
        }
      },
      deep: true
    },
    cals: {
      handler(newVal, oldVal) {
        this.$store.dispatch('setCal', newVal);
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
    rowStyle({row, rowIndex}) {
      if(row.hide) {
        return {
          color: '#bfbfbf',
          textDecoration: 'line-through'
        }
      }
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
    }
  },
  created() {
    this.materials = [
      ...material.sort((a,b)=>b.rarity-a.rarity),
      ...book.sort((a,b)=>b.rarity-a.rarity),
      ...chip.sort((a,b)=>b.rarity-a.rarity)
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