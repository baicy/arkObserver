<template>
<el-card>
  <el-tabs type="border-card" v-model="currentPoolId" @tab-click="handleChangePool">
    <el-tab-pane
      v-for="(pool, index) in pools" :key="index"
      :name="pool.gachaPoolId">
      <span slot="label">
        <i v-if="pool.open" class="el-icon-magic-stick" />
        {{pool.gachaPoolName=='适合多种场合的强力干员'?'轮换标准寻访':pool.gachaPoolName}}
      </span>
      <!-- 卡池信息区 -->
      <el-row>
        <el-col :span="8">
          <p>开放时间：{{new Date(pool.openTime*1000).toLocaleString(undefined, {hour12: false})}} - {{new Date(pool.endTime*1000).toLocaleString(undefined, {hour12: false})}}</p>
          <el-button v-if="logs[pool.gachaPoolId]" @click="clearPoolLogs(pool.gachaPoolId)" type="danger" size="small">清除卡池记录</el-button>
        </el-col>
        <el-col :span="10">
          <el-row>
            <el-col :span="6">
              <span>获得概率提升干员：</span>
            </el-col>
            <el-col :span="18">
              <div v-if="pool.pickUp6">
                6<i class="el-icon-star-on"></i>
                <span
                  v-for="(character, index) in pool.pickUp6" :key="index"
                  class="pool-character"
                  :class="{'shop-character': pool.pickUpType=='Standard'&&index==1}">
                  {{character}}<span v-if="pool.gachaPoolType=='LimitedAdvancedGacha'&&index==0">(限定)</span>
                </span>
              </div>
              <div v-if="pool.pickUp5">
                5<i class="el-icon-star-on"></i>
                <span v-for="(character, index) in pool.pickUp5" :key="index" class="pool-character" :class="{'shop-character': pool.pickUpType=='Standard'&&index==1}">{{character}}</span>
              </div>
              <div v-if="pool.pickUp4">
                4<i class="el-icon-star-on"></i>
                <span v-for="(character, index) in pool.pickUp4" :key="index" class="pool-character">{{character}}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <span>
            距离上个6<i class="el-icon-star-on"></i>干员<span style="padding: 20px;font-size: 2em;">{{last6Count}}</span>抽
            ( {{ 2+(last6Count>50?(last6Count-50)*2:0) }}% )
            <el-button v-if="currentPoolLimit&&last6Count>0" @click="clearLimitLast" type="danger" size="small">清空</el-button>
          </span>
        </el-col>
      </el-row>
      <div v-if="pool.open">
        <el-divider></el-divider>
        <!-- 抽卡操作区 -->
        <el-row>
          <el-col :span="4">
            <el-switch
              v-model="isTenGacha"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="十连"
              inactive-text="单抽">
            </el-switch>
          </el-col>
          <el-col :span="20">
            <span v-for="rarity in [6,5,4,3]" :key="rarity">
              <el-input
                class="input-new-character"
                v-if="inputVisible[rarity]"
                v-model="inputName[rarity]"
                :ref="'saveInput'+rarity"
                size="small"
                @keyup.enter.native="handleInputCharacterConfirm(rarity)"
                @blur="handleInputCharacterConfirm(rarity)"
              >
              </el-input>
              <el-button v-else class="button-new-character" size="small" @click="showInput(rarity)">+ {{rarity}}<i class="el-icon-star-on"></i></el-button>
            </span>
            <el-button class="button-new-character" size="small" type="primary" @click="handleCommonCharacter(4)">+ 4<i class="el-icon-star-on"></i></el-button>
            <el-button class="button-new-character" size="small" type="primary" @click="handleCommonCharacter(3)">+ 3<i class="el-icon-star-on"></i></el-button>
          </el-col>
        </el-row>
        <!-- 十连显示区 -->
        <el-row class="ten-gacha-box">
          <el-col :span="2" v-for="index in 10" :key="index" class="ten-gacha-col">
            <el-tag
              v-if="tenGachaCharacters.length>=index"
              closable
              :type="rarityTagStatus[tenGachaCharacters[index-1].rarity]"
              :disable-transitions="true"
              @close="handleRemoveCharacter(index-1)">
              {{tenGachaCharacters[index-1].name}}
            </el-tag>
            <div v-else style="height:32px"></div>
            <el-divider></el-divider>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="logTenGacha">记录</el-button>
          </el-col>
        </el-row>
      </div>
      <el-divider>{{logSummary}}</el-divider>
      <div class="infinite-list-wrapper" style="overflow:auto">
        <div
          v-if="logs[pool.gachaPoolId]"
          class="log-list">
          <div v-for="(log,index) in logs[pool.gachaPoolId]" :key="index" class="log-list-item">
            <el-tag
              v-for="(character,i) in log" :key="i"
              :type="rarityTagStatus[character.rarity]"
              :disable-transitions="true">
              {{character.name}}
            </el-tag>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</el-card>
</template>
<script>
import poolsData from '@/data/config/gacha.json'
export default {
  data() {
    return {
      pools: [],
      isTenGacha: true,
      tenGachaCharacters: [],
      inputVisible: {
        6: false,
        5: false,
        4: false,
        3: false
      },
      inputName: {
        6: '',
        5: '',
        4: '',
        3: ''
      },
      rarityTagStatus: {
        6: 'danger',
        5: 'warning',
        4: 'success',
        3: ''
      },
      currentPoolId: '',
      currentPoolLimit: false,
      logs: {}
    }
  },
  computed: {
    last6Count() {
      let gachaLogs = this.$store.getters.gachaLogs();
      return this.currentPoolLimit?gachaLogs.limitLast6:gachaLogs.normalLast6;
    },
    logSummary() {
      if(!this.logs[this.currentPoolId]) {
        return '暂无记录';
      }
      let turn = 0, num6 = 0, num5 = 0, up6 = 0, up5 = 0;
      for(let i in this.logs[this.currentPoolId]) {
        turn += this.logs[this.currentPoolId][i].length;
        for(let j in this.logs[this.currentPoolId][i]) {
          let character = this.logs[this.currentPoolId][i][j];
          if(character.rarity==6) {
            num6++;
            if(this.pools.find(p=>p.gachaPoolId==this.currentPoolId).pickUp6.includes(character.name)) {
              up6++;
            }
          } else if(character.rarity==5) {
            num5++;
            if(this.pools.find(p=>p.gachaPoolId==this.currentPoolId).pickUp5.includes(character.name)) {
              up5++;
            }
          }
        }
      }
      return `总计 ${turn} 抽; 6星 ${num6} 个, UP内 ${up6} 个; 5星 ${num5} 个, UP内 ${up5} 个;`;
    }
  },
  methods: {
    handleChangePool(tab, event) {
      this.currentPoolId = tab.name;
      this.currentPoolLimit = this.pools[tab.index].gachaPoolType=='LimitedAdvancedGacha'?true:false;
    },
    showInput(rarity) {
      this.inputVisible[rarity] = true;
      this.$nextTick(_ => {
        this.$refs['saveInput'+rarity][0].$refs.input.focus();
      });
    },
    handleInputCharacterConfirm(rarity) {
      let inputValue = this.inputName[rarity];
      if (inputValue) {
        this.gacha(inputValue, rarity);
      }
      this.inputVisible[rarity] = false;
      this.inputName[rarity] = '';
    },
    handleCommonCharacter(rarity) {
      this.gacha(rarity+'★', rarity);
    },
    gacha(name, rarity) {
      let character = {
        name: name,
        rarity: rarity
      };
      if(this.isTenGacha) {
        if(this.tenGachaCharacters.length<10) {
          this.tenGachaCharacters.push(character);
        }
      } else {
        this.logGacha([character]);
      }
    },
    handleRemoveCharacter(index) {
      this.tenGachaCharacters.splice(index, 1);
    },
    logTenGacha() {
      if(this.tenGachaCharacters.length<10) {
        this.$message.error('未达成十连');
        return false;
      }
      this.logGacha(this.tenGachaCharacters);
      this.tenGachaCharacters = [];
    },
    logGacha(characters) {
      this.$store.dispatch('addGachaLog', {
        limit: this.currentPoolLimit,
        poolId: this.currentPoolId,
        characters: [...characters]
      });
    },
    clearLimitLast() {
      this.$store.dispatch('clearGachaLimitLast6');
    },
    clearPoolLogs(poolId) {
      this.$store.dispatch('clearPoolLogs', poolId);
    }
  },
  mounted() {
    let now = new Date();
    this.pools = [...poolsData.gachaPoolClient];
    this.pools.forEach(pool => pool.open = (pool.openTime*1000<=now && pool.endTime*1000>=now)?true:false);
    this.currentPoolId = this.pools[0].gachaPoolId;
    this.currentPoolLimit = this.pools[0].gachaPoolType=='LimitedAdvancedGacha'?true:false;
    this.logs = this.$store.getters.gachaLogs().logs;
  }
}
</script>
<style lang="less">
.pool-character {
  margin-left: 10px;
}
.shop-character {
  font-weight: bold;
}
.button-new-character {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-character {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.ten-gacha-box {
  margin-top: 10px;
  .el-divider--horizontal {
    width:90%;
    margin: 10px 0;
  }
}
.ten-gacha-col {
  height: 60px;  
}
.log-list-item {
  margin-bottom: 10px;
  .el-tag + .el-tag {
    margin-left: 20px;
  }
} 
</style>