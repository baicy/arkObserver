<template>
    <v-data-table
        :headers="headers"
        :items="plans"
        class="elevation-1"
        fixed-header
        :items-per-page="-1"
        hide-default-footer
        show-expand
        :expanded.sync="expanded"
        item-key="key"
        calculate-widths
        >
        <template v-slot:item.option="{item}">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn text icon color="green lighten-1" v-on="on" :disabled="!(item.completed&&item.onstage)" @click="completePlan(item)">
                        <v-icon v-if="item.completed && !item.onstage">mdi-check-circle-outline</v-icon>
                        <v-icon v-else="item.onstage">mdi-check</v-icon>
                    </v-btn>
                </template>
                <span>完成</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn text icon color="red lighten-1" v-on="on" @click="removePlan(item)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
                <span>移除</span>
            </v-tooltip>
        </template>
        <template v-slot:header.option="{ header }">
            <v-btn text tile small outlined class="mr-1 mb-1" color="primary" router-link to="/character">添加</v-btn>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn
                        text tile small outlined class="mr-1 mb-1" color="green lighten-1"
                        v-on="on"
                        >
                        预设
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        v-for="(item, index) in preItems"
                        :key="index"
                        @click="addPrePlans(index)"
                        >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn text tile small outlined class="mb-1" color="red lighten-1" @click="resetPlans">清空</v-btn>
        </template>
        <template v-slot:expanded-item="{ item }">
            <td :colspan="headers.length+1">
                <Item size="xsmall" v-for="(quantity,itemId) in item.needs" :key="itemId" :item="materials[itemId]" :need-quantity="quantity"></Item>
            </td>
        </template>
    </v-data-table>
</template>

<script>
    import Item from '../components/ResourceItem.vue'
    import resources from '../data/resources.json'
    import PlanManager from '../utils/PlanManager.js'
    export default {
        name: "PlanList",
        components: {
            Item,
        },
        data () {
            return {
                result:'',
                plans_array: [],
                headers:[
                    { text: '干员', value: 'charName' },
                    { text: '项目', value: 'item' },
                    { text: '', value: 'option', sortable: false },
                ],
                expanded: [],
                preItems: {
                    '6-phase-2':'6星精2',
                    '6-skill-7':'6星技能7'
                },
                materials: {},
            }
        },
        computed: {
            plans() {
                return PlanManager.display();
            }
        },
        methods: {
            completePlan: (item) => {
                PlanManager.complete(item);
            },
            removePlan: (item) => {
                PlanManager.remove(item);
            },
            addPrePlans: (item) => {
                PlanManager.addPre(item);
            },
            resetPlans: (item) => {
                PlanManager.reset();
            }
        },
        mounted() {
            this.materials = Object.assign({}, resources.materials, resources.chips, resources.skill_books, resources.others);
            // this.$loading.hide();
        }
    };
</script>