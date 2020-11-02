<template>
  <div class="flexBox">
    <div class="breadcrumbWrap flexHeader">
      <breadcrumb class="breadcrumb-container" :path="path"></breadcrumb>
    </div>
    <div class="flexBody">
      <el-table ref="table" :data="tableData" tooltip-effect="dark"
                :key='0'
                :show-header=false
                v-loading="loading"
                style="width: 100%"
                @cell-mouse-enter="handleMouseOver"
                @cell-mouse-leave="handleMouseOut">
        <el-table-column width="250px">
          <template slot-scope="scope">
            <span style="line-height:30px;">
              <svg-icon
                style="margin-right:2px;font-size:16px;position:relative;top:2px;"
                icon-class="cabinet-16px" />
                             <router-link :to="{ path: '/public/main/-' + (scope.row.groupId)}"
                                          v-html="scope.row.displayName">
                             </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              v-show="scope.row.watchId === showFavoriteId" type="text" @click="deleteWatch(scope.row.watchId)">
              取消关注
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { getWatches, deleteWatch } from '@/api/resources'
  import Breadcrumb from '@/components/Breadcrumb'
  export default {
    name: 'favorite',
    components: {
      Breadcrumb
    },
    created(){
      this.getWatches()
    },
    data(){
      return {
        loading: false,
        path: [{ displayName: '我的收藏' }],
        tableData: [],
        showFavoriteId: null
      }
    },
    methods: {
      getWatches(){
        this.loading = true
        getWatches().then(res => {
          res = res.data
          this.tableData = res.watches
          this.loading = false
        })
      },
      deleteWatch(id){
        this.$confirm('此操作将取消该文件柜的关注, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: ''
        }).then(() => {
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
//              this.$root.$emit('delete-watch-success')
                this.tableData = []
                this.$nextTick(() => {
                  this.tableData = res.watches
                  this.loading = false
                })
              })
            }
          })
        })
      },
      handleMouseOver(row){
        this.showFavoriteId = row.watchId
      },
      handleMouseOut(){
        this.showFavoriteId = null
      }
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped></style>
