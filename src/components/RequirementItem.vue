<template>
    <v-card class="mt-0 mb-2 d-flex flex-row mr-4 px-0 py-0" tile outlined height="110px">
        <div class="d-flex flex-column" style="width:80px">
            <div class="d-flex pt-1">
                <Icon :item="this.item" size="small" class="mx-auto"></Icon>
            </div>
            <div class="d-flex">
                <span class="mx-auto caption mb-n1">{{item.name}}</span>
            </div>
            <div class="d-flex flex-column">
                <div class="d-flex" v-if="info.shortage>0">
                    <span class="mx-auto body-2" v-if="formulated">合成<span class="subtitle-2 ml-2">{{info.shortage}}</span></span>
                    <span class="mx-auto body-2" v-else>缺少<span class="subtitle-2 ml-2">{{info.shortage}}</span></span>
                </div>
                <div class="d-flex" v-if="info.ableFormulated && info.shortage>0">
                    <v-checkbox
                        v-model="formulated"
                        class="mx-auto mt-n2"
                        >
                        <template v-slot:label>
                            <span class="body-2 ml-n2">分解</span>
                        </template>
                    </v-checkbox>
                </div>
            </div>
        </div>
        <v-divider vertical></v-divider>
        <div class="d-flex flex-column" style="width:100px">
            <div class="d-flex">
                <span class="ml-2 body-2">需求<span class="subtitle-2 ml-2">{{info.require}}</span></span>
            </div>
            <div class="d-flex">
                <v-text-field
                    v-model="stock"
                    type="number"
                    min=0
                    hide-details
                    class="mt-n2 mb-0 mr-2"
                    >
                    <template v-slot:prepend>
                        <div class="ml-2 body-2" style="width:30px;line-height: 30px;">库存</div>
                    </template>
                </v-text-field>
            </div>
            <div class="d-flex" v-if="info.ableFormulated&&info.ableMerge">
                <v-btn color="black" tile dark small class="ml-10 mt-2" @click="mergeMaterial">合成</v-btn>
            </div>
        </div>
    </v-card>
</template>

<script>
    import Icon from '../components/ResourceIcon.vue'
    export default {
        name: "RequirementCard",
        components: {
            Icon
        },
        props: {
            item: {
                type: Object,
                required: true
            },
            info: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                stock: this.info.stock,
                formulated: this.info.formulated
            }
        },
        computed: {
        },
        watch: {
            stock(newVal, oldVal) {
                this.stock = this.stock<0?0:this.stock;
                this.$store.commit('updateStock', {id: this.info.id, amount: this.stock});
            },
            formulated(newVal, oldVal) {
                this.$store.commit('updateFormulated', {key: this.info.id, value: this.formulated});
            },
            'info.stock': {
                handler(newVal, oldVal) {
                    this.stock = newVal;
                }
            }
        },
        methods: {
            mergeMaterial() {
                const FORMULA = this.info.formula;
                let s = 0;
                for(let i in FORMULA)
                {
                    s = this.$store.getters.getStock(i).have;
                    s -= FORMULA[i];
                    s = s<0?0:s;
                    this.$store.commit('updateStock', {id: i, amount: s});
                }
                s = this.$store.getters.getStock(this.info.id).have;
                s++;
                this.stock = s;
                this.$store.commit('updateStock', {id: this.info.id, amount: s});
            }
        }
    };
</script>

<style>
</style>
