<template>
  <div class="flexBox">
    <div class="breadcrumbWrap flexHeader">
      <breadcrumb class="breadcrumb-container" :path="path"></breadcrumb>
    </div>
    <div class="flexBody">
      <contacts-tree></contacts-tree>
    </div>
    <!--<div class="pagination-container flexFooter">-->
    <!--<el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"-->
    <!--:total="total"-->
    <!--:page-size="page.limit" :page-sizes="[40,60,80]"-->
    <!--layout="total, sizes, prev, pager, next, jumper">-->
    <!--</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script>
  import { getContacts } from '@/api/contact'
  import ContactsTree from './components/contactsTree'
  import Breadcrumb from '@/components/Breadcrumb'
  export default {
    name: 'contact',
    components: { Breadcrumb, ContactsTree },
    created(){
//      this.getContacts()
    },
    data(){
      return {
        loading: false,
        tableSelection: [],
        tableData: [],
        emptyText: '暂无数据',
        total: 0,
        path: [{ displayName: '通讯录' }],
        page: {
          start: 0,
          limit: 40
        }
      }
    },
    methods: {
      getContacts(){
        this.loading = true
        getContacts(this.page).then(res => {
          res = res.data
          localStorage.contacts = JSON.stringify(res)
          this.tableData = res.accounts
          this.total = res.totalCount
          this.loading = false
        })
      },
      handleSizeChange(val){
        this.page.limit = val
        this.getContacts()
      },
      handleCurrentChange(val){
        this.page.start = (val - 1) * this.page.limit
        this.getContacts()
      },
      handleSelectionChange(val){
        this.tableSelection = val
      }
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped></style>
