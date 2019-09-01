<template>
    <v-container>
        <v-row>
            <v-col cols="7">
                <v-card>
                    <v-card-text>
                        <Item :item="item" v-for="(item,index) in materials" :key="index" />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="5">
                <v-card>
                    <v-card-text>
                        <Item :item="item" v-for="(item,index) in others" :key="index" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { PURCHASE_CREDIT, MATERIALS, SKILL_BOOKS, CHIPS } from '../data/Resources.js';
    import Item from '../components/ResourceItem.vue';
    export default {
        name: 'StockViewer',
        components: { Item },
        data(){
            return {
                materials: MATERIALS,
                others: [...SKILL_BOOKS,PURCHASE_CREDIT,...CHIPS]
            };
        }
    };
</script>

<style>
</style>
