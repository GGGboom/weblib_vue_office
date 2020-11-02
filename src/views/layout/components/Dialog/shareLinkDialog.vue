<template>
  <el-dialog v-el-drag-dialog title="链接分享" :visible.sync="visible" width="500px" class="linkShareDialog"
             @open="openCallback('加密')">
    <div>
      <el-radio-group v-if="show" v-model="radio" size="mini">
        <el-radio-button label="加密"></el-radio-button>
        <el-radio-button label="公开"></el-radio-button>
      </el-radio-group>
    </div>
    <div style="height:15px"></div>
    <div>

      <el-input v-model="inputData" placeholder="Please input" style="display:none" />
      <el-input v-model="shareLinkData" placeholder="Please input" style="width:300px;max-width:100%;" readonly />
      <el-button v-clipboard:copy="inputData" v-clipboard:success="clipboardSuccess" type="primary" icon="document">
        {{buttonText}}
      </el-button>
    </div>
    <div style="height:5px"></div>
    <div v-if="buttonText === '复制链接及密码'">
      <span style="font-size:12px;">提取密码：</span>
      <el-input v-model="codeData" style="width:100px;" readonly />
    </div>

  </el-dialog>
</template>

<script>
  import clip from '@/utils/clipboard' // use clipboard directly
  import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
  import { shareLink } from '@/api/sent'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

  export default {
    name: 'shareLinkDialog',
    directives: {
      clipboard, elDragDialog
    },
    data(){
      return {
        inputData: '',
        shareLinkData: '',
        visible: false,
        radio: '加密',
        codeData: '',
        buttonText: '复制链接及密码',
        show: false
      }
    },
    watch: {
      radio(val){
        if (val === '公开') {
          this.buttonText = '复制链接'
        } else {
          this.buttonText = '复制链接及密码'
        }
        this.shareLink(val)
      }
    },
    created(){
      this.$root.$on('open-linkShare-dialog', (data) => {
        this.visible = data.visible
      })
    },
    methods: {
      clipboardSuccess() {
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1500
        })
      },
      openCallback(val){
        this.shareLink(val)
        this.show = false
        this.$nextTick(() => {
          this.radio = '加密'
          this.show = true
        })
      },
      shareLink(val){
        let tableSelections = this.$store.getters.resources.tableSelections
        tableSelections = tableSelections.map((item) => {
          return item.id
        }).join(';')
        if (val === '加密') {
          shareLink({
            id: tableSelections,
            setCode: 1
          }).then(res => {
            res = res.data
            this.shareLinkData = res.data[0].url
            this.inputData = res.data[0].url + ' 密码：' + res.data[0].code
            this.codeData = res.data[0].code
          })
        } else {
          shareLink({
            id: tableSelections,
            setCode: 0
          }).then(res => {
            res = res.data
            this.shareLinkData = res.data[0].url
            this.inputData = res.data[0].url
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .linkShareDialog /deep/ {

  }

</style>
