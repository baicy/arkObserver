<template>
    <div :class="'item-grid'+scale">
        <div class="item-block">
            <img class="item-bg" :src="require('../assets/icons/T'+(item.rarity+1)+'back.png')">
            <img class="item-ico" :src="require('../assets/icons/'+item.iconId+'.png')" :alt="item.name"> 
        </div>
    </div>
</template>

<script>
    export default {
        name: "ResourceIcon",
        props: {
            item: {
                type: Object,
                required: true
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
                scale: ''
            }
        },
        mounted() {
            this.scale = this.size=='normal'?'':('-'+this.size);
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
    .item-grid-xsmall {
        width: 50px;
        height: 40px;
        display: inline-grid;
    }
    .item-grid-xsmall .item-block {
        display: flex;
        justify-content: space-around;
        align-items: center;
        transform: scale(0.2);
        position: relative;
    }
    .item-grid-large {
        width: 80px;
        height: 80px;
        display: inline-grid;
    }
    .item-grid-large .item-block {
        display: flex;
        justify-content: space-around;
        align-items: center;
        transform: scale(0.5);
        position: relative;
    }
</style>
