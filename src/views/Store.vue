<template>
  <div style="position:relative">
    <div style="margin:5px 0">{{state.info}}</div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <input type="file" accept="image/*" multiple="multiple" @change="loadImage">
      <el-button v-if="!imgs.length" @click="loadExample">加载示例图片</el-button>
      <div v-else>说明：识别错误时可点击识别框进行过滤</div>
    </div>
    <form id="img-container">
      <div v-if="!imgs.length" style="width:640px;height:320px;text-align:center;display:flex;justify-content:center;align-items:center;">
        没有图像
      </div>
      <div v-else>
        <div v-for="(img, index) in imgs" :key="index">
          <img :src="img.src" width="580" @load="startTrack">
        </div>
      </div>
    </form>
    <div style="display:flex;justify-content:space-between;margin:5px 0;">
      <div style="display:flex">
        <el-button @click="saveMaterial" size="small" :disabled="!recognized.length">导入仓库</el-button>
        <el-button @click="clearMaterial" size="small">清空仓库</el-button>
        <el-button size="small">计算等效理智</el-button>
      </div>
      <div style="display:flex;align-items:center;">
        <input type="checkbox" :checked="state.showName">材料名称
        <input type="checkbox" :checked="state.debugMode">Debug
      </div>
    </div>
    <div v-if="state.showStore" style="marginTop:10px,border:1px black solid,display:flex;justifyContent:center;padding:5px;flexWrap:wrap">
      <div v-for="(material, index) in materials" :key="index" style="margin:10px">
        {{material.name}}({{state.store[index].have?state.store[index].have:0}})
      </div>
    </div>
  </div>
</template>

<script>
import dataCompresser from '../utils/dataCompresser';
export default {
  data() {
    return {
      state: {
        info: '状态',
        imgs: 0,
        debugMode: false,
        showName: true,
        showStore: true,
        debug: null,
        select: null,
        ocr: null,
        store: [],
        clipboard: false
      },
      imgs: [],
      recognized: [],
      materials: [],
      r: {}
    }
  },
  watch: {
    imgs(newVal, oldVal) {
      this.setState({
        imgs: this.imgs.length,
        info: '图片 '+this.imgs.length
      });
    }
  },
  methods: {
    beforeTrack() {
      this.setState({
        info: '开始抓取物品',
        select: null,
        debug: null,
        ocr: null,
        debug_mode: false
      });
    },
    clearContainer() {
      this.imgs = [];
      this.recognized = [];
    },
    setState(state) {
      Object.assign(this.state, state);
    },
    loadFile(e, n) {
      let r = new FileReader;
      r.onloadend = ()=>this.imgs.push({
        src: r.result,
        recognized: false
      });
      r.readAsDataURL(e);
    },
    loadExample() {
      this.clearContainer();
      this.imgs.push('./img/examle.jpg');
      this.setState({
        info: "加载示例图片完成(183kb)"
      });
    },
    loadImage(e) {
      this.setState({
        info: '图像加载中...'
      });
      let images = Array.from(e.target.files).filter(f=>f.type.startsWith('image/'));
      if(!images.length) {
        this.setState({
          info: '未选择文件'
        });
        return;
      }
      this.beforeTrack();
      this.clearContainer();
      images.forEach(image => this.loadFile(image, 'Normal'));
    },
    saveMaterial() {
      console.log('导入仓库');
    },
    clearMaterial() {
      console.log('清空仓库');
    },
    computeOcr() {
      console.log('计算识别');
    },
    test(t) {
      if(this.r[t]) {
        return this.r[t];
      }
      let e = new Int32Array([
        4*-t, 4*-t+4, 4,
        4*t+4, 4*t, 4*t-4,
        -4, 4*-t-4
      ]);
      this.r[t] = e;
      return e;
    },
    decompressFromBase64(compressed) {
      //
    },
    x(data, width, height, func) {
      let a,i,o,c,l;
      let d = this.test(width);
      let u = new Int32Array(data.length >> 2);
      let s = new Int8Array(data.length);
      let f = new Int32Array(data.length);
      let g = -4;
      if(!r) {
        return [];
      }
      for(let i=0;i<height;i++) {
        for(let j=0;j<width;j++) {
          if(!s[g+=4]) {
            for(a=0, l=-1,f[++l]=g, f[++l]=i,f[++l]=j,s[g]=1;l>=0;) {
              //
            }
          }
        }
      }
    },
    chipNumber(data, width, height, materialNo) {
      let a =  new Uint8ClampedArray(width*height);
      let x = 125;
      for(let i=0;i<data.length;i+=4) {
        if(data[i]<140 || data[i+1]<140 || data[i+2]<140) {
          a[i/4] = 255;
        } else {
          let l = (data[i]+data[i+1]+data[i+2]) / 3;
          a[i/4] = l<x ? 255: 0;
        }
      }
      let b = new Uint16Array(width*height);
    },
    hhh() {
      let n = 0, r = 0, a = 0;
      let E = {
        a:{
          1: [
            [],[],[]
          ]
        },
        b:[
          [],[],[]
        ]
      };
      for(let i=0;i<5;i++) {
        for(let j=0;j<11;j++) {}
      }
    },
    startTrack(e) {
      let image = e.target;
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let width = image.width, height=image.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      let numberData = ctx.getImageData(0, 0, width, height);
      numberData = numberData.data;
      let grayData = new Uint8ClampedArray(width*height);
      for(let i=0;i<numberData.length;i+=4) {
        grayData[i/4] = (numberData[i]+numberData[i+1]+numberData[i+2]) / 3;
      }
      this.chipNumber(numberData, width, height, 300);
    },
    printFail(t) {
      //
    },
    connectTextImage() {
      //
    }
  },
  mounted() {
    this.setState({
      clipboard: true
    });
    // this.test('abcdefaabdg', 1);
    // dataCompresser.decompressFromBase64('abccckddjanhj');
  }
}
</script>

<style lang="less" scoped>
#img-container {
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    padding: 5px;
    margin: 4px 0;
    -webkit-transition: background-color .15s linear;
    transition: background-color .15s linear;
}
</style>