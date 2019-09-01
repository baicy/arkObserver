<template>
    <v-container>
        <v-row>
            <v-col cols="4">
                <v-card
                    max-width="300"
                    class="mx-auto"
                    tile
                >
                    <v-card-text>
                        <v-btn text @click.stop="showCharactersData()">导出</v-btn>
                        <v-chip-group
                            column
                            mandatory
                            active-class="black white--text"
                        >
                            <v-chip small label v-for="rarity in [6,5,4,3]" :key="rarity"
                                @click="selectedRarity=rarity"
                            >
                                {{ rarity }}<v-icon small>mdi-star</v-icon>
                            </v-chip>
                        </v-chip-group>
                        <v-chip-group
                            column
                            active-class="black white--text"
                        >
                            <v-chip small label v-for="profession in professions" :key="profession.key"
                                @click="selectedProfession=profession.key;"
                            >
                                {{ profession.title }}
                            </v-chip>
                        </v-chip-group>
                        <v-divider></v-divider>
                        <v-chip-group column active-class="black white--text">
                            <v-chip
                                small
                                label
                                v-for="(character, key) in characters"
                                :key="key"
                                v-if="character.profession==selectedProfession && character.rarity==selectedRarity"
                                @click="selectedCharacterKey=key"
                            >
                                {{ character.name }}
                            </v-chip>
                        </v-chip-group>
                    </v-card-text>
                  </v-card>
            </v-col>
            <v-col cols="4">
                <v-card tile v-if="selectedCharacter">
                    <v-card-title>{{selectedCharacter.name}}</v-card-title>
                    <v-card-text>
                        <v-slider
                            v-for="(option,index) in options"
                            :key="'public-option-'+index"
                            v-model="selectedCharacter['target'][option['key']]"
                            :min="option.min"
                            :max="option.max"
                            hide-details
                            class="align-center"
                            track-color="green lighten-1"
                            :label="option.title"
                            >
                            <template v-slot:append>
                                <v-text-field
                                    :value="selectedCharacter[option['key']]+'  →'"
                                    class="mt-0 pt-0"
                                    disabled
                                    hide-details
                                    single-line
                                    style="width: 40px"
                                 ></v-text-field>
                                <v-text-field
                                    v-model="selectedCharacter['target'][option['key']]"
                                    class="mt-0 pt-0"
                                    hide-details
                                    single-line
                                    type="number"
                                    :max="option.max"
                                    style="width: 40px"
                                ></v-text-field>
                            </template>
                        </v-slider>
                        <v-slider
                            v-if="selectedCharacter.rarity>3"
                            v-for="(skill,index) in selectedCharacter.skill_names"
                            :key="'skill_option'+index"
                            v-model="selectedCharacter['target']['skills'][index]"
                            min=7
                            max=10
                            hide-details
                            class="align-center"
                            track-color="green lighten-1"
                            :label="skill"
                            >
                            <template v-slot:append>
                                <v-text-field
                                    :value="selectedCharacter['skills'][index]+'  →'"
                                    class="mt-0 pt-0"
                                    disabled
                                    hide-details
                                    single-line
                                    style="width: 40px"
                                 ></v-text-field>
                                <v-text-field
                                    v-model="selectedCharacter['target']['skills'][index]"
                                    class="mt-0 pt-0"
                                    hide-details
                                    single-line
                                    type="number"
                                    max=10
                                    style="width: 40px"
                                ></v-text-field>
                            </template>
                        </v-slider>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text @click="updateCharacter()">设置</v-btn>
                        <v-btn text>添加</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <div class="text-center">
            <v-dialog v-model="dialog" width="500">
                <v-card>
                    <v-card-title>干员养成数据</v-card-title>
                    <v-card-text>
                        <v-textarea solo v-model="charactersData"></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <div class="flex-grow-1"></div>
                            <v-btn
                                color="primary"
                                text
                                @click="dialog = false"
                            >
                            关闭
                            </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <v-snackbar :timeout="snackbarTime" v-model="snackbar">
            设置完成
        </v-snackbar>
    </v-container>
</template>

<script>
    import characters from '../data/characters.json'
    export default {
        data() {
            return {
                snackbar: false,
                snackbarTime: 1500,
                dialog: false,
                charactersData: '',
                selectedRarity: 6,
                selectedProfession: '',
                selectedCharacterKey: '',
                professions: [
                    { key: 'SNIPER', title: '狙击' },
                    { key: 'CASTER', title: '术师' },
                    { key: 'MEDIC', title: '医疗' },
                    { key: 'TANK', title: '重装' },
                    { key: 'PIONEER', title: '先锋' },
                    { key: 'SUPPORT', title: '辅助' },
                    { key: 'WARRIOR', title: '近卫' },
                    { key: 'SPECIAL', title: '特种' },
                ],
                characters: characters
            }
        },
        computed: {
            selectedCharacter: function() {
                if(this.selectedCharacterKey=='')
                    return null;
                var c = this.characters[this.selectedCharacterKey];
                var r = this.$store.getters.getCharacter(c.key);
                if(r){
                    c.phase = r[0];
                    c.skill = r[1];
                    c.skills = r[2]?r[2]:undefined;
                } else {
                    c.phase = 0;
                    c.skill = 1;
                    c.skills = c.rarity>3?[7,7]:undefined;
                    if(c.rarity>5)
                        c.skills[2]=7;
                }
                c.target = {
                    phase: c.phase,
                    skill: c.skill,
                    skills: c.rarity>3?[...c.skills]:undefined
                };
                return c;
            },
            options: function() {
                var c = this.selectedCharacter;
                var o = [
                    {key:'phase',title:'精英化',min:0,max:(c.rarity>3?2:1)},
                    {key:'skill',title:'技能等级',min:1,max:7},
                ];
                return o; 
            }
        },
        methods: {
            showCharactersData: function() {
                this.dialog = true;
                this.charactersData = this.$store.getters.getCharacters(1);
            },
            updateCharacter: function() {
                var c = {};
                var sc = this.selectedCharacter;
                c.key = sc.key;
                c.value= [
                    sc.target.phase,
                    sc.target.skill,
                    sc.target.skills?sc.target.skills:undefined
                ];
                this.$store.commit('updateCharactersData', c);
                this.snackbar = true;
            }
        }
    }
</script>

<style>
</style>
