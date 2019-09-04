<template>
    <v-badge
        color="black"
        bottom
        overlap
        >
        <template v-slot:badge>
            {{ displayQuantity }}
        </template>
        <div @click="plusItem(item.id)" @click.right.prevent="minusItem(item.id)">
            <Icon :item="item" :size="size"></Icon>
        </div>
    </v-badge>
</template>

<script>
    import Icon from '../components/ResourceIcon.vue'
    export default {
        name: "ResourceItem",
        components: {
            Icon
        },
        props: {
            item: {
                type: Object,
                required: true
            },
            isStock: {
                type: Boolean,
                default () {
                    return false
                }
            },
            needQuantity: {
                type: Number,
                default () {
                    return 1
                }
            },
            size: {
                type: String,
                default () {
                    return 'normal'
                }
            }
        },
        data() {
            return {
                quantity : this.isStock?this.$store.getters.getStock(this.item.id):this.needQuantity
            }
        },
        computed: {
            displayQuantity: function() {
                if(this.isStock)
                    return this.quantity;
                else
                     return this.needQuantity;
            }
        },
        methods: {
            plusItem(id) {
                if(this.isStock)
                {
                    this.quantity = this.quantity<0? 0:++this.quantity;
                    this.$store.commit('updateStock', {key:id, amount: this.quantity});
                }
            },
            minusItem(id) {
                if(this.isStock && this.quantity>0){
                    this.quantity--;
                    this.$store.commit('updateStock', {key:id, amount: this.quantity});
                }
                
            }
        }
    };
</script>

<style>
    .v-badge--overlap .v-badge__badge {
        bottom: 5px !important;
        right: 2px;
        border-radius: 0;
        -moz-border-radius: 0;
        -webkit-border-radius: 0;
    }
</style>
