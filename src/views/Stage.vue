<template>
  <el-card>
    <el-row>
      <el-col :span="6">
        <el-tree
          style="height:400px;overflow-y:auto;"
          :data="stages"
          :props="treeProps"
          node-key="id"
          :default-expanded-keys="['daily2']"
          @node-click="handleNodeClick"></el-tree>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import stagesInfo from '@/data/config/stage.json'
import stagesData from '@/data/source/stage_table.json'
import zonesData from '@/data/source/zone_table.json'
export default {
  data() {
    return {
      stages: [],
      treeProps: {
        label: 'label',
        children: 'children'
      }
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
      if(stagesData.stages[i].stageType=='MAIN' && stagesData.stages[i].difficulty=='NORMAL') {
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
      } else if(stagesData.stages[i].stageType=='ACTIVITY' && stagesData.stages[i].difficulty=='NORMAL') {
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
    handleNodeClick(node) {
      if(!node.children) {
        this.$message(node.label);
      }
    }
  }
}
</script>