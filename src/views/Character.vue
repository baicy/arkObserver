<template>
  <div>
    <el-table
      :data="chars"
      max-height="300"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="代号"
        sortable
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="right">
            <p>姓名: {{ scope.row.name }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import paths from '@/utils/paths'
export default {
  data() {
    return {
      chars: []
    }
  },
  mounted() {
    const url = paths.character;
    this.$fetch(url)
      .then(data => {
        this.chars = Object.values(data);
        console.log(data);
      })
      .catch(err=>{
        this.$message.error('加载失败');
      });
  }
}
</script>