<template>
<el-card>
  <el-tabs type="card" v-model="rarity">
    <el-tab-pane label="6星" name="6"></el-tab-pane>
    <el-tab-pane label="5星" name="5"></el-tab-pane>
  </el-tabs>
  <el-table
    :data="list"
    height="400"
    :default-sort="{prop: 'lastUp', order: 'descending'}"
    border>
    <el-table-column
      prop="name"
      label="干员"
      width="200">
    </el-table-column>
    <el-table-column
      prop="ups"
      label="UP">
      <template slot-scope="scope">
        <div class="up-times">
          <el-tag v-for="(item, index) in scope.row.ups" :key="index" class="tag" effect="dark" :type="typeStatus[item[1]]">{{item[0]}}</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="count"
      label="UP次数"
      width="100"
      sortable>
    </el-table-column>
    <el-table-column
      prop="lastUp"
      label="上次UP"
      width="150"
      sortable>
    </el-table-column>
    <el-table-column
      prop="shopCount"
      label="进店次数"
      width="120"
      sortable>
    </el-table-column>
    <el-table-column
      prop="lastShop"
      label="上次进店"
      width="150"
      sortable>
    </el-table-column>
  </el-table>
</el-card>
</template>

<script>
import upsData from '@/data/config/up.json'
export default {
  data() {
    return {
      rarity: '6',
      //up类型说明
      //   0: 标准双up,不进店,普通蓝色
      //   1: 标准双up,进店,红色
      //   2: 新up(和限定一起的双up6星也算),绿色
      //   3: 特殊up(联合up或单up,旧5星和新up一起算在这),黄色
      typeStatus: ['', 'danger', 'success', 'warning'],
      list6: [],
      list5: []
    }
  },
  computed: {
    list() {
      return this['list'+this.rarity];
    }
  },
  mounted() {
    for(const i in upsData) {
      if(i=='//') continue;
      for(const j in upsData[i]) {
        let record = {
          name: j,
          ups: upsData[i][j]
        };
        record.count = record.ups.length;
        record.lastUp = record.ups[0][0];
        const shops = record.ups.filter(x=>x[1]==1);
        record.shopCount = shops.length;
        record.lastShop = shops.length ? shops[0][0] : '';
        this['list'+i].push(record);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.up-times .tag+.tag {
  margin-left: 10px;
}
</style>