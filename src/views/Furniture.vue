<template>
<el-card>
  <div slot="header">
    <el-input v-model="stage" placeholder="掉落关卡" class="furniture-chooser" clearable>
      <el-cascader
        slot="prepend"
        v-model="furnitureId"
        style="width: 200px;line-height: 36px;"
        :options="furnitures"
        :show-all-levels="false"
        :props="{ expandTrigger: 'hover' }"
        filterable
        clearable
        placeholder="家具"
        @change="handleChooseFurniture"></el-cascader>
        <el-button slot="append" icon="el-icon-finished" @click="addDrop"></el-button>
    </el-input>
  </div>
  <el-table
    :data="dataList"
    class="furniture-table"
    height="400"
    border>
    <el-table-column
      prop="option">
      <template slot="header" slot-scope="">
        <el-radio-group v-model="byStage" size="small">
          <el-radio-button :label="false">按家具</el-radio-button>
          <el-radio-button :label="true">按关卡</el-radio-button>
        </el-radio-group>
      </template>
    </el-table-column>
    <el-table-column
      prop="list">
      <template slot="header" slot-scope="scope" v-if="scope.column.property">
        掉落{{byStage?'家具':'关卡'}}
      </template>
      <template slot-scope="scope">
        <el-tag v-for="(item, index) in scope.row.list" :key="index" class="item-tag">{{item}}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</el-card>
</template>
<script>
import themesData from '@/data/config/furniture.json'
import furnituresData from '@/data/source/building_data.json'
export default {
  data() {
    return {
      furnitures: [],
      byStage: false,
      furnitureId: [],
      stage: '',
      listByFuniture: [],
      listByStage: []
    }
  },
  computed: {
    dataList() {
      let list = [];
      if(this.byStage)
      {
        list = [...this.listByStage];
        if(this.stage.trim()) {
          list = list.filter(item => new RegExp(this.stage.trim().toUpperCase()).test(item.id));
        }
      } else {
        list = [...this.listByFuniture];
        if(this.furnitureId.length) {
          list = list.filter(item => item.id==this.furnitureId[1]);
        }
      }
      return list;
    }
  },
  watch: {
    furnitureId(newVal, oldVal) {
      if(newVal.length && !this.stage.trim()) {
        this.byStage = false;
      }
    },
    stage(newVal, oldVal) {
      if(newVal.trim() && !this.furnitureId.length) {
        this.byStage = true;
      }
    }
  },
  methods: {
    initData() {
      let themes = themesData.activeThemes;
      let furnitures = furnituresData.customData.furnitures;
      for(let i in themes)
      {
        let theme = {
          value: i,
          label: themes[i].name,
          children: []
        };
        themes[i].quickSetup.forEach(furniture => {
          if(!theme.children.find(f=>f.value==furniture.furnitureId))
          {
            theme.children.push({
              value: furniture.furnitureId,
              label: furnitures[furniture.furnitureId].name
            });
          }
        });
        this.furnitures.push(theme);
      }
    },
    handleChooseFurniture(e) {
      // console.log(e);
    },
    loadData() {
      let furnitures = this.$store.getters.furnitures();
      let activeThemes = Object.keys(themesData.activeThemes);
      for(let i in furnitures)
      {
        if(!activeThemes.includes(i)) {
          delete furnitures[i];
        } else {
          for(let j in furnitures[i])
          {
            this.listByFuniture.push({
              id: j,
              option: furnituresData.customData.furnitures[j].name,
              list: furnitures[i][j]
            });
            furnitures[i][j].forEach(stage => {
              const index = this.listByStage.findIndex(s => s.id==stage);
              if(index==-1)
              {
                this.listByStage.push({
                  id: stage,
                  option: stage,
                  list: [furnituresData.customData.furnitures[j].name]
                });
              } else {
                this.listByStage[index].list.push(furnituresData.customData.furnitures[j].name);
              }
            });
          }
        }
      }
      this.$store.dispatch('updateFurnitures', furnitures);
    },
    addDrop() {
      this.stage = this.stage.trim().toUpperCase();
      this.$store.dispatch('addFurnitureDrop', {
        furniture: this.furnitureId,
        stage: this.stage
      });
      this.$message.success("添加 "+furnituresData.customData.furnitures[this.furnitureId[1]].name+" ~ "+this.stage);
      this.loadData();
    }
  },
  mounted() {
    this.initData();
    this.loadData();
  }
}
</script>
<style lang="less" scoped>
.item-tag {
  margin-left: 10px;
  margin-bottom: 5px;
}
</style>
<style lang="less">
.furniture-chooser {
  width: 400px;
  .el-input-group__prepend {
    width: 200px;
    padding: 0;
    background: #fff;
  }
  .el-cascader .el-input__inner {
    height: 30px;
    border: none;
  }
}
.furniture-table .el-table__row td {
  padding-bottom: 7px;
}
</style>