<template>
    <v-badge
        color="black"
        bottom
        overlap
        >
        <template v-slot:badge>
            {{ quantity }}
        </template>
        <div class="item-grid" @click="plusItem(item.id)" @click.right.prevent="minusItem(item.id)">
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
            }
        },
        data() {
            return {
                quantity : this.$store.getters.getStock(this.item.id)
            }
        },
        methods: {
            plusItem(id) {
                this.quantity++;
                this.$store.commit('updateStock', {key:id, amount: this.quantity});
            },
            minusItem(id) {
                if(this.quantity>0){
                    this.quantity--;
                    this.$store.commit('updateStock', {key:id, amount: this.quantity});
                }
                
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
    .item-block {
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
    .v-badge--overlap .v-badge__badge {
        bottom: 5px !important;
        right: 2px;
        border-radius: 0;
        -moz-border-radius: 0;
        -webkit-border-radius: 0;
    }
</style>
