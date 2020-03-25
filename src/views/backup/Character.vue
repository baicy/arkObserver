<template>
  <div>
    <!-- <canvas ref="canvas"></canvas> -->
    <!-- <el-button @click="test">Click</el-button> -->
    <VirtualListTable
      :data="chars"
      :columns="columns"
      :height="300"
      :loading.sync="loading">
      <template slot-scope="scope" slot="name">
        <el-tag :color="rarityColors[scope.row.rarity]" effect="dark">{{scope.row.name}}</el-tag>
      </template>
      <template slot-scope="scope" slot="rarity">
        <i class="el-icon-star-on" v-for="i in scope.row.rarity+1" :key="i"></i>
      </template>
      <template slot-scope="scope" slot="display">
        {{scope.row.displayLogo | displayText}}
      </template>
      <template slot-scope="scope" slot="profession">
        {{scope.row.profession | professionText}}
      </template>
      <template slot-scope="scope" slot="position">
        {{scope.row.position | position}}
      </template>
      
    </VirtualListTable>
  </div>
</template>
<script>
import paths from '@/utils/paths'
import VirtualListTable from '@/components/VirtualListTable.vue'
export default {
  components: { VirtualListTable },
  data() {
    return {
      canvas: null,
      ctx: null,
      chars: [],
      rarityColors: ['#d3d3d3','#90ee90','#add8e6','#ca4bca','#ffd700','#ff8d00'],
      page: 304,
      columns: [],
      loading: false
    }
  },
  created() {
    // this.canvas = this.$refs.canvas;
    // this.ctx = this.canvas.getContext('2d');
    // let img = new Image();
    // img.src = require('../assets/rilogo.jpg');
    // img.onload = () => {
    //   this.canvas.width = img.naturalWidth;
    //   this.canvas.height = img.naturalHeight;
    //   this.ctx.drawImage(img, 0, 0);
    // }
    
    const url = paths.character;
    this.loading = true;
    this.$fetch(url)
      .then(data => {
        this.chars = Object.values(data).filter(x => x.displayNumber);
        console.log(this.chars[0]);
        let displays = {};
        this.chars.forEach((x)=>{
          displays[x.itemObtainApproach] = '';
        });
        console.log(displays);
      })
      .catch(err=>{
        // this.$message.error('加载失败');
        let list = [];
        for(let i=0;i<this.page;i++) {
          list.push({
            name: "test"+i,
            displayNumber: i,
            rarity: Math.floor(Math.random()*5)+1,
            profession: 'TANK',
            position: 'MELEE',
            display: 'logo_rhodes'
          });
        }
        this.chars = [...list];
      });
      
    // let now = Date.now();
    // console.log('JS运行时间:' + (Date.now()-now) + 'ms');
    // now = Date.now();
    // this.$nextTick(()=>{
    //   console.log('渲染用时间:' + (Date.now()-now) + 'ms');
    // });
    this.columns = [
      {
        label: '代号', column: 'name', width: '100px', sortable: true, slot: 'name'
      },
      {
        label: '稀有度', column: 'rarity', sortable: true, slot: 'rarity'
      },
      {
        label: '阵营', column: 'displayLogo', sortable: true, slot: 'display'
      },
      {
        label: '编号', column: 'displayNumber',width: '400px', sortable: true
      },
      {
        label: '职业', column: 'profession', sortable: true, slot: 'profession'
      },
      {
        label: '位置', column: 'position', sortable: true, slot: 'position'
      },
    ];
  }
}
</script>
<style>
</style>