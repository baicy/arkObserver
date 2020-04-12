<template>
<div>
  <div :class="'rarity-'+item.rarity">
    <span>{{item.name}}</span>
    <span v-if="showNumber && number">
      &nbsp;x{{number}}
      <span v-if="store!==false">({{store}})</span>
    </span>
  </div>
</div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    number: {
      type: Number,
      default: 0
    },
    store: {
      type: [Boolean, Number],
      default: false
    },
    showNumber: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="less" scoped>
.rarity-0 {
  color: #a0a0a0;
}
.rarity-1 {
  color: #d9e53b;
}
.rarity-2 {
  color: #01b2f8;
}
.rarity-3 {
  color: #b494b6;
}
.rarity-4 {
  color: #fdc904;
}
</style>