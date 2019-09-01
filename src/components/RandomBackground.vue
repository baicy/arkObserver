<template>
    <div
        ref="background"
        class="random-background"
    />
</template>

<script>
    export default {
        name: "RandomBackground",
        data: {}
    }
</script>

<style>
    .random-background {
        position: fixed;
        bottom: 0;
        height: 50vh;
        width: 100vw;
        background-color: coral;
        z-index: 0;
    }
</style>
