const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
let dataCompresser = {
  charLastPositions: {},
  charLastPosition(str, char) {//字符出现在字符串的最后位置
    if(!this.charLastPositions[str]) {
      this.charLastPositions[str] = {};
      for(let i=0;i<str.length;i++) {
        this.charLastPositions[str][str.charAt(i)] = i;
      }
    }
    return this.charLastPositions[str][char];
  },
  decompressFromBase64(str) {
    if(str==null) {
      return '';
    }
    if(str=='') {
      return null;
    }
    return this._decompress(str.length, 32, (n) => this.charLastPosition(base64Chars, str.charAt(n)));
  },
  _decompress(str, n, dict) {
    let a=0, u=Math.pow(2, 2),c=1;
    let l;
    let f = [0, 1, 2];
    let y = {
      val: dict(0),//26
      position: n,
      index: 1
    };
    console.log(dict(0));
    while(c!=u) {
      l = y.val & y.position;
      y.position>>=1;
      if(y.position==0) {
        y.position = n;
        y.val = dict(y.index++);
        a |= (l>0?1:0)*c;
        c<<=1;
      }
    }
    console.log(a);
  }
};
export default dataCompresser;