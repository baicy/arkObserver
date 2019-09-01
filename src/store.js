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
        }
    },
    getters: {
        getCharacters: (state) => (refresh) => {
            return JSON.stringify(state.characters);
        },
        getCharacter: (state) => (key) => {
            return state.characters[key];
        }
  },
  actions: {
    // async saveCharacters() {
    //     // await;
    // }
  }
})
