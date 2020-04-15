<template>
<el-card>
  <el-table
    :data="list"
    height="500"
    class="furniture-table"
    border>
    <el-table-column
      prop="name"
      label="套装"
      width="240">
    </el-table-column>
    <el-table-column
      prop="furnitures"
      label="家具">
      <template slot-scope="scope">
        <el-tag v-for="(item, index) in scope.row.furnitures" :key="index" class="item-tag" effect="plain">{{item}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="stages"
      label="掉落关卡">
      <template slot-scope="scope">
        <el-tag v-for="(item, index) in scope.row.stages" :key="index" class="item-tag" effect="plain">{{item}}</el-tag>
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
      list: []
    }
  },
  methods: {
    initData() {
      const themes = themesData.activeThemes;
      const drops = themesData.dropStages;
      const furnitures = furnituresData.customData.furnitures;
      const groups = furnituresData.customData.groups;
      for(let theme of themes)
      {
        for(let i=1;i<=4;i++) {
          const groupId = theme.id+'_'+i;
          const groupData = groups[groupId];
          let group = {
            id: groupId,
            name: theme.name+'-'+groupData.name,
            furnitures: [],
            stages: []
          };
          for(let fid of groupData.furniture) {
            group.furnitures.push(furnitures[fid].name);
          }
          for(let stage of drops[theme.dropGroup[i]]) {
            group.stages.push(stage);
          }
          this.list.push(group);
        }
      }
    },
  },
  mounted() {
    this.initData();
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
.furniture-table .el-table__row td {
  padding-bottom: 7px;
}
</style>