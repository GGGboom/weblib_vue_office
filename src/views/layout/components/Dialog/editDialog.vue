<template>
  <div>
    <el-dialog v-el-drag-dialog title="编辑" :visible.sync="visible" width="400px" @open="handleOpen">
      <el-form :model="form" :rules="rules" ref="dataForm">
        <el-form-item label="文件名称" label-width="80px" prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="输入文件名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="80px" prop="name">
          <el-input type="textarea" :rows="3" v-model="form.desc" auto-complete="off" placeholder="输入描述内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { modifyResource } from '@/api/resources'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

  export default {
    name: 'editDialog',
    directives: { elDragDialog },
    data(){
      return {
        visible: false,
        form: {
          name: null,
          id: null,
          desc: null,
        },
        rules: {
          name: { required: true, message: '请填写文件夹名', trigger: 'blur' }
        }
      }
    },
    created(){
      this.$root.$on('open-edit-dialog', (data) => {
        this.visible = data.visible
      })
    },
    methods: {
      handleSubmit(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
              console.log("打印上传之前:")
              console.log(this.form)
            modifyResource(this.form).then(res => {
              this.$root.$emit('edit-success-callback', res)
              this.visible = false
              console.log("打印上传之后:")
              console.log(this.form)
              this.$message({
                showClose: true, message: '操作成功', type: 'success', duration: 500
              })

            })
          }
        })
      },
      handleOpen(){
        const { tableSelections } = this.$store.getters.resources
          console.log(tableSelections)
        const { desc, displayName, id } = tableSelections[0]
        //this.form.name = displayName.split('.')[0].replace(/&nbsp;/g,' ')
          if(tableSelections[0].type==1){
              this.form.name=displayName.replace(/&nbsp;/g,' ')
          }else{
              this.form.name = displayName.split('.').slice(0,displayName.split('.').length-1).join('.').replace(/&nbsp;/g,' ')// 2020 0628 显示完整文件名

          }
         // this.form.name = displayName.split('.').slice(0,displayName.split('.').length-1).join('.').replace(/&nbsp;/g,' ')// 2020 0628 显示完整文件名
          console.log("文件名:")
          console.log(this.form.name)
        this.form.desc = desc
        this.form.id = id
//        modifyResource({
//          id,name,desc
//        }).then(res=>{
//          console.log(res)
//        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss"></style>
