<template>
    <v-container fluid class="px-0 py-0">
        <v-card tile class="d-flex flex-column align-end fill-height">
            <FilterBar ref="filterbar" @toggle="setFilters"></FilterBar>
            <v-divider></v-divider>
            <v-sheet class="d-flex flex-wrap align-content-start px-2 py-2" style="overflow-y:auto;">
                <v-btn small tile
                    :outlined="key!=selectedCharacterKey"
                    :dark="key==selectedCharacterKey"
                    v-for="key in filterCharacters" :key="key"
                    class="d-flex mr-1 mb-1"
                    @click="chooseCharacter(key)"
                    >
                    {{characters[key].name}}
                </v-btn>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        name: 'CharacterViewer',
        components: {
            FilterBar: () => import('../components/ArkFilter')
        },
        data() {
            return {
                characters: {},
                filterRarities: [],
                filterProfessions: [],
                filterCharacters: [],
                selectedCharacterKey: ''
            }
        },
        watch: {
            filterRarities: {
                handler(newValue, oldValue) {
                    this.setfilterCharacters();
                }
            },
            filterProfessions: {
                handler(newValue, oldValue) {
                    this.setfilterCharacters();
                }
            }
        },
        methods: {
            setFilters(rarities, professions) {
                this.filterRarities = rarities;
                this.filterProfessions = professions;
            },
            setfilterCharacters() {
                let characters = this.characters;
                this.filterCharacters = Object.keys(this.characters).sort(function(a,b) {
                        return characters[b].rarity-characters[a].rarity;
                    }).filter((el) =>
                        !this.filterRarities.length || this.filterRarities.includes(characters[el].rarity)
                    ).filter((el) =>
                        !this.filterProfessions.length || this.filterProfessions.includes(characters[el].profession)
                    );
            },
            chooseCharacter(key) {
                this.selectedCharacterKey = key;
                this.$store.dispatch('setSelectedItem', { type: 'character', val: key });
            },
            async loadResources () {
                let characters = await import('../data/characters.json');
                this.characters = characters.default;
                this.setfilterCharacters();
            }
        },
        mounted() {
            this.loadResources();
            this.chooseCharacter('');
        }
    };
</script>

<style>
</style>
