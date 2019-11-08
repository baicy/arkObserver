import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import StockManager from './utils/StockManager.js'
import PlanManager from './utils/PlanManager.js'

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [
  //   createPersistedState({
  //     key: "ark-observer-abc",
  //     paths: [
  //       // "plans",
  //       "characters",
  //       // "resources",
  //       // "formulateds",
  //       // "stocks"
  //     ]
  //   })
  // ],
  state: {
    // data: {},
    // plans: {},
    characters: {},
    // resources: {},
    // formulateds: {},
    // stocks: {},
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
      updateStock: (state, payload) => {
          state.stocks[payload.id].have = payload.amount;
      },
      updateStocks: (state, stocks) => {
          state.stocks = stocks;
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
      updateFormulated: (state, payload) => {
          Vue.set(state.formulateds, payload.key, payload.value);
      },
      updateFormulateds: (state, formulateds) => {
          state.formulateds = formulateds;
      },
      setSelectedItem: (state, info) => {
          state.selectedItem[info.type] = info.val;
      }
  },
  getters: {
      getCharactersStr: (state) => (refresh) => {
          return JSON.stringify(state.characters);
      },
      getCharacters: (state) => (refresh) => {
          return state.characters;
      },
      getCharacter: (state) => (key) => {
          return state.characters[key];
      },
      getStocks: (state) => (refresh) => {
          return state.stocks;
      },
      getStock: (state) => (key) => {
          if(state.stocks[key])
              return state.stocks[key];
          else
              return 0;
      },
      getPlans: (state) => (refresh) => {
          return state.plans;
      },
      getFormulateds: (state) => (refresh) => {
          return state.formulateds;
      },
      getFormulated: (state) => (key) => {
          return state.formulateds[key]?state.formulateds[key]:false;
      },
      selectedItem: (state) => (type) => state.selectedItem[type]
  },
  actions: {
      setSelectedItem({commit, state}, info) {
          commit('setSelectedItem', info);
      },
      setStock({commit, state}, info) {
          commit('updateStock', info);
      }
  }
})
