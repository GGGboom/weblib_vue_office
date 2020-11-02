<template>
  <div class="flexBox">
    <div class="breadcrumbWrap flexHeader">
      <breadcrumb class="breadcrumb-container" :path="path"></breadcrumb>
      <!--<span style="line-height:40px;color:#606266;font-size:14px;"-->
      <!--v-if="isSearch">搜索关键字:{{searchParams.query}}</span>-->
    </div>
    <div class="flexBody">
      <el-table ref="table" :data="tableData" tooltip-effect="dark" :key='0'
                v-loading="loading" class="receiveTable"
                @selection-change="handleSelectionChange" style="width: 100%"
                @expand-change="handleExpand">
        <div class="empty" slot="empty">{{emptyText}}</div>
        <el-table-column type="selection" width="35">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <receive-tree :data="props.row"></receive-tree>
          </template>
        </el-table-column>
        <el-table-column width="120" label="分享人">
          <template slot-scope="scope">
            <el-badge is-dot class="item" v-if="isShow(scope.row)">
              <span>
              {{scope.row.provider}}
            </span>
            </el-badge>
            <span v-if="!isShow(scope.row)">
              {{scope.row.provider}}
            </span>
          </template>
        </el-table-column>


        <el-table-column label="包含文件" width="">
          <template slot-scope="scope">
            <div style="width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden">
              <span @click="expandOrNot(scope.row)" style="cursor:pointer">
              <svg-icon icon-class="folder" class="icon" style="font-size:20px;" />
                <span v-html="scope.row.resources[0].displayName+'等'"
                      :title="scope.row.resources[0].displayName+'等'"></span>
                <!--<a href="javascript:void(0)"-->
                <!--@click="handleFileClick(scope.row)"></a>-->
            </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="100" label="分享时间">
          <template slot-scope="scope">
            <span style="white-space: nowrap">{{scope.row.shareDate}}</span>
          </template>
        </el-table-column>


        <el-table-column label="附言" width="200">
          <template slot-scope="scope">
            <div :title="scope.row.remark"
                 style="width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden"><span
              v-html="scope.row.remark" :title="scope.row.remark"></span>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <div class="pagination-container flexFooter" style="display: none">
      <el-pagination v-if="isPaging" background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                     :total="total"
                     :page-size="listQuery.limit" :page-sizes="[40,60,80]"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getMyReceive, deleteReceivedResource, markReceived } from '@/api/receive'
  import Breadcrumb from '@/components/Breadcrumb'
  import { mapGetters } from 'vuex'
  import receiveTree from './components/receiveTree'
  export default {
    name: 'receive',
    components: { Breadcrumb, receiveTree },
    created(){
      this.$root.$on('delete-receive-callback', this.deleteReceiveCallback)
      this.listQuery.start = 0
      this.searchResources(this.$route.params.id)
    },
    computed: {
      searchResults(){
        return this.resources.searchResults
      },
      isSearch() {
        return this.resources.isSearch
      },
      searchParams(){
        return this.resources.searchParams
      },
      ...mapGetters([
        'resources', 'personalGroupID'
      ])
    },
    watch: {
      '$route' (to, from) {
        this.isPaging = false
        this.listQuery.start = 0
        this.searchResources(to.params.id)
        if (to.params.id > 0) {
          this.$store.dispatch('ClearSearch').then(res => {
          })
        }
      },
      searchResults(res){
        const resources = res.resources
        this.tableData = []
        this.total = res.totalCount
        this.listLoading = false
        this.path = res.path
        this.$nextTick(() => {
          this.tableData = resources
        })
      },
      tableSelection(val){
        if (val.length == 0) {
          val = undefined
        }
        this.$store.dispatch('SetTableSelection', val) //用vuex记录表格已选项
      }
    },
    data() {
      return {
        tableData: null,
        tableSelection: [],
        total: null,
        dialogUpload: false,
        path: null,
        emptyText: '暂无数据',
        loading: false,
        id: this.$route.params.id,
        isPaging: true,
        listQuery: {
          start: 0,
          limit: 40,
          memberId: this.$store.getters.memberId
        }
      }
    },
    methods: {
      searchResources(){
        getMyReceive(this.listQuery).then(res => {
          this.isPaging = true
          res = res.data
          const resources = res.shareRecords
          this.total = res.totalCount
          this.tableData = []
          this.path = [{ 'displayName': '我的接收' }]
          this.$nextTick(() => {
            this.tableData = resources
            if (this.tableData.length === 0) {
              this.emptyText = '暂无数据'
            }
            this.loading = false
          })
        })
      },
      handleCurrentChange(val) {
        this.listQuery.start = (val - 1) * this.listQuery.limit
        this.searchResources()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.searchResources()
      },
      handleDownload(id){
        location.href = process.env.BASE_API + '/group/downloadResource_v2?id=' + id
      },
      handleSelectionChange(val){
        this.tableSelection = val
      },
      deleteReceiveCallback(){
        let ids = []
        ids = this.tableSelection.map(item => {
          return item.resources.map((subItem) => {
            return subItem.id
          })
        })
        if (ids.length !== 0) {
          this.$confirm('此操作将删除所选文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteReceivedResource({ id: ids.join(',') }).then(res => {
              this.searchResources()
              this.$message({ showClose: true, message: '操作成功', type: 'success' });
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
        } else {
          this.$message({ showClose: true, message: '请选择一个操作项！', type: 'warning', duration: 1000 })
        }
      },
      handleFileClick(row){
        location.hash = '/personal/main/' + row.id
      },
      handleExpand(row){
        const resources = row.resources
        let _ids = null
        if (resources.length > 0) {
          if (resources[0].status === '0') {
            _ids = resources.map(item => {
              return item.id
            })
            markReceived({ id: _ids.join(',') }).then(res => {
              res = res.data
              this.$store.dispatch('SetMyReceiveCount')
              row.resources[0].status = '1'
              this.isShow(row)

            })
          }
        }
      },
      isShow(row) {
        if (row.resources.length > 0) {
          if (row.resources[0].status === '0') {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      expandOrNot(row){
        this.$refs.table.toggleRowExpansion(row)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .breadcrumbWrap {
    border-bottom: 1px solid #e6e6e6;
    height: 40px;
  }

  .el-breadcrumb__item {
    height: 40px !important;
    line-height: 40px !important;
  }

  .receiveTable /deep/ {
    /*.el-table__expand-icon {*/
    /*width: 28px;*/
    /*height: 20px;*/
    /*}*/
    .el-table__header {
      th:nth-of-type(1) {
        .cell {
          width: 35px;
        }
      }
      th:nth-of-type(2) {
        .cell {
          width: 48px;
        }
      }
      th:nth-of-type(3) {
        .cell {
          width: 120px;
        }
      }
      th:nth-of-type(5) {
        .cell {
          width: 100px;
        }
      }
      th:nth-of-type(6) {
        .cell {
          width: 150px;
        }
      }
    }
    .el-table__body {
      td:nth-of-type(1) {
        .cell {
          width: 35px;
        }
      }
      td:nth-of-type(2) {
        .cell {
          width: 48px;
        }
      }
      td:nth-of-type(3) {
        .cell {
          width: 120px;
        }
      }
      td:nth-of-type(5) {
        .cell {
          width: 100px;
        }
      }
      td:nth-of-type(6) {
        .cell {
          width: 200px;
        }
      }
    }
    .el-tree-node__content {
      background: #fafafa !important;
      border-bottom: 1px dotted #ddd;
    }
    .el-tree-node__label {
      font-size: 12px !important;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 10px 46px;
      background: #fafafa !important;
    }
    .is-dot {
      top: 4px;
    }

  }

</style>
