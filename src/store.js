import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        data: {},
        plans: [],
        characters: {}
    },
    mutations: {
        updateCharactersData: (state, c) => {
            state.characters[c.name] = c;
            localStorage.setItem('')
        },
        getCharacterData: (state, name) => {
            return state.characters[name];
        }
    },
    getters: {
        getExportData: state => {
            console.log('characters: ');
            console.log(state.characters);
            console.log('plans: ');
            console.log(state.plans);
            return true;
        },
        getCharactersData: state => {
            // state.characters = 
            return JSON.stringify(state.characters);
        },
  },
  actions: {
    // async saveCharacters() {
    //     // await;
    // }
  }
})
