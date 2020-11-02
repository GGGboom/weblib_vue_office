<template>
    <el-dialog v-el-drag-dialog title="断点续传文件" :close-on-click-modal="false" :visible.sync="visible" @open="handleOpen" width="600px"
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
        name: 'uploadDialog2',
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

            this.$root.$on('open-upload-dialog2', (data) => {
                console.log("断点续传在接收")
                this.visible = data.visible
        })
            window.uploadComplete = () => {
                console.log("上传结束111")
                this.$root.$emit('create-dir-callback')
                this.visible=false
                //window.location.reload();
            }
            window.uploadError = (res) => {
                try {
                    this.$message({ showClose: true, message: res, type: 'warning' });
                } catch (e) {
                }
            }
        },
        beforeDestroy(){
            window.openbpupload=false
        },
        methods: {
            handleOpen(){
                window.openbpupload=true;
                this.src = ''
                setTimeout(() => {
                    this.src = basePath + '/static/upload/chunk/upload.html#parentId=' + this.$route.params.id + '' +
                    '&groupId=' + Math.abs(localStorage.groupId) + '&singleSize=2097152&leaveSpace=20953448'
            }, 100)
            },
            handleClose() {
                window.openbpupload=false
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