<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-img :src="require('../assets/store.png')"></v-img>
            </v-col>
            <v-col cols="12" md="6">
                {{info}}
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
    import Tesseract from 'tesseract.js';

    export default {
        name: 'OCR',
        data() {
            return {
                info: ''
            }
        },
        //'https://tesseract.projectnaptha.com/img/eng_bw.png'
        mounted() {
            // Tesseract.recognize(
            //   require('@/assets/store.png'),
            //   'chi_sim',
            //   { logger: m => console.log(m) }
            // ).then(({ data: { text } }) => {
            //   console.log(text);
            // });
            const { createWorker } = Tesseract;
            (async () => {
              const worker = createWorker();
              await worker.load();
              await worker.loadLanguage('eng');
              await worker.initialize('eng');
              await worker.setParameters({
                tessedit_char_whitelist: '0123456789',
              });
              const { data: { text } } = await worker.recognize(require('@/assets/store.png'));
              console.log(text);
              this.info = text;
            })();
            // Tesseract
            //   .recognize('../assets/store.png')
            //   .then(({ data: { text } }) => {
            //     console.log(text);
            //     this.info = text;
            //   });
        }
    };
</script>