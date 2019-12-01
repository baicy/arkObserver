<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-img src='https://tesseract.projectnaptha.com/img/eng_bw.png'></v-img>
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
        mounted() {
            const { TesseractWorker } = Tesseract;
            const worker = new TesseractWorker();

            worker
              .recognize('https://tesseract.projectnaptha.com/img/eng_bw.png')
              .progress((p) => {
                console.log('progress', p);
              })
              .then(({ text }) => {
                console.log(text);
                this.info = text;
                worker.terminate();
              });
        }
    };
</script>