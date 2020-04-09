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
      <el-col :span="18">
        <div style="background:#333333;width:100%;height:300px;">
          <div v-for="(row, rowIndex) in map.mapData.map" :key="rowIndex">
            <div v-for="(column, columnIndex) in row" :key="columnIndex" :class="map.mapData.tiles[column].tileKey"></div>
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
/**
 * @param {number} capacity
 */
var LFUCache = function(capacity) {
    this.cache = [];
    this.capacity = capacity;
    this.size = 0;
    this.frequencies = [];
    this.frequencyList = [];
};

/** 
 * @param {number} key
 * @return {number}
 */
LFUCache.prototype.get = function(key) {
    if(this.capacity<=0) {
        return -1;
    }
    if(this.cache[key]==undefined) {
        return -1;
    } else {
        this.update(key);
        return this.cache[key];
    }
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LFUCache.prototype.put = function(key, value) {
    if(this.capacity==0) {
        return null;
    }
    this.cache[key] = value;
    this.update(key);
};

/** 
 * @param {number} key
 * @return {void}
 */
LFUCache.prototype.update = function(key) {
    if(this.frequencies[key]==undefined) {
        this.size++;
        this.frequencies[key] = -1;
    } else {
        this.frequencyList[this.frequencies[key]].delete(key);
    }
    if(this.size>this.capacity) {
        let find = false;
        for(const fset of this.frequencyList) {
            if(!fset) continue;
            for(const f of fset) {
                fset.delete(f);
                delete(this.frequencies[f]);
                delete(this.cache[f]);
                this.size--;
                find = true;
            }
            if(find) break;
        }
    }
    this.frequencies[key] = this.frequencies[key]+1;
    this.frequencyList[this.frequencies[key]] = this.frequencyList[this.frequencies[key]] || new Set();
    this.frequencyList[this.frequencies[key]].add(key);
}

/**
 * Your LFUCache object will be instantiated and called as such:
 * var obj = new LFUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
let lfu = new LFUCache(2);
lfu.put(1,1);
lfu.put(2,2);
lfu.get(1);
lfu.put(3,3);
lfu.get(2);
lfu.get(3);
lfu.put(4,4);
lfu.get(1);
lfu.get(3);
lfu.get(4);
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
      // console.log(node);
      if(!node.children) {
        if(node.id.substr(0,4)=='main') {
          import('../data/source/levels/obt/main/level_'+node.id+'.json').then(data => {
            Object.assign(this.map, data.default);
            console.log(this.map);
          });
        }
        // this.$message(node.label);
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tile {
  width: 30px;
  height: 30px;
  display: inline-block;
  color: white;
}
.tile-border {
  border: 1px solid #ffffff;
}
.tile_forbidden {
  background: #333333;
  .tile;
}
.tile_floor {
  background: #333333;
  .tile;
}
.tile_wall {
  background: #eeeeee;
  .tile;
  .tile-border;
}
.tile_road {
  background: #777777;
  .tile;
  .tile-border;
}
.tile_end {
  background: lightblue;
  .tile;
  .tile-border;
}
.tile_start {
  background: red;
  .tile;
  .tile-border;
}
.tile_flystart {
  background: lightcoral;
  .tile;
  .tile-border;
}
</style>