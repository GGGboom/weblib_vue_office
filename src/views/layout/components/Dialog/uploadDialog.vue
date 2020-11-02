<template>
  <el-dialog v-el-drag-dialog title="上传文件" :close-on-click-modal="false" :visible.sync="visible" @open="handleOpen" width="600px"
             class="uploadDialog" @close="handleClose">
    <iframe :src="src"
            frameborder="0" width="100%" height="400px"></iframe>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">取消</el-button>
      </span>
  </el-dialog>
</template>

<script>

  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  export default {
    name: 'uploadDialog',
    directives: { elDragDialog },
    data(){
      return {
        visible: false,
        parentId: null,
        groupId: null,
        src: ''
      }
    },
    created(){

            this.$root.$on('open-upload-dialog', (data) => {
                if(!window.openbpupload)
        {this.visible = data.visible}
        })




      window.uploadComplete = () => {
        this.$root.$emit('create-dir-callback')
      }
      window.uploadError = (res) => {
        try {
          this.$message({ showClose: true, message: res, type: 'warning' });
        } catch (e) {
        }
      }
    },
    methods: {
      handleOpen(){
            this.src = ''
            setTimeout(() => {
                this.src = basePath + '/static/upload/normal/upload.html#parentId=' + this.$route.params.id + '' +
                '&groupId=' + Math.abs(localStorage.groupId) + '&singleSize=2097152&leaveSpace=20953448'
        }, 100)


      },
      handleClose() {
        window.isUpload = true
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .uploadDialog /deep/ {
    .el-dialog__body {
      padding: 0
    }
  }
</style>
