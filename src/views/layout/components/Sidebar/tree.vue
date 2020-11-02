<template>
  <!--<el-scrollbar ref="elScrollbar">-->

  <div class="sidebarBox flexBox">
    <div class="flexHeader" style="padding:5px;padding-top:0;">
      <el-input v-model="query" size="mini" clearable placeholder="输入文件柜名字..." @keyup.native="searchFunc"
                style="margin-top:10px;width:165px"></el-input>
    </div>
    <div class="flexBody" v-show="!showTable">
      <VuePerfectScrollbar class="scroll-area" v-once :settings="settings">
        <el-tree node-key="0" :props="defaultProps" :load="getTrees" lazy
                 @node-click="nodeClick" ref="resourcesTree">
          <div slot-scope="{ node, data }" @click="handleclick(node)">
            <span> <svg-icon style="margin-right:2px;" v-if="data.type==='group'"
                             icon-class="cabinet-16px" />{{node.label}}</span>
          </div>
        </el-tree>
        <div style="height:30px"></div>
      </VuePerfectScrollbar>
    </div>
    <div class="flexBody" v-if="showTable">
      <el-table
        :data="tableData"
        style="width: 90%;margin:0 auto;overflow-x:hidden;"
        :show-header=false v-loading="isLoading" :highlight-current-row=true>
        <el-table-column
          prop="displayName"
          label="名称"
          width="180">
          <template slot-scope="scope">
            <router-link :to="{path:'/public/main/-'+scope.row.id}">
              <svg-icon style="margin-right:2px;" icon-class="cabinet-16px" />
              {{scope.row.displayName}}
            </router-link>
          </template>n
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!--</el-scrollbar>-->

</template>

<script>
  import { getTrees, searchMyGroups } from '@/api/resources'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  import publicMainPem from '../../components/Navbar'
  export default {
    name: 'treeMenus',
    components: { VuePerfectScrollbar },
    props: {
      nodeClick: {
        type: Function,
        default: null
      }
    },
    data(){
      return {
        settings: {
          maxScrollbarLength: 100
        },
        showTable: false,
        defaultProps: {
          label: 'displayName',
          isLeaf: 'leaf'
        },
        tableData: [],
        query: null,
        timeout: null,
        isLoading: false
      }
    },
    mounted(){
      //this.getTrees()
    },
    watch: {
      query(val){
        if (val === '') {
          this.showTable = false
        } else {
          this.showTable = true
        }
      }
    },
    methods: {
      searchFunc(){
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.isLoading = true
          searchMyGroups({ displayName: this.query }).then(res => {
            res = res.data
            this.tableData = res.groups
            this.showTable = true
            this.isLoading = false
          })
        }, 500)
      },
      getTrees(node, resolve){
        if (node.level === 0) {
          getTrees({
            containAblumCategory: false,
            containPersonGroup: false
          }).then(res => {
            res = res.data

            const category = res.category
            return resolve(category);
          })
        }
        if (node.level > 0 && !node.isLeaf) {
          getTrees({
            containAblumCategory: false,
            containPersonGroup: false,
            categoryId: node.data.id
          }).then(res => {
            res = res.data
            const category = res.category,group = res.group
            setTimeout(() => {
              resolve([...category, ...group])
            }, 150)
          })
        } else {
          setTimeout(() => {
            return resolve([])
          }, 100)
        }
      },
      handleclick(node){
          // console.log("点击叶子")
          // console.log(node)
          if(node.data.leaf==true){
              localStorage.setItem("guiziid",node.data.id)
              localStorage.setItem("parentid",node.parent.data.id)
          }

      }
//      handleNodeClick(data) {
//        if (data.type === 'group') {
//          this.$router.push({ path: '/public/main/' + -data.id })
//        }
//      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .sidebarBox {
    .el-table__body-wrapper {
      overflow: hidden;
    }
    &.flexBox {
      flex: 1 1 auto;
      display: flex;
      flex-flow: column nowrap;
      .flexHeader {
        flex: 0 0 30px;
      }
      .flexBody {
        flex: 1 1 auto;
        display: flex;
        flex-flow: column nowrap;
        overflow: hidden;
      }
    }
  }

  .el-tree {
    width: 95%;
    font-size: 12px;
    font-weight: bold;
    .is-current > .el-tree-node__content {
      color: #409EFF;
      font-weight: bold;
      background: #fff;
    }
    .el-tree-node__content:hover {
      background: #fff;
    }
  }

  .scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    flex: 1 1 auto;
  }


</style>
