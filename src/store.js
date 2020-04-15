import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

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
  },
  mutations: {
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
    addGachaLog({commit}, info) {
      commit('addGachaLog', info);
    },
    clearGachaLimitLast6({commit}, info) {
      commit('clearGachaLimitLast6', info);
    },
    clearPoolLogs({commit}, poolId) {
      commit('clearPoolLogs', poolId);
    },
    setStore({commit}, info) {
      commit('setStore', info);
    },
    setCal({commit}, info) {
      commit('setCal', info);
    },
    setCharacter({commit}, info) {
      commit('setCharacter', info);
    },
    setPlan({commit}, info) {
      commit('setPlan', info);
    },
    removePlan({commit}, id) {
      commit('removePlan', id);
    }
  }
})
