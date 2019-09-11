<template>
    <div class="d-flex flex-column my-1 ml-2">
        <div class="d-flex">
            <div class="d-flex mr-3">
                <v-btn tile outlined small @click="resetRarity">重置</v-btn>
            </div>
            <div class="d-flex">
                <v-btn tile small
                    v-for="rarity in [6,5,4,3]" :key="rarity"
                    class="px-2 mr-1"
                    :outlined = "!selectedRarities.includes(rarity)"
                    :dark = "selectedRarities.includes(rarity)"
                    :color = "selectedRarities.length?'black':'grey'"
                    @click = "toggleRarity(rarity)"
                    >
                    {{rarity}}<v-icon small>mdi-star</v-icon>
                </v-btn>
            </div>
        </div>
        <div class="d-flex mt-2">
            <div class="d-flex mr-3">
                <v-btn tile outlined small @click="resetProfession">重置</v-btn>
            </div>
            <div class="d-flex flex-wrap">
                <v-btn tile outlined small
                    v-for="(title, key) in professions" :key="key"
                    class="px-2 mr-1 mb-1"
                    :outlined = "!selectedProfessions.includes(key)"
                    :dark = "selectedProfessions.includes(key)"
                    :color = "selectedProfessions.length?'black':'grey'"
                    @click = "toggleProfession(key)"
                    >
                    {{title}}
                </v-btn>
            </div>
        </div>
    </div>
</template>
<script>
    import {Professions} from '../data/Statics.js'
    export default {
        name: 'ArkFilter',
        props: {
            toggle: {
                type: Boolean,
                default(){
                    return false;
                }
            }
        },
        data() {
            return {
                professions: Professions,
                selectedRarities: [],
                selectedProfessions: []
            }
        },
        methods: {
            toggleRarity(rarity) {
                if(this.selectedRarities.includes(rarity)) {
                    const index = this.selectedRarities.indexOf(rarity);
                    this.selectedRarities.splice(index, 1);
                } else {
                    this.selectedRarities.push(rarity);
                }
                this.$emit('toggle', this.selectedRarities, this.selectedProfessions);
            },
            resetRarity() {
                this.selectedRarities.splice(0, this.selectedRarities.length);
                this.$emit('toggle', this.selectedRarities, this.selectedProfessions);
            },
            toggleProfession(profession) {
                if(this.selectedProfessions.includes(profession)) {
                    const index = this.selectedProfessions.indexOf(profession);
                    this.selectedProfessions.splice(index, 1);
                } else {
                    this.selectedProfessions.push(profession);
                }
                this.$emit('toggle', this.selectedRarities, this.selectedProfessions);
            },
            resetProfession() {
                this.selectedProfessions.splice(0, this.selectedProfessions.length);
                this.$emit('toggle', this.selectedRarities, this.selectedProfessions);
            }
        }
    };
</script>