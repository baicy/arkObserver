<template>
    <v-badge
        color="black"
        bottom
        overlap
        >
        <template v-slot:badge>
            {{ displayQuantity }}
        </template>
        <div :class="'item-grid'+scale" @click="plusItem(item.id)" @click.right.prevent="minusItem(item.id)">
            <div class="item-block">
                <img class="item-bg" :src="require('../assets/icons/T'+(item.rarity+1)+'back.png')">
                <img class="item-ico" :src="require('../assets/icons/'+item.iconId+'.png')" :alt="item.name"> 
            </div>
        </div>
    </v-badge>
</template>

<script>
    export default {
        name: "ResourceItem",
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
                quantity : this.isStock?this.$store.getters.getStock(this.item.id):this.needQuantity,
                scale: ''
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
                    this.quantity++;
                    this.$store.commit('updateStock', {key:id, amount: this.quantity});
                }
            },
            minusItem(id) {
                if(this.isStock && this.quantity>0){
                    this.quantity--;
                    this.$store.commit('updateStock', {key:id, amount: this.quantity});
                }
                
            }
        },
        mounted() {
            switch (this.size){
                case 'small':
                    this.scale = '-small';
                    break;
                default:
                    break;
            }
        }
    };
</script>

<style>
    .item-grid {
        width: 80px;
        height: 68px;
        display: inline-grid;
    }
    .item-grid .item-block {
        display: flex;
        justify-content: space-around;
        align-items: center;
        transform: scale(0.4);
        position: relative;
    }
    .item-bg {
        position: absolute;
    }
    .item-ico {
        position: absolute;
    }
    .item-grid-small {
        width: 60px;
        height: 48px;
        display: inline-grid;
    }
    .item-grid-small .item-block {
        display: flex;
        justify-content: space-around;
        align-items: center;
        transform: scale(0.3);
        position: relative;
    }
    .v-badge--overlap .v-badge__badge {
        bottom: 5px !important;
        right: 2px;
        border-radius: 0;
        -moz-border-radius: 0;
        -webkit-border-radius: 0;
    }
</style>
