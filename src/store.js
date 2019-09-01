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
                "resources"
            ]
        })
    ],
    state: {
        data: {},
        plans: [],
        characters: {},
        resources: {}
    },
    mutations: {
        updateCharactersData: (state, payload) => {
            state.characters[payload.key] = payload.value;
        },
        updateStock: (state, payload) => {
            state.resources[payload.key] = payload.amount;
        }
    },
    getters: {
        getCharacters: (state) => (refresh) => {
            return JSON.stringify(state.characters);
        },
        getCharacter: (state) => (key) => {
            return state.characters[key];
        },
        getResources: (state) => (refresh) => {
            return state.resources;
        },
        getStock: (state) => (key) => {
            if(state.resources[key])
                return state.resources[key];
            else
                return 0;
        },
  },
  actions: {
    // async saveCharacters() {
    //     // await;
    // }
  }
})
