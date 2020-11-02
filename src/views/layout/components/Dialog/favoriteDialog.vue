<template>
  <el-dialog v-el-drag-dialog :title="'收藏夹'" :visible.sync="visible" width="450px" class="copyDialog"
             @open="openCallback" height="600px">
    <div v-loading="loading" @click="handleELement">
      <el-tag style="margin:5px;"
              v-for="tag in tags"
              :key="tag.watchId"
              closable @close="deleteWatch(tag.watchId)">
        <router-link :to="{path:'/public/main/-'+tag.groupId}" v-html="tag.displayName"></router-link>
        <!--<a :href="'#/public/main/-'+tag.groupId"> {{tag.displayName}}</a>-->
      </el-tag>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button type="default" @click="visible = false">关闭</el-button>
    </span>


  </el-dialog>
</template>

<script>
  import { getWatches, deleteWatch } from '@/api/resources'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

  export default {
    name: 'favoriteDialog',
    directives: { elDragDialog },
    data(){
      return {
        visible: false,
        loading: false,
        tags: []
      }
    },
    created(){
      this.$root.$on('open-favorite-dialog', (data) => {
        this.visible = data.visible
      })
    },
    methods: {
      openCallback(){
        this.loading = true
        getWatches().then(res => {
          res = res.data
          this.tags = res.watches
          this.loading = false
        })
      },
      deleteWatch(id){
        this.loading = true
        deleteWatch({ id: id, type: 'group' }).then(res => {
          res = res.data
          if (res.success) {
            getWatches().then(res => {
              res = res.data
              this.tags = res.watches
              this.$message({
                type: 'success',
                message: '取消收藏成功'
              });
              this.$root.$emit('delete-watch-success')
              this.loading = false
            })
          }
        })
      },
      handleELement(evt){
        if (evt.target.tagName === 'A') {
          this.visible = false
        }
      }
//      showTree(){
//        this.$root.$emit('show-tree-callback')
//      }
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
