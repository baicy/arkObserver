<template>
<el-card class="workshop">
  <div slot="header">
    <div class="pane pane-need">
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
  </div>
  <div class="toolbar-ground">
    <el-switch
      v-model="onlyNeeded"
      active-text="只显示需求材料">
    </el-switch>
  </div>
  <div class="pane pane-ground">
    <div :class="['require', { 'grid-0': i&&material.rarity<groundMaterials[i-1].rarity }, { 'needed': totalNeeds[material.itemId] }]" v-for="(material,i) in groundMaterials" :key="i">
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
import {material} from '@/data/config/material.json'
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
      onlyNeeded: false
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
      return this.materials.filter(m=>this.needs[m.itemId]);
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
    }
  },
  created() {
    this.materials = [...material].sort((a,b)=>b.rarity-a.rarity);
    for(const i in this.materials) {
      this.$set(this.indexes, this.materials[i].itemId, i);
      this.$set(this.requires, this.materials[i].itemId, 0);
      this.$set(this.cals, this.materials[i].itemId, 0);
    }
    let stores = this.$store.getters.stores();
    if(Object.keys(stores).length) {
      this.stores = stores;
    } else {
      stores = {};
      for(const m of this.materials) {
        this.$set(stores, m.itemId, 0);
      }
      this.$store.dispatch('setStore', stores);
      this.stores = this.$store.getters.stores();
    }
  }
}
</script>
<style lang="less" scoped>
.workshop {
  background: #404040;
  position: relative;
  .pane {
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 5px;
    overflow-x: auto;
    .material:hover {
      cursor: pointer;
    }
    .grid-0 {
      grid-column: 1;
    }
    .require {
      display: grid;
      grid-template-columns: 30px 55px 30px 50px;
      gap: 5px 0;
      padding: 5px;
      .number {
        width: 50px;
      }
      .el-tag {
        padding: 0;
        border-radius: 0;
        text-align: center;
      }
      .name {
        font-size: 15px;
        grid-column-start: 1;
        grid-column-end: 3;
      }
      .tag-cal {
        cursor: pointer;
      }
      .tag-store {
        grid-column: 3;
      }
    }
    .require.needed {
      background-color: #ffffff;
      .name {
        font-weight: bold;
      }
    }
  }
  .pane-need {
    min-height: 140px;
  }
  .pane-ground {
    margin-top: 15px;
    min-height: 375px;
  }
  .toolbar-ground {
    position: absolute;
    top: 180px;
    left: 10px;
  }
}
</style>