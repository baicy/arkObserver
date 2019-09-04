<template>
    <v-card width="280px" height="98px" class="my-0" tile outlined>
        <v-container class="px-0 py-0 fill-height">
            <v-row no-gutter class="mx-0 fill-height">
                <v-col cols="4" class="px-0 py-0 fill-height">
                    <v-card tile outlined class="fill-height">
                        <v-subheader class="pl-1 pr-0 pt-0" style="font-size:10px;height:30px;">{{item.name}}</v-subheader>
                        <Icon :item="this.item" size="small"></Icon>
                    </v-card>
                </v-col>
                <v-col cols="8" class="px-0 py-0">
                    <v-row class="mx-0">
                        <v-col cols="12" class="px-0 py-0 requirement-info">
                            <span class="body-2 ml-2">需求</span>
                            <span class="subtitle-2 ml-2">{{requirement}}</span>
                            <!-- <v-btn color="black" tile dark x-small class="float-right">分解计算</v-btn> -->
                        </v-col>
                        <v-col cols="12" class="px-0 py-0 requirement-info">
                            <span v-if="shortage>0" class="body-2 ml-2">缺少</span>
                            <span v-if="shortage>0" class="subtitle-2 ml-2">{{shortage}}</span>
                            <!-- <v-btn color="black" tile dark x-small class="float-right">合成+1</v-btn> -->
                        </v-col>
                        <v-col cols="12" class="px-0 py-0 requirement-info">
                            <span class="body-2 ml-2">库存</span>
                            <span class="subtitle-2 ml-2">{{stock}}</span>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
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
            requirement: {
                type: Number,
                default () {
                    return 0
                }
            },
            stock: {
                type: Number,
                default () {
                    return 0
                }
            },
            shortage: {
                type: Number,
                default () {
                    return 0
                }
            },
        },
        data() {
            return {}
        }
    }
</script>

<style>
    .item-info-block {
        /* position: absolute;
        width: 100px;
        right: 0;
        text-align: right;
        padding: 5px 10px; */
    }
    .item-info-block .block-title {
    }
    .item-info-block .block-value {
        display: inline-block;
        width: 50px;
        text-align: right;
    }
    .requirement-info {
        height: 32px;
    }
</style>
