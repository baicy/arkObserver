<template>
    <v-data-table
        :headers="headers"
        :items="heroes"
        :sort-by="['name']"
        hide-default-footer
        class="elevation-1"
    ></v-data-table>
</template>

<script>
export default {
    name: "PlanList",
    data () {
        return {
            result:'',
            sortBy: 'name',
            headers:[
                { text: '', value: 'option' },
                { text: '干员', value: 'name' },
                { text: '星级', value: 'star' },
                { text: '升级项目', value: 'item' },
            ],
            heroes:[
                { name: '星熊', star: 6, item: '精英化 1->2' },
                { name: '安洁莉娜', star: 6, item: '精英化 1->2' },
                { name: '塞雷娅', star: 6, item: '技能 5->6' },
                { name: '塞雷娅', star: 6, item: '技能 6->7' },
                { name: '蓝毒', star: 5, item: '技能 5->6' },
            ],
        }
    },
};
</script>
