<template>
    <div class="d-flex flex-column pt-2" >
        <div v-for="n in ['t5','t4','t3','t2','t1','chip3','chip1','books']" class="d-flex flex-row flex-wrap">
            <RequirementItem
                v-if="m.require>0"
                v-for="(m,index) in requirements[n]"
                :key="n+'-'+index"
                :item="materials[m.id]"
                :info="m"
                ></RequirementItem>
        </div>
    </div>
</template>
<script>
    import resources from '../data/resources.json'
    import RequirementItem from '../components/RequirementItem.vue'
    import StockManager from '../utils/StockManager.js'
    export default {
        name: "PlanGround",
        components: {
            RequirementItem,
        },
        data () {
            return {
                materials: {}
            }
        },
        computed: {
            requirements() {
                return StockManager.getRequirements();
            }
        },
        created() {
            this.materials = Object.assign({}, resources.materials, resources.chips, resources.skill_books, resources.others);
        }
    };
</script>