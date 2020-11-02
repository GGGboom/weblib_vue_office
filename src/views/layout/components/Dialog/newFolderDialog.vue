<template>
  <div>
    <el-dialog v-el-drag-dialog title="新建文件夹" :visible.sync="visible" width="450px">
      <el-form :model="form" :rules="rules" ref="dataForm">
        <el-form-item label="文件夹名" label-width="80px" prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="请输入文件夹名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { createDir } from '@/api/resources'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

  export default {
    name: 'uploadDialog',
    directives: { elDragDialog },
    data(){
      return {
        visible: false,
        radio: null,
        form: {
          name: null
        },
        rules: {
          name: { required: true, message: '请填写文件夹名', trigger: 'blur' }
        }
      }
    },
    created(){
      this.$root.$on('open-new-folder-dialog', (data) => {
        this.visible = data.visible
      })
    },
    methods: {
      handleSubmit(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.form = Object.assign({}, this.form, {
              groupId: -localStorage.groupId,
              parentId: this.$route.params.id
            })
            createDir(this.form).then(res => {
              this.$root.$emit('create-dir-callback', res)
              this.$message({ showClose: true, message: '操作成功', type: 'success' });
              this.form.name=null//恢复新建文件名为空
              this.visible = false
            })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
