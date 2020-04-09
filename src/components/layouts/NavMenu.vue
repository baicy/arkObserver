<template>
<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="/gacha/pool">卡池记录</el-menu-item>
  <el-menu-item index="/furniture">家具记录</el-menu-item>
  <el-menu-item index="/handbook">情报网络</el-menu-item>
  <el-menu-item index="/character">干员仓管</el-menu-item>
  <!-- <el-menu-item index="/stage">作战地图</el-menu-item>
  <el-menu-item index="/story">剧情回放</el-menu-item>
  <el-menu-item index="/store">仓库识别</el-menu-item> -->
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
    handleSelect(key, keyPath) {
      this.$router.push(key).catch(_=>{});//添加catch防止报错点击重复路由
    }
  },
  mounted() {
    if(this.$router.currentRoute.path!='/') {
      this.activeIndex = this.$router.currentRoute.path;
    }
  }
}
</script>