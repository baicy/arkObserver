<template>
    <v-overlay :value="show" opacity=1 z-index=3 class="ark-observer-loading">
        <v-progress-circular indeterminate size="128" color="grey lighten-1" width="5">
        </v-progress-circular>
    </v-overlay>
</template>

<script>
    export default {
        props: {
            show: {
                Type: Boolean,
                default: true
            }
        }
    };
</script>
<style>
.ark-observer-loading .v-overlay__scrim {
    background: white !important;
}
</style>