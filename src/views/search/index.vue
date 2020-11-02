<template>
  <div class="flexBox">
    <div class="breadcrumbWrap flexHeader">
      <!--<breadcrumb class="breadcrumb-container" :path="path"></breadcrumb>-->
      <span
        style="padding-left:10px;line-height:40px;color:#606266;font-size:14px;"> 在【{{displayName}}】中搜索，关键字:{{listQuery.query}}</span>
    </div>
    <div class="flexBody">
      <el-table ref="table" :data="tableData" tooltip-effect="dark" :key='0' v-loading="listLoading"
                style="width: 100%" v-contextmenu:contextmenu @row-contextmenu="contextmenuCallback"
                @selection-change="handleSelectionChange" :row-class-name="rowHeightLight">
        <el-table-column type="selection" width="35">
        </el-table-column>
        <el-table-column label="文件名">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 'folder'">
              <!--<i class="el-icon-message"></i>-->
              <svg-icon style="font-size:20px;" icon-class="folder" class="icon" />
               <router-link :to="{ path: '/personal/main/' + scope.row.id}" v-html="scope.row.displayName">
               </router-link>
              <!--<a href="#" @click="handleOpenFolder(scope.row.id)">{{scope.row.displayName}}</a>-->
            </span>
            <span v-if="scope.row.type === 'file'">
              <i style="font-size:16px;" class="el-icon-document"></i>
              <a href="#" @click="handleDownload(scope.row.id)" v-html="scope.row.displayName"></a>
            </span>
            <span v-if="scope.row.type === 'link'">
              <i style="font-size:16px;" class="el-icon-view"></i>
              <a href="#" :href="scope.row.id" target="_blank" v-html="scope.row.displayName"></a>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="所属资源库" width="150">
          <template slot-scope="scope">
            <span v-html="scope.row.groupName"></span>
          </template>
        </el-table-column>

        <el-table-column label="文件大小" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.size | fileSize}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column width="100" label="创建者">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.memberName}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column width="180" label="上传时间">
          <template slot-scope="scope">
            <span>{{scope.row.creationDate}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container flexFooter">
      <el-pagination v-if="isPaging" background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                     :total="total"
                     :page-size="listQuery.limit" :page-sizes="[40,60,80]"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!--右键菜单-->
    <v-contextmenu ref="contextmenu" style="width:145px;">
      <v-contextmenu-item @click="contextEvent(0)">下载</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item @click="contextEvent(1)">打开文件所在位置</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
  import { getResources, searchResources, locateResource } from '@/api/resources'
  import Breadcrumb from '@/components/Breadcrumb'
  import contentmenu from 'v-contextmenu'
  import 'v-contextmenu/dist/index.css'

  export default {
    components: { Breadcrumb },
    created() {
      this.listQuery.groupId = Math.abs(parseInt(localStorage.groupId))
      this.displayName = localStorage.groupName === this.$store.getters.account ? '个人资源库' : localStorage.groupName
      this.listQuery.query = this.$route.params.query
      this.getResources()

      this.$root.$on('advance-search-callback', this.advanceSearchCallback)

    },
    computed: {},
    watch: {
      '$route' (to, from) {
        this.listQuery.query = to.params.query
        this.listQuery.groupId = Math.abs(parseInt(localStorage.groupId))
        this.displayName = localStorage.groupName
        this.listQuery.start = 0
        this.isPaging = false
        this.getResources()
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
        total: null,
        listLoading: true,
        path: null,
        displayName: null,
        isPaging: true,
        markRow: null,
        tableSelection: [],
        rowHeightLight: '',
        listQuery: {
          start: 0,
          limit: 40,
          query: null,
          groupId: null
        }
      }
    },
    methods: {
      advanceSearchCallback(o){
        this.listQuery.query = this.$route.params.query
        this.listQuery.groupId = Math.abs(parseInt(localStorage.groupId))
        this.displayName = localStorage.groupName
        this.listQuery.start = 0
        this.isPaging = false
        this.listQuery = Object.assign({}, this.listQuery, o)
        this.getResources()
      },
      getResources() {
        if (localStorage.searchSelect === '1') {
          this.listQuery = Object.assign({}, this.listQuery, { groupId: null })
          this.displayName = '全库'
        }
        this.listLoading = true
        this.tableData = []
        searchResources(this.listQuery).then(res => {
          this.isPaging = true
          res = res.data
          const resources = res.resources
          this.total = res.totalCount
          this.listLoading = false
          this.path = res.path
          this.$nextTick(() => {
            this.tableData = resources
          })
        })
      },
      handleCurrentChange(val) {
        this.listQuery.start = (val - 1) * this.listQuery.limit
        this.getResources()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getResources()
      },
      handleDownload(id){
        location.href = process.env.BASE_API + '/group/downloadResource_v2?id=' + id
      },
      contextmenuCallback(row){
        this.markRow = row
        let selected = this.$store.getters.resources.tableSelections
        if (selected !== undefined && selected !== null) {
          selected = selected.map(item => {
            return item.id
          })
          if (selected.indexOf(row.id) < 0) {
            this.$refs.table.clearSelection()
            this.$refs.table.toggleRowSelection(row)
          }
        } else {
          this.$refs.table.toggleRowSelection(row)
        }
      },
      contextEvent(code){
        switch (code) {
          case 0:
            location.href = process.env.BASE_API + '/group/downloadResource_v2?id=' + this.markRow.id
            break;
          case 1:
            let { parentId, id, groupId } = this.markRow
            if (parentId === 0) {
              parentId = -groupId
            }
            locateResource({ parentId, resourceId: id, pageSize: 40 }).then(res => {
              res = res.data
              this.$store.dispatch('SetPageNum', res.pageNow)
              localStorage.queryResourceId = id
              if (this.markRow.owner) {
                this.$router.push({ path: '/personal/main/' + parentId })
              } else {
                this.$router.push({ path: '/public/main/' + parentId })
              }
            })
            break;
        }
      },
      handleSelectionChange(val){
        this.tableSelection = val
      },
      doSearchUsers(){
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
</style>
