<template>
  <el-card>
    <el-row>
      <el-col :span="6">
        <el-tree
          style="height:400px;overflow-y:auto;"
          :data="stages"
          :props="treeProps"
          node-key="id"
          @node-click="selectMap"></el-tree>
      </el-col>
      <el-col :span="18">
        <div v-if="Object.keys(stage).length" class="stage">{{stage.code+' '+stage.name}}</div>
        <div class="map">
          <div v-for="(row, rowIndex) in map.mapData.map" :key="rowIndex" class="row">
            <div v-for="(column, columnIndex) in row" :key="columnIndex" :class="['tile', map.mapData.tiles[column].tileKey.replace(/_/g, '-')]">
              <div v-if="map.tokens[rowIndex][columnIndex]" :class="'predefine-'+map.tokens[rowIndex][columnIndex].direction">{{map.tokens[rowIndex][columnIndex].name}}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import stagesInfo from '@/data/config/stage.json'
import stagesData from '@/data/source/stage_table.json'
import zonesData from '@/data/source/zone_table.json'
import charactersData from '@/data/source/character_table.json'
export default {
  data() {
    return {
      stages: [],
      treeProps: {
        label: 'label',
        children: 'children'
      },
      map: {
        mapData: {
          map: []
        }
      },
      stage: {}
    }
  },
  mounted() {
    stagesInfo[1].stages = {};
    for(let i in stagesInfo[1].zones) {
      stagesInfo[1].stages[stagesInfo[1].zones[i]] = [];
    }
    stagesInfo[2].stages = [];
    stagesInfo[3].stages = [];
    stagesInfo[4].stages = [];
    let activities = {};
    for(let i in stagesData.stages) {
      if(stagesData.stages[i].stageType=='MAIN' && stagesData.stages[i].difficulty=='NORMAL' && stagesData.stages[i].levelId) {
        stagesInfo[1].stages[stagesData.stages[i].zoneId].push({
          id: i,
          code: stagesData.stages[i].code
        });
      } else if(stagesData.stages[i].stageType=='DAILY') {
        let zoneId = stagesData.stages[i].zoneId;
        let index = parseInt(zoneId.substr(-1))>4?2:3;
        stagesInfo[index].stages.push({
          id: i,
          code: stagesData.stages[i].code
        });
      } else if(stagesData.stages[i].stageType=='CAMPAIGN') {
        stagesInfo[4].stages.push({
          id: i,
          name: stagesData.stages[i].name
        });
      } else if(stagesData.stages[i].stageType=='ACTIVITY' && stagesData.stages[i].difficulty=='NORMAL' && stagesData.stages[i].levelId) {
        let zoneId = stagesData.stages[i].zoneId;
        if(zoneId.substr(0,4)!='main') {
          if(!activities[zoneId]) {
            activities[zoneId] = [];
          }
          activities[zoneId].push({
            id: i,
            code: stagesData.stages[i].code
          });
        }
      }
    }
    for(let i in stagesInfo) {
      let node = {
        id: stagesInfo[i].id,
        label: stagesInfo[i].name,
        children: []
      };
      if(stagesInfo[i].id=='mainline') {
        for(let j in stagesInfo[i].zones) {
          let zone = {
            id: stagesInfo[i].zones[j],
            label: zonesData.zones[stagesInfo[i].zones[j]].zoneNameFirst,
            children: []
          };
          for(let stage of stagesInfo[i].stages[zone.id]) {
            zone.children.push({
              id: stage.id,
              label: stage.code
            });
          }
          node.children.push(zone);
        }
      } else if(stagesInfo[i].id=='daily1' || stagesInfo[i].id=='daily2') {
        for(let stage of stagesInfo[i].stages) {
          node.children.push({
            id: stage.id,
            label: stage.code
          });
        }
      } else if(stagesInfo[i].id=='campaign') {
        for(let stage of stagesInfo[i].stages) {
          node.children.push({
            id: stage.id,
            label: stage.name
          });
        }
      } else if(stagesInfo[i].id=='closed') {
        for(let activity of stagesInfo[i].activities) {
          let zone = {
            id: activity.id,
            label: activity.name,
            children: [] 
          };
          if(activity.stages) {
            for(let stage of activity.stages) {
              zone.children.push({
                id: stage.id,
                label: stage.code
              });
            }
          } else if(activity.zones){
            for(let zoneId of activity.zones) {
              for(let stage of activities[zoneId]) {
                zone.children.push({
                  id: stage.id,
                  label: stage.code
                });
              }
            }
          }
          node.children.push(zone);
        }
      }
      this.stages.push(node);
    }
  },
  methods: {
    selectMap(node) {
      if(!node.children) {
        if(stagesData.stages[node.id]) {
          this.stage = stagesData.stages[node.id];
          import('../data/source/levels/'+this.stage.levelId.toLowerCase()+'.json').then(data => {
            Object.assign(this.map, data.default);
            this.map.tokens = [];
            for(let i=0;i<this.map.mapData.height;i++) {
              this.map.tokens.push(Array(this.map.mapData.width));
            }
            if(this.map.predefines) {
              for(let i of this.map.predefines.tokenInsts) {
                this.map.tokens[this.map.mapData.height-i.position.row-1][i.position.col] = {
                  name: charactersData[i.inst.characterKey].name,
                  direction: i.direction
                };
              }
              for(let i of this.map.predefines.characterInsts) {
                this.map.tokens[this.map.mapData.height-i.position.row-1][i.position.col] = {
                  name: charactersData[i.inst.characterKey].name,
                  direction: i.direction
                };
              }
            }
          });
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.map {
  .row {
    margin: 0;
    .tile {
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      display: inline-block;
      color: white;
      font-size: 14px;
      padding: 2px 5px;
      line-height: 18px;
    }
    .tile:hover {
      border: 1px solid #ffffff;
      cursor: pointer;
    }
    .tile-border {
      border: 1px solid #ffffff;
    }
    .tile-forbidden {
      background: #333333;
    }
    .tile-floor {
      background-image: url("../assets/images/texture/forbidden.png");
      background-size: 100%;
    }
    .tile-wall, .tile-rcm-operator {
      background: #bbbbbb;
      color: #333333;
      .tile-border
    }
    .tile-road, .tile-rcm-crate {
      background: #777777;
      .tile-border
    }
    .tile-fence {
      background: #777777;
      box-shadow: inset #444444 0px 0px 0px 5px;
      .tile-border
    }
    .tile-hole {
      background: #ffffff;
      box-shadow: inset #333333 0px 0px 0px 8px;
      .tile-border
    }
    .tile-end {
      background: lightblue;
      .tile-border
    }
    .tile-start {
      background: red;
      .tile-border
    }
    .tile-flystart {
      background: lightcoral;
      .tile-border
    }
    .tile-grass {
      background-color: #35d035;
      .tile-border
    }
    .tile-gazebo {
      background-image: url("../assets/images/texture/AA.png");
      background-size: 100%;
    }
    .tile-bigforce {
      background-image: url("../assets/images/texture/force.png");
      background-size: 100%;
    }
    .tile-healing {
      background-image: url("../assets/images/texture/heal.png");
      background-size: 100%;
    }
    .tile-infection {
      background-image: url("../assets/images/texture/fury.png");
      background-size: 100%;
    }
    .tile-volcano {
      background-image: url("../assets/images/texture/fire.png");
      background-size: 100%;
    }
    .tile-telin, .tile-telout {
      background-color: #333333;
      background-image: url("../assets/images/texture/tel_light.png");
      background-size: 100%;
      .tile-border
    }
    .tile-before {
      color: #dddddd;
      line-height: 38px;
    }
    .tile-telin:before {
      content: 'in';
      margin-left: 10px;
      .tile-before
    }
    .tile-telout:before {
      content: 'out';
      margin-left: 7px;
      .tile-before
    }
    .tile-defup {
      background-image: url("../assets/images/texture/def.png");
      background-size: 100%;
    }
    .tile-corrosion {
      background-image: url("../assets/images/texture/corrosion.png");
      background-size: 100%;
    }
    .tile-deepwater {
      background: #3e95f3;
    }
    .tile-volspread {
      background-image: url("../assets/images/texture/flow_32.png");
      background-size: 100%;
    }
    .predefine-0, .predefine-1, .predefine-2, .predefine-3 {
      position: relative;
    }
    .predefine-before {
      content: '';
      width: 10px;
      height: 10px;
      position: absolute;
      border: 8px solid #fff;
    }
    .predefine-0:before {
      .predefine-before;
      border-color: transparent transparent white transparent;
      right: 6px;
      top: -18px;
    }
    .predefine-1:before {
      .predefine-before;
      border-color: transparent transparent transparent white;
      right: -22px;
      top: 10px;
    }
    .predefine-2:before {
      .predefine-before;
      border-color: white transparent transparent transparent;
      right: 6px;
      top: 38px;
    }
    .predefine-3:before {
      .predefine-before;
      border-color: transparent white transparent transparent;
      left: -22px;
      top: 10px;
    }
  }
}
</style>