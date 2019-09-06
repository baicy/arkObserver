<template>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-btn color="error" @click="resetCharactersData()">重置练度</v-btn>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card tile>
                        <v-card-text>
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
                                <v-chip small label v-for="(title, key) in professions" :key="key"
                                    @click="selectedProfession=key;"
                                >
                                    {{ title }}
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
                <v-col cols="12" md="4" v-if="selectedCharacter">
                    <v-card tile min-height="360px">
                        <v-card-title>{{selectedCharacter.name}}</v-card-title>
                        <v-card-text>
                            <v-slider
                                v-model="target.phase"
                                min=0 :max="selectedCharacter.rarity>3?2:1"
                                hide-details class="align-center" track-color="green lighten-1"
                                label="精英化"
                                >
                                <template v-slot:append>
                                    <v-text-field
                                        :value="current.phase+'  →'"
                                        class="mt-0 pt-0"
                                        disabled
                                        hide-details
                                        single-line
                                        style="width: 40px"
                                     ></v-text-field>
                                    <v-text-field
                                        v-model="target.phase"
                                        class="mt-0 pt-0"
                                        hide-details
                                        single-line
                                        type="number"
                                        :max="selectedCharacter.rarity>3?2:1"
                                        style="width: 30px"
                                    ></v-text-field>
                                    <v-text-field
                                        :value="'( '+plan.phase+' )'"
                                        class="mt-0 pt-0"
                                        disabled
                                        hide-details
                                        single-line
                                        style="width: 30px"
                                     ></v-text-field>
                                </template>
                            </v-slider>
                            <v-slider
                                v-model="target.skill"
                                min=1 max=7
                                hide-details class="align-center" track-color="green lighten-1"
                                label="技能等级"
                                >
                                <template v-slot:append>
                                    <v-text-field
                                        :value="current.skill+'  →'"
                                        class="mt-0 pt-0"
                                        disabled
                                        hide-details
                                        single-line
                                        style="width: 40px"
                                     ></v-text-field>
                                    <v-text-field
                                        v-model="target.skill"
                                        class="mt-0 pt-0"
                                        hide-details
                                        single-line
                                        type="number"
                                        max=7
                                        style="width: 30px"
                                    ></v-text-field>
                                    <v-text-field
                                        :value="'( '+plan.skill+' )'"
                                        class="mt-0 pt-0"
                                        disabled
                                        hide-details
                                        single-line
                                        style="width: 30px"
                                     ></v-text-field>
                                </template>
                            </v-slider>
                            <v-sheet v-if="selectedCharacter.rarity>3">
                                <v-slider
                                    v-for="(skill,index) in selectedCharacter.skill_names"
                                    :key="'skill_option'+index"
                                    v-model="target['skills'][index]"
                                    min=0 max=3
                                    hide-details class="align-center" track-color="green lighten-1"
                                    :label="skill"
                                    >
                                    <template v-slot:append>
                                        <v-text-field
                                            :value="current['skills'][index]+'  →'"
                                            class="mt-0 pt-0"
                                            disabled
                                            hide-details
                                            single-line
                                            style="width: 40px"
                                         ></v-text-field>
                                        <v-text-field
                                            v-model="target['skills'][index]"
                                            class="mt-0 pt-0"
                                            hide-details
                                            single-line
                                            type="number"
                                            max=3
                                            style="width: 30px"
                                        ></v-text-field>
                                        <v-text-field
                                            :value="'( '+plan['skills'][index]+' )'"
                                            class="mt-0 pt-0"
                                            disabled
                                            hide-details
                                            single-line
                                            style="width: 30px"
                                         ></v-text-field>
                                    </template>
                                </v-slider>
                            </v-sheet>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text @click="updateCharacter()">设置</v-btn>
                            <v-btn text @click="updatePlans()">添加到计划</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4" v-if="selectedCharacter">
                    <v-card tile min-height="360px">
                        <v-card-title>所需材料</v-card-title>
                        <v-card-text>
                            <v-sheet v-for="(need,index) in needs" :key="'needsGroup'+index">
                                <span>{{ need['title']+': ' }}</span>
                                <Item size="small" v-for="(quantity,itemId) in need['items']" :key="'needsGroup'+index+itemId" :item="materials[itemId]" :need-quantity="quantity"></Item>
                            </v-sheet>
                        </v-card-text>
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
                {{snackbarMessage}}
            </v-snackbar>
        </v-container>
</template>

<script>
    import characters from '../data/characters.json'
    import resources from '../data/resources.json'
    import {Professions} from '../data/Statics.js'
    import Item from '../components/ResourceItem.vue';
    export default {
        name: 'CharacterViewer',
        components: { Item },
        data() {
            return {
                snackbar: false,
                snackbarTime: 1500,
                snackbarMessage: '',
                dialog: false,
                charactersData: '',
                selectedRarity: 6,
                selectedProfession: '',
                selectedCharacterKey: '',
                materials: Object.assign({},resources.materials,resources.skill_books,resources.chips),
                professions: Professions,
                characters: characters,
                plans: {},
                needs: {},
                current: {},
                plan: {},
                target: {}
            }
        },
        computed: {
            selectedCharacter: function() {
                if(this.selectedCharacterKey=='')
                    return null;
                return this.characters[this.selectedCharacterKey];
            },
        },
        watch: {
            selectedCharacterKey: function(newChar, oldChar) {
                var c = this.characters[newChar];
                var r = this.$store.getters.getCharacter(c.key);
                if(r){
                    this.current = {
                        phase: r[0],
                        skill: r[1],
                        skills: r[2]
                    };
                    this.plan = {
                        phase: r[3][0],
                        skill: r[3][1],
                        skills: r[3][2]
                    };
                } else {
                    this.current = {
                        phase: 0,
                        skill: 1,
                        skills: [0,0,0],
                    };
                    this.plan = {
                        phase: 0,
                        skill: 1,
                        skills: [0,0,0],
                    };
                };
                this.target = {
                    phase: this.current.phase,
                    skill: this.current.skill,
                    skills: [...this.current.skills]
                };
            },
            current: {
                handler(newValue, oldValue) {
                    this.needs = this.calculateNeeds(this.current,this.target);
                },
                deep: true
            },
            target: {
                handler(newValue, oldValue) {
                    this.needs = this.calculateNeeds(this.current,this.target);
                },
                deep: true
            }
        },
        methods: {
            showCharactersData: function() {
                this.dialog = true;
                this.charactersData = this.$store.getters.getCharacters(1);
            },
            resetCharactersData: function() {
                this.$store.commit('resetCharactersData');
                this.snackbar = true;
                this.snackbarMessage = '重置完成';
            },
            updateStorage: function() {
                var c = {};
                c.key = this.selectedCharacterKey;
                c.value= [
                    this.current.phase,
                    this.current.skill,
                    this.current.skills,
                    [
                        this.plan.phase,
                        this.plan.skill,
                        this.plan.skills
                    ]
                ];
                this.$store.commit('updateCharactersData', c);
                this.calculateNeeds(this.current, this.plan);
                this.$store.commit('updatePlansData', this.plans);
            },
            updateCharacter: function() {
                this.current = {
                    phase: this.target.phase,
                    skill: this.target.skill,
                    skills: [...this.target.skills]
                };
                this.updateStorage();
                this.snackbar = true;
                this.snackbarMessage = '设置完成';
            },
            updatePlans: function() {
                this.plan = {
                    phase: Math.max(this.plan.phase, this.target.phase),
                    skill: Math.max(this.plan.skill, this.target.skill),
                    skills: [
                        Math.max(this.plan.skills[0], this.target.skills[0]),
                        Math.max(this.plan.skills[1], this.target.skills[1]),
                        Math.max(this.plan.skills[2], this.target.skills[2])
                    ]
                };
                this.updateStorage();
                this.target = {
                    phase: this.current.phase,
                    skill: this.current.skill,
                    skills: [...this.current.skills]
                };
                this.snackbar = true;
                this.snackbarMessage = '添加完成';
            },
            calculateNeeds: function(source, destination) {
                var needs = {'total':{title:'总计',items:{}}};
                var plans = {};
                var itemKey = '';
                var itemTitle = '';
                var c = this.selectedCharacter;
                for(var i=source.skill;i<destination.skill;i++)
                {
                    itemKey = c.key+'-skill-all-'+i;
                    itemTitle = '技能等级 '+i+'→'+(parseInt(i)+1);
                    needs[itemKey] = {title:itemTitle,items:c.skills_up[i-1]};
                    for(var j in c.skills_up[i-1])
                    {
                        needs['total']['items'][j] = needs['total']['items'][j]?(needs['total']['items'][j]+c.skills_up[i-1][j]):c.skills_up[i-1][j];
                    }
                    var plan = { charKey:c.key, charName:c.name, item:itemTitle, needs:c.skills_up[i-1] };
                    plans[itemKey] = plan;
                }
                if(c.rarity>3)
                {
                    for(var i=source.phase;i<destination.phase;i++)
                    {
                        itemKey = c.key+'-phase-'+i;
                        itemTitle = '精英化 '+(parseInt(i)+1);
                        needs[itemKey] = {title:itemTitle,items:c.phases_up[i]};
                        for(var j in c.phases_up[i])
                        {
                            needs['total']['items'][j] = needs['total']['items'][j]?(needs['total']['items'][j]+c.phases_up[i][j]):c.phases_up[i][j];
                        }
                        var plan = { charKey:c.key, charName:c.name, item:itemTitle, needs:c.phases_up[i] };
                        plans[itemKey] = plan;
                    }
                    for(var i in destination.skills)
                    {
                        for(var j=source.skills[i];j<destination.skills[i];j++)
                        {
                            itemKey = c.key+'-skill-'+i+'-'+j;
                            itemTitle = c.skill_names[i]+' 专精 '+j+'→'+(parseInt(j)+1);
                            needs[itemKey] = {title:itemTitle,items:c.skill_ups[i][j]};
                            for(var k in c.skill_ups[i][j])
                            {
                                needs['total']['items'][k] = needs['total']['items'][k]?(needs['total']['items'][k]+c.skill_ups[i][j][k]):c.skill_ups[i][j][k];
                            }
                            var plan = { charKey:c.key, charName:c.name, item:itemTitle, needs:c.skill_ups[i][j] };
                            plans[itemKey] = plan;
                        }
                    }
                }
                this.plans[c.key] = plans;
                return needs;
            }
        }
    }
</script>

<style>
</style>
