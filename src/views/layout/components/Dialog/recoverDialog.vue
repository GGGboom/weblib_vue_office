<template>
  <el-dialog v-el-drag-dialog :title="text" :visible.sync="visible" width="450px" class="copyDialog"
             @open="openCallback" height="400px">
    <folder-tree v-if="hidden" :hidden-back-btn=false :id="personalGroupId"></folder-tree>
    <span slot="footer" class="dialog-footer">
    <el-button type="default" @click="visible = false">取消</el-button>
    <el-button type="primary" @click="handleSubmit" :loading="isLoading">确定</el-button>
    </span>


  </el-dialog>
</template>

<script>
  import { createDir, moveResource, getResources, copyResource } from '@/api/resources'
  import Tree from '../Sidebar/tree'
  import FolderTree from './folderTree'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

  export default {
    name: 'recoverDialog',
    components: { Tree, FolderTree },
    directives: { elDragDialog },
    data(){
      return {
        visible: false,
        radio: null,
        showFolderDialog: false,
        hidden: true,
        isLoading: false,
        text: '恢复到',
        form: {
          id: null,
          displayName: ''
        },
        personalGroupId: null,
        folderId: null,
        currentView: null,
        type: null,
        rules: {}
      }
    },
    created(){

      this.$root.$on('open-recover-dialog', (data) => {
        this.visible = data.visible
        if (data.id !== undefined) {
          this.type = 'save'
          this.text = '保存到'
          this.personalGroupID = parseInt(Math.abs(data.id))
        } else {
          this.text = '恢复到'
          this.personalGroupID = parseInt(Math.abs(localStorage.groupId))
            console.log("ymm恢复")
            console.log(data)
        }
      })
      this.$root.$on('back-to-resources-tree', () => {
        this.showFolderDialog = false
      })
    },
    methods: {
      handleSubmit(){
        if (this.type === 'save') {
          this.saveToSubmit()
        } else {
          this.recoverSubmit()
        }
      },
      recoverSubmit(){
        this.isLoading = true
        if (this.$store.getters.myParams === null) {
          this.$message({ showClose: true, message: '请选择恢复到目标！', type: 'warning', duration: 1000 })
          return false
        }
        let tableSelectoins = this.$store.getters.resources.tableSelections
        tableSelectoins = tableSelectoins.map(item => {
          return item.id
        })
        let _parentId = this.$store.getters.myParams.id
        this.form.id = this.personalGroupId
        if (this.form.id === this.$store.getters.myParams.id) {
          _parentId = 0
        }
        moveResource({
          id: tableSelectoins.join(','),
          parentId: _parentId,
          groupId: this.form.id
        }).then(res => {
          this.isLoading = false
          this.$message({ showClose: true, message: '恢复成功！', type: 'success', duration: 1000 })
          this.visible = false
          this.$root.$emit('recover-success-callback')
        }).catch(() => {
          this.isLoading = false
        })
      },
      saveToSubmit(){
        this.isLoading = true
        if (this.$store.getters.myParams === null) {
          this.$message({ showClose: true, message: '请选择保存到目标！', type: 'warning', duration: 1000 })
          return false
        }
        let tableSelectoins = this.$store.getters.resources.tableSelections
        tableSelectoins = tableSelectoins.map(item => {
          return item.id
        })
        let _parentId = this.$store.getters.myParams.id
        this.form.id = this.personalGroupId
        if (this.form.id === this.$store.getters.myParams.id) {
          _parentId = 0
        }
        copyResource({
          id: tableSelectoins.join(','),
          parentId: _parentId,
          groupId: this.form.id
        }).then(res => {
          this.isLoading = false
          this.$message({ showClose: true, message: '保存成功！', type: 'success', duration: 1000 })
          this.visible = false
          this.$root.$emit('recover-success-callback')
        }).catch(() => {
          this.isLoading = false
        })
      },
      handleNodeClick(data){
        if (data.type === 'group') {
          this.form.id = data.id
          this.form.displayName = data.displayName
          this.currentView = null
          this.currentView = FolderTree
          this.showFolderDialog = true
        }
      },
      openCallback(){
        this.hidden = false
        this.$nextTick(() => {
          this.personalGroupId = parseInt(Math.abs(localStorage.groupId))
          this.hidden = true
        })
        this.$store.dispatch('SetMyParams', null)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .copyDialog {
    .sidebarBox {
      height: 300px;
    }
    .el-dialog__body {
      padding: 5px 20px !important;
    }
  }
</style>
