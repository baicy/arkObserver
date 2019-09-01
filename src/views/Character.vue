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
                        <v-chip-group column>
                            <v-chip
                                small
                                label
                                v-for="(character, index) in characters"
                                :key="index"
                                v-if="character.profession==selectedProfession && character.rarity==selectedRarity-1"
                                @click="selectedCharacterId=index"
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
                            :key="index"
                            v-model="selectedCharacter['plan'][option['key']]"
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
                                    v-model="selectedCharacter['plan'][option['key']]"
                                    class="mt-0 pt-0"
                                    hide-details
                                    single-line
                                    type="number"
                                    :max="option.max"
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
                <v-card-title
                  class="headline grey lighten-2"
                  primary-title
                >
                  干员数据
                </v-card-title>
        
                <v-card-text>
                    {{ charactersData }}
                </v-card-text>
        
                <v-divider></v-divider>
        
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
    
    </v-container>
</template>

<script>
    import characters from '../data/characters.json'
    export default {
        data() {
            return {
                dialog: false,
                charactersData: '',
                selectedRarity: 6,
                selectedProfession: '',
                selectedCharacterId: 0,
                professions: [
                    { key: 'SNIPER', title: '狙击' },
                    { key: 'CASTER', title: '术士' },
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
                var c = this.characters[this.selectedCharacterId];
                var d = localStorage.getItem('ark_vue_demo');
                if(d)
                {
                    d = JSON.parse(d).characters[c.name];
                }
                if(d) {
                    c.elite = d.elite;
                    c.level = d.level;
                    c.skill = d.skill;
                    c.skill1 = d.skill1;
                    if(d.skill2)
                        c.skill2 = d.skill2;
                    if(d.skill3)
                        c.skill3 = d.skill3;
                } else {
                    c.elite = 0;
                    c.level = 1;
                    c.skill = 1;
                    if(c.rarity>2)
                    {
                        c.skill1 = 7;
                        c.skill2 = 7;
                    }
                    if(c.rarity>4)
                        c.skill3 = 7;
                }
                c.plan = {
                    elite: c.elite,
                    skill: c.skill,
                };
                if(c.rarity>2){} {
                    c.plan.skill1 = 7;
                    c.plan.skill2 = 7;
                }
                if(c.rarity>4)
                    c.plan.skill3 = 7;
                return c;
            },
            options: function() {
                var c = this.selectedCharacter;
                var o = [
                    {key:'elite',title:'精英化',min:0,max:c.meta.max_elite_rank},
                    {key:'skill',title:'技能等级',min:1,max:7},
                ];
                if(this.selectedCharacter.rarity>2)
                {
                    var skills = this.selectedCharacter.skill_names;
                    o.push({key:'skill1',title:skills[0],min:7,max:10});
                    o.push({key:'skill2',title:skills[1],min:7,max:10});
                    if(skills.length>2)
                        o.push({key:'skill3',title:skills[2],min:7,max:10});
                }
                return o; 
            }
        },
        methods: {
            showCharactersData: function() {
                this.dialog = true;
                var storageData = localStorage.getItem('ark_vue_demo');
                if(storageData)
                {
                    storageData = JSON.parse(storageData);
                    this.charactersData = JSON.stringify(storageData.characters);
                } else {
                    this.charactersData = '{}';
                }
            },
            updateCharacter: function() {
                var storageData = {characters:{}, plans:[]};
                if(localStorage.getItem('ark_vue_demo'))
                {
                    storageData = JSON.parse(localStorage.getItem('ark_vue_demo'));
                }
                var c = {};
                c.name = this.selectedCharacter.name;
                c.elite = this.selectedCharacter.plan.elite;
                c.skill = this.selectedCharacter.plan.skill;
                c.skill1 = this.selectedCharacter.plan.skill1;
                c.skill2 = this.selectedCharacter.plan.skill2;
                if(this.selectedCharacter.plan.skill3)
                    c.skill3 = this.selectedCharacter.plan.skill3;
                storageData.characters[c.name] = c;
                localStorage.setItem('ark_vue_demo', JSON.stringify(storageData));
            }
        }
        // beforeMount() {
            // this.selectedCharacter=this.characters[0];
        // }
    }
</script>

<style>
</style>
