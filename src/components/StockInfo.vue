<template>
    <div class="d-flex flex-column" v-if="selectedId">
        <div class="d-flex my-2">
            <Icon :item="selectedItem"></Icon>
            <span class="display-3">{{selectedItem.name}}</span>
        </div>
        <v-divider></v-divider>
        <div class="d-flex ml-4">
            <div class="d-flex">
                <v-text-field
                    v-model="stock.have"
                    type="number"
                    min=0
                    >
                    <template v-slot:prepend>
                        <div class="headline" style="width:50px;line-height:30px;">库存</div>
                    </template>
                </v-text-field>
            </div>
            <div class="d-flex ml-8">
                <span class="headline" style="line-height:70px;">
                    当前规划需求：{{stock.formulatedNeed}}
                    ({{stock.formulatedNeed-stock.need}})
                </span>
            </div>
        </div>
        <v-divider></v-divider>
        <div class="flex">
            <v-subheader class="headline black--text">掉落</v-subheader>
            <div class="ml-4 subtitle-1">
                <div v-for="(text,stage) in selectedItem.drops">
                    {{stage}} : {{text}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import resources from '../data/resources.json'
    export default {
        name: 'StockInfo',
        components: { 
            Icon: () => import('../components/ResourceIcon'),
        },
        data() {
            return {
                selectedItemId: '',
                materials: Object.assign({}, resources.materials, resources.chips, resources.skill_books, resources.others)

            }
        },
        computed: {
            selectedId() {
                return this.$store.getters.selectedItem('material');
            },
            selectedItem() {
                return this.materials[this.selectedId];
            },
            stock() {
                return this.$store.getters.getStock(this.selectedId);
            }
        },
        watch: {
            'stock.have': {
                handler(newVal, oldVal) {
                    let have = newVal<0?0:newVal;
                    this.$store.dispatch('setStock', {id: this.selectedId, amount: have});
                }
            }
        }
    };
</script>