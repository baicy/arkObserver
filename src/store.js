import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
// import PlanManager from './utils/PlanManager.js'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "ark-observer-abc",
      paths: [
        "gachaLogs",
        "stores",
        "cals",
        "characters",
        "plans"
      ]
    })
  ],
  state: {
    // data: {},
    gachaLogs: {
      logs: {},
      normalLast6: 0,
      limitLast6: 0,
      last6s: []
    },
    stores: {},
    cals: {},
    characters: [],
    plans: []
    // selectedItem: { character: '', material: '' }
  },
  mutations: {
    updateCharacter: (state, c) => {
        state.characters[c.key] = c.status;
    },
    updateCharacters: (state, characters) => {
        state.characters = characters;
    },
    updateCharactersData: (state, payload) => {
        state.characters[payload.key] = payload.value;
    },
    resetCharactersData: (state) => {
        state.characters = {};
        state.plans = {};
    },
    resetPlans: (state) => {
        state.plans = {};
    },
    updatePlansData: (state, payload) => {
        for(var i in payload){
            state.plans[i] = payload[i];
        }
    },
    updatePlans: (state, plans) => {
        state.plans = plans;
    },
    removePlan: (state, payload) => {
        let plans = Object.assign({}, state.plans);
        delete plans[payload.char][payload.key];
        if(!Object.keys(plans[payload.char]).length)
            delete plans[payload.char];
        state.plans = Object.assign({}, plans);
    },
    setSelectedItem: (state, info) => {
        state.selectedItem[info.type] = info.val;
    },
    addGachaLog: (state, info) => {
      if(!state.gachaLogs.logs[info.poolId]) {
        Vue.set(state.gachaLogs.logs, info.poolId, []);
      }
      state.gachaLogs.logs[info.poolId].unshift(info.characters);
      let type = info.limit?'limit':'normal';
      for(let i of info.characters) {
        if(i.rarity==6) {
          state.gachaLogs.last6s.unshift(state.gachaLogs[type+'Last6']);
          state.gachaLogs[type+'Last6'] = 0;
        } else {
          state.gachaLogs[type+'Last6']++;
        }
      }
    },
    clearGachaLimitLast6: (state) => {
      state.gachaLogs.last6s.unshift(state.gachaLogs.limitLast6+0.5);
      state.gachaLogs.limitLast6 = 0;
    },
    clearPoolLogs: (state, poolId) => {
      Vue.delete(state.gachaLogs.logs, poolId);
    },
    setStore: (state, info) => {
      if(info.mid) {
        Vue.set(state.stores, info.mid, info.number);
      } else {
        Vue.set(state, 'stores', info);
      }
    },
    setCal: (state, info) => {
      if(info.mid) {
        Vue.set(state.cals, info.mid, info.number);
      } else {
        Vue.set(state, 'cals', info);
      }
    },
    setCharacter: (state, info) => {
      if(info.id) {
        const index = state.characters.findIndex(c=>c.id==info.id);
        if(index!=-1) {
          Vue.set(state.characters, index, info.data);
        } else {
          state.characters.unshift(info.data);
        }
      } else {
        Vue.set(state, 'characters', info);
      }
    },
    setPlan: (state, info) => {
      if(info.id) {
        Vue.set(state.plans, info.id, info.data);
      } else {
        Vue.set(state, 'plans', info);
      }
    },
    removePlan: (state, id) => {
      Vue.delete(state.plans, id);
    }
  },
  getters: {
    getPlans: (state) => (refresh) => {
        return state.plans;
    },
    selectedItem: (state) => (type) => state.selectedItem[type],
    gachaLogs: (state) => (poolId) => {
      if(poolId) {
        return state.gachaLogs[poolId];
      } else {
        return state.gachaLogs;
      }
    },
    stores: (state) => (mid) => {
      return mid ? state.stores[mid] : state.stores;
    },
    cals: (state) => (mid) => {
      return mid ? state.cals[mid] : state.cals;
    },
    characters: (state) => (id) => {
      return id ? state.characters.find(c=>c.id==id) : state.characters;
    },
    plans: (state) => (id) => {
      return id ? state.plans.find(p=>p.id==id) : state.plans;
    }
  },
  actions: {
    setSelectedItem({commit, state}, info) {
        commit('setSelectedItem', info);
    },
    addGachaLog({commit, state}, info) {
      commit('addGachaLog', info);
    },
    clearGachaLimitLast6({commit, state}, info) {
      commit('clearGachaLimitLast6', info);
    },
    clearPoolLogs({commit, state}, poolId) {
      commit('clearPoolLogs', poolId);
    },
    setStore({commit, state}, info) {
      commit('setStore', info);
    },
    setCal({commit, state}, info) {
      commit('setCal', info);
    },
    setCharacter({commit, state}, info) {
      commit('setCharacter', info);
    },
    setPlan({commit, state}, info) {
      commit('setPlan', info);
    },
    removePlan({commit, state}, id) {
      commit('removePlan', id);
    }
  }
})
