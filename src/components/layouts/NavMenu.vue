<template>
<el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
  <el-submenu index="gacha">
    <template slot="title">卡池记录</template>
    <el-menu-item index="/gacha/pool">抽卡记录</el-menu-item>
    <el-menu-item index="/gacha/up">UP记录</el-menu-item>
  </el-submenu>
  <el-menu-item index="/furniture">家具掉落</el-menu-item>
  <el-menu-item index="/character">干员管理</el-menu-item>
  <el-menu-item index="/material">材料管理</el-menu-item>
  <el-menu-item index="/handbook">情报网络</el-menu-item>
  <el-menu-item index="/stage">作战地图</el-menu-item>
</el-menu>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '/gacha/pool',
    };
  },
  methods: {
    handleSelect(key) {
      this.$router.push(key).catch(()=>{});//添加catch防止报错点击重复路由
    }
  },
  mounted() {
    if(this.$router.currentRoute.path!='/') {
      this.activeIndex = this.$router.currentRoute.path;
    }
  }
}
</script>