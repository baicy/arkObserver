<template>
  <div>
    <div class="nav-menu">
      <div class="menu-icon" @click="drawer = true">
        <i class="el-icon-menu"></i>
      </div>
      <div class="menu-title">
        {{title}}
      </div>
    </div>
    <el-drawer
      direction="ltr"
      :show-close="false"
      :visible.sync="drawer"
    >
    </el-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '测试',
      drawer: false
    }
  } 
}
</script>
<style scoped>
  .nav-menu {
    border-right: solid 1px #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #FFF;
    border-bottom: solid 1px #e6e6e6
  }
  .nav-menu .menu-icon, .nav-menu .menu-title {
    font-size: 20px;
    color: #303133;
    padding: 10px 20px;
    display: inline-block;
  }
  .nav-menu .menu-icon {
    cursor: pointer;
  }
</style>