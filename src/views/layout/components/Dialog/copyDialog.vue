<template>
  <el-dialog v-el-drag-dialog title="复制到" :visible.sync="visible" width="450px" class="copyDialog"
             @open="openCallback">
    <el-tabs v-model="activeName" v-if="isInit">
      <el-tab-pane label="个人资源库" name="first">
        <folder-tree :hidden-back-btn=false :id="personalGroupId" :CopyorMove=0></folder-tree>
      </el-tab-pane>
      <el-tab-pane label="公共资源库" name="second">
        <tree v-show="!showFolderDialog" :nodeClick="handleNodeClick"></tree>
        <folder-tree v-if="form.id !== null && showFolderDialog" :displayName="form.displayName"
                     :id="form.id"></folder-tree>
      </el-tab-pane>
    </el-tabs>


    <span slot="footer" class="dialog-footer">
    <el-button type="default" @click="visible = false">取消</el-button>
    <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>


  </el-dialog>
</template>

<script>
  import { createDir, copyResource, getResources } from '@/api/resources'
  import Tree from '../Sidebar/tree'
  import FolderTree from './folderTree'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

  export default {
    name: 'copyDialog',
    components: { Tree, FolderTree },
    directives: { elDragDialog },
    data(){
      return {
        isInit: true,
        activeName: 'first',
        visible: false,
        radio: null,
        showFolderDialog: false,
        form: {
          id: null,
          displayName: ''
        },
        personalGroupId: this.$store.getters.personalGroupID,
        folderId: null,
        currentView: null,
        rules: {}
      }
    },
    created(){
      this.$root.$on('open-copy-dialog', (data) => {
        this.visible = data.visible
      })
      this.$root.$on('back-to-resources-tree', () => {
        this.showFolderDialog = false
      })
    },
    methods: {
      handleSubmit(){
        if (this.$store.getters.myParams === null) {
          this.$message({ showClose: true, message: '请选择复制目标！', type: 'warning', duration: 1000 })
          return false
        }
        let tableSelectoins = this.$store.getters.resources.tableSelections
        tableSelectoins = tableSelectoins.map(item => {
          return item.id
        })
        let _parentId = this.$store.getters.myParams.id
        if (this.activeName === 'first') {
          this.form.id = this.personalGroupId
        }
        if (this.form.id === this.$store.getters.myParams.id) {
          _parentId = 0
        }
        copyResource({
          id: tableSelectoins.join(','),
          parentId: _parentId,
          groupId: this.form.id
        }).then(res => {
          this.$message({ showClose: true, message: '复制成功！', type: 'success', duration: 5000 })
          this.visible = false

          this.$root.$emit('copy-success-callback')
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
        this.$store.dispatch('SetMyParams', null)
        this.isInit = false
        this.$nextTick(() => {
          this.isInit = true
          this.activeName = 'first'
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .copyDialog {
    .sidebarBox {
      height: 340px;
    }
    .el-dialog__body {
      padding: 5px 20px !important;
    }
  }
</style>
