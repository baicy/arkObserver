import persons from '../data/characters.json'
import store from '../store.js'

let CharacterManager = {};

CharacterManager.init = () => {
    var characters = store.getters.getCharacters();
    if(Object.keys(characters).length) return;
    for(var i in persons)
    {
        var o = {};
        o[i] = [
            0, 1, [0, 0, 0], [0, 1, [0, 0, 0]]
        ];
        Object.assign(characters, o);
    }
    store.commit('updateCharacters', characters);
};
export default CharacterManager