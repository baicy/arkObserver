<template>
<div class="canvas-container">
  <canvas ref="canvas" width="2000" height="2000"></canvas>
</div>
</template>
<script>
import charactersData from '@/data/source/character_table.json'
import headsData from '@/data/source/handbookcard_table.json'
import linesData from '@/data/source/handbookline_table.json'
import teamsData from '@/data/source/handbook_team_table.json'
export default {
  data() {
    return {
      canvas: null,
      ctx: null
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    let width = 2000, height = 2000;
    let x0 = 1000, y0 = 1000;
    let fontLvls = {
      1.4: '30',
      0.4: '24',
      0.0: '18'
    };
    //画布背景颜色
    this.ctx.fillStyle="#ccc";
    this.ctx.fillRect(0,0,width,height);
    //情报连线
    for(let i in linesData)
    {
      this.ctx.strokeStyle = 'white';
      this.ctx.beginPath();
      this.ctx.moveTo(x0+10+headsData[linesData[i].point1].xPos, y0-5-headsData[linesData[i].point1].yPos);
      this.ctx.lineTo(x0+10+headsData[linesData[i].point2].xPos, y0-5-headsData[linesData[i].point2].yPos);
      this.ctx.closePath();
      this.ctx.stroke();
    }
    //情报人员
    for(let i in headsData)
    {
      let charId = headsData[i].charID;
      this.ctx.font = fontLvls[headsData[i].lvl]+'px Monaco';
      let charPos = {x: x0+headsData[i].xPos, y: y0-headsData[i].yPos};
      let charName = '';
      if(charactersData[charId]) {
        charName = charactersData[charId].name;
        //阵营下划线
        if(charactersData[charId].team!=-1)
        {
          let nameWidth = this.ctx.measureText(charName).width;
          let nameHeight = parseFloat(charPos.y)+8;
          this.ctx.strokeStyle = '#'+teamsData[charactersData[charId].team].color;
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.moveTo(charPos.x, nameHeight);
          this.ctx.lineTo(charPos.x+nameWidth, nameHeight);
          this.ctx.stroke();
        }

        this.ctx.fillStyle = 'black';
      } else {
        let charInfo = charId.split('_');
        charName = charInfo[2];
        if(charInfo[0]=='npc') {
          this.ctx.fillStyle = 'blue';
        } else {
          this.ctx.fillStyle = 'red';
        }
      }
      //实装为干员的NPC排除npc显示
      if(charId!='npc_010_chen')
      {
        this.ctx.fillText(charName, charPos.x, charPos.y);
      }
    }
  }
}
</script>
<style scoped>
.canvas-container {
  overflow-x: scroll;
}
</style>