<template>
  <div>
    <!-- <canvas ref="canvas"></canvas> -->
    <el-button @click="test">Click</el-button>
    <!-- <div style="height:300px;width:100px;overflow-y:scroll;border:1px solid red;" @scroll="onScroll($event)">
      <ul>
        <li v-for="(char, i) in chars" :key="i">{{char.name}}</li>
      </ul>
    </div> -->
    <el-table
      :data="showChars"
      :height="tableHeight"
      border
      style="width: 100%"
      id="table">
      <el-table-column
        prop="name"
        label="代号"
        sortable
        >
        <template slot-scope="scope">
          <el-popover trigger="click" placement="right">
            <p>姓名: {{ scope.row.name }}</p>
            <p>编号: {{ scope.row.displayNumber }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag
                size="medium"
                effect="dark"
                :color="rarityColors[scope.row.rarity]"
                :hit="false">
                {{ scope.row.name }}
              </el-tag>
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
      canvas: null,
      ctx: null,
      chars: [],
      rarityColors: ['#d3d3d3','#90ee90','#add8e6','#ca4bca','#ffd700','#ff8d00'],
      start: 0,
      size: 0,
      rowHeight: 53,
      tableHeight: 350,
      page: 5000,
      offset: 0
    }
  },
  computed: {
    listHeight() {
      return this.rowHeight * this.page;
    },
    showChars() {
      return this.chars.slice(this.start, Math.min(this.start+this.size, this.chars.length));
    },
    showSize() {
      return Math.ceil(this.tableHeight / this.rowHeight);
    }
  },
  methods: {
    test() {
      document.querySelector('#table .el-table__body-wrapper').onscroll = () => this.onScroll();
    },
    onScroll() {
      let scrollTop = document.querySelector('#table .el-table__body-wrapper').scrollTop;
      this.start = Math.floor(scrollTop / this.rowHeight);
      this.offset = scrollTop - (scrollTop % this.rowHeight);
      document.querySelector('#table .el-table__body>tbody').style = `transform:translate(0, ${this.offset}px)`;
    }
  },
  mounted() {
    this.size = this.showSize;
    // this.canvas = this.$refs.canvas;
    // this.ctx = this.canvas.getContext('2d');
    // let img = new Image();
    // img.src = require('../assets/rilogo.jpg');
    // img.onload = () => {
    //   this.canvas.width = img.naturalWidth;
    //   this.canvas.height = img.naturalHeight;
    //   this.ctx.drawImage(img, 0, 0);
    // }
    // const url = paths.character;
    // this.$fetch(url)
    //   .then(data => {
    //     this.chars = Object.values(data);
    //     console.log(data);
    //   })
    //   .catch(err=>{
    //     this.$message.error('加载失败');
    //   });
    let now = Date.now();
    let list = [];
    for(let i=0;i<this.page;i++) {
      list.push({
        name: "test"+i,
        displayNumber: "001",
        rarity: 3
      });
    }
    console.log('JS运行时间:' + (Date.now()-now) + 'ms');
    now = Date.now();
    this.chars = list;
    this.$nextTick(()=>{
      console.log('渲染用时间:' + (Date.now()-now) + 'ms');
      document.querySelector('#table .el-table__body').style = 'height: ' + this.listHeight + 'px';
    });
  }
}
</script>
<style type="css">
  #table .el-table__body>tbody {
    position: absolute;
  }
</style>