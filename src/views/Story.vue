<template>
  <div class="story" @click="siege">
    <div v-if="dialog.show" class="dialog">{{dialog.name}}: {{dialog.text}}</div>
  </div>
</template>

<script>
import '@/assets/styles/story.less'
import scriptTxt from '@/assets/story/test.txt'
export default {
  data() {
    return {
      scriptTxt: [],
      scripts: [],
      row: 0,
      dialog: {
        show: false,
        name: '',
        text: ''
      }
    }
  },
  mounted() {
    this.scriptTxt = scriptTxt.split('\n');
    // console.log(this.scriptTxt);
    this.scripts = [
      "this.printDialog('aaa', 'hello')",
      "this.printDialog('bbb', 'hello,too')"
    ];
    this.clear();
  },
  methods: {
    printDialog(name, text) {
      this.dialog.show = true;
      this.dialog.name = name;
      this.dialog.text = text;
    },
    clear() {
      this.dialog.show = false;
    },
    siege(e) {
      // console.log(e);
      eval(this.scripts[this.row]);
      this.row++;
    }
  }
}
</script>

<style>

</style>