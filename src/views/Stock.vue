<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="7">
                <v-card>
                    <v-card-text>
                        <Item :item="item" is-stock v-for="(item,index) in materials" :key="'stock'+index" />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="5">
                <v-card>
                    <v-card-text>
                        <Item :item="item" is-stock v-for="(item,index) in others" :key="'stock'+index"></Item>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import resources from '../data/resources.json';
    import Item from '../components/ResourceItem.vue';
    export default {
        name: 'StockViewer',
        components: { Item },
        data(){
            return {
                materials: resources.materials,
                others: Object.assign({},resources.skill_books,resources.chips)
            };
        },
        mounted() {
            this.$loading.hide();
        }
    };
</script>

<style>
</style>
