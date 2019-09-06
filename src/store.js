import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [
        createPersistedState({
            key: "ark-observer-abc",
            paths: [
                "plans",
                "characters",
                "resources",
                "formulateds"
            ]
        })
    ],
    state: {
        data: {},
        plans: {},
        characters: {},
        resources: {},
        formulateds: {}
    },
    mutations: {
        updateCharacter: (state, c) => {
            state.characters[c.key] = c.status;
        },
        updateCharactersData: (state, payload) => {
            state.characters[payload.key] = payload.value;
        },
        resetCharactersData: (state) => {
            state.characters = {};
            state.plans = {};
        },
        resetPlansData: (state) => {
            state.plans = {};
        },
        updateStock: (state, payload) => {
            state.resources[payload.key] = payload.amount;
        },
        updateStocks: (state, payload) => {
            state.resources = payload;
        },
        updatePlansData: (state, payload) => {
            for(var i in payload){
                state.plans[i] = payload[i];
            }
        },
        updateFormulated: (state, payload) => {
            Vue.set(state.formulateds, payload.key, payload.value);
        },
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
            return state.resources;
        },
        getStock: (state) => (key) => {
            if(state.resources[key])
                return state.resources[key];
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
        }
  },
  actions: {
    // async saveCharacters() {
    //     // await;
    // }
  }
})
