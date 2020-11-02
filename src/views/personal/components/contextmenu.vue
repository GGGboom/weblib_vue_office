<template>
  <v-contextmenu ref="contextmenu" style="width:120px;">
    <v-contextmenu-item>打开</v-contextmenu-item>
    <v-contextmenu-item>下载</v-contextmenu-item>
    <v-contextmenu-item>预览</v-contextmenu-item>
    <v-contextmenu-item divider></v-contextmenu-item>
    <v-contextmenu-item>站内分享</v-contextmenu-item>
    <v-contextmenu-item>外链分享</v-contextmenu-item>
    <v-contextmenu-item divider></v-contextmenu-item>
    <v-contextmenu-item>复制到</v-contextmenu-item>
    <v-contextmenu-item>移动到</v-contextmenu-item>
    <v-contextmenu-item divider></v-contextmenu-item>
    <v-contextmenu-item>重命名</v-contextmenu-item>
    <v-contextmenu-item>删除</v-contextmenu-item>
  </v-contextmenu>
</template>


<script>
  import 'v-contextmenu/dist/index.css'
  import contentmenu from 'v-contextmenu'
  import Vue from 'vue'
  Vue.use(contentmenu)
  export default {
    name: 'contextmenu',
    props: {
      visible: {
        type: Boolean
      }
    },
    watch: {
      type(val){
        console.log(val)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
