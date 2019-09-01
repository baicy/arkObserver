<template>
    <div class="item-grid">
        <div class="item-block">
            <img class="item-bg" :src="require('../assets/rarities/'+item.tier+'.png')">
            <img class="item-ico" :src="require('../assets/materials/'+item.id+'.png')" :alt="item.name">
        </div>
    </div>
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
        data: () => ({
            
        })
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
</style>
