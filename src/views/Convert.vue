<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <v-row>
                    <v-col cols="12">
                        <v-btn tile outlined @click="convertCharacters">characters</v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea outlined v-model="characters_json"></v-textarea>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6">
                <v-row>
                    <v-col cols="12">
                        <v-btn tile outlined @click="convertResources">resources</v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea outlined v-model="resources_json"></v-textarea>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import characters from '../data/character_table.json'
    import skills from '../data/skill_table.json'
    import resources from '../data/item_table.json'
    import stages from '../data/stage_table.json'
    import buildings from '../data/building_data.json'
    import Converter from '../utils/ConvertGameData.js'
    export default {
        data() {
            return {
                characters_json: '',
                resources_json: ''
            }
        },
        methods: {
            convertCharacters() {
                this.characters_json = JSON.stringify(Converter.gameData.toCharacters(characters, skills));
            },
            convertResources() {
                this.resources_json = JSON.stringify(Converter.gameData.toResources(resources, stages, buildings));
            }
        }
    }
</script>

<style>
</style>
