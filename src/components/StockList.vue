<template>
    <v-card tile class="d-flex flex-column px-6 py-2">
        <div class="d-flex my-n4">
            <!-- <v-btn dark tile class="mr-auto my-auto">消耗一览</v-btn> -->
            <v-checkbox color="black" label="仓库顺序" v-model="storeOrder"></v-checkbox>
        </div>
        <div class="d-flex flex-wrap" v-if="storeOrder">
            <div class="d-flex material-block" v-for="(item,index) in storeOrderMaterials" :key="index" @click="chooseMaterial(item.id)">
                <Item :item="item" is-stock></Item>
            </div>
        </div>
        <div class="d-flex flex-column" v-else>
            <div class="d-flex flex-wrap" v-for="group in ['t5','t4','t3','t2','t1','books','chip3','chip2','chip1','others']">
                <div class="d-flex material-block" v-for="(item,index) in notStoreOrderMaterials[group]" :key="index" @click="chooseMaterial(item.id)">
                    <Item :item="item" is-stock></Item>
                </div>
            </div>
        </div>
    </v-card>
</template>

<script>
    import StockManager from '../utils/StockManager.js'
    export default {
        name: 'StockList',
        components: { 
            Item: () => import('../components/ResourceItem'),
        },
        data() {
            return {
                storeOrder: true,
                selectedItemId: '4001'
            };
        },
        computed: {
            storeOrderMaterials: () => StockManager.displaySort(),
            notStoreOrderMaterials: () => StockManager.displayCustomize()
        },
        methods: {
            chooseMaterial(id) {
                this.selectedItemId = id;
                this.$store.dispatch('setSelectedItem', { type: 'material', val: id });
            },
        }
    };
</script>

<style>
    .material-block {
        cursor: pointer;
    }
</style>