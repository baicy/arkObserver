<template>
    <v-avatar
        :color="color"
        :tile="tile"
        :size="avatarSize"
    >
        <span>VJ</span>
    </v-avatar>
</template>

<script>
    export default {
        data: () => ({
            color: "grey",
            tile: false,
            avatarSize: 50
        }) 
    };
</script>

<style>
</style>
