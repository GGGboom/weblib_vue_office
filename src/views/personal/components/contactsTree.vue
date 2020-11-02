<template>
  <div>
    <el-tree class="contactsTree" v-if="doNotInit" v-loading="loading" size="mini" style="width:100%" :props="props"
             :load="loadNode"
             lazy>
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <el-row :gutter="20">
          <el-col :span="11">

            <div class="grid-content bg-purple">
              <svg-icon v-if="data.type==='team'" icon-class="team" />
              <svg-icon v-if="data.type==='folder'" icon-class="cluster" />
              <svg-icon v-if="data.type==='person'" icon-class="user2" />
              <span v-html="node.label"></span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple" v-html="data.position"></div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple" v-html="data.email"></div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple" v-html="data.mobile"></div>
          </el-col>
        </el-row>
      </div>
    </el-tree>
  </div>
</template>
<script>
  import { getMyContactTree } from '@/api/contact'
  export default {
    name: 'contractTree',
    created(){
        localStorage.contactStore = undefined
      getMyContactTree().then(res => {
        res = res.data
      })
    },
    data(){
      return {
        loading: false,
        doNotInit: true,
        props: {
          id: 'id',
          isLeaf(data, node){
            if (data.type === 'person') {
              return true
            } else {
              return data.isLeaf
            }
          }
        }
      }
    },
    methods: {
      getMyContacts(resolve){
        getMyContactTree().then(res => {
          res = res.data
          this.loading = false
          res.folder = res.folder.map(item => {
            return { label: item.text, id: item.id, type: 'folder' }
          })
          res.member = res.member.map(item => {
            return { label: item.fullName, id: item.id, type: 'person' }
          })
          res.team = res.team.map(item => {
            return { label: item.text, id: item.id, type: 'team' }
          })

          if (localStorage.contactStore === undefined || localStorage.contactStore === 'undefined') {
            try {
              const contactJSON = {
                lastModified: res.folder[0].lastModified,
                data: [...res.folder, ...res.member, ...res.team]
              }
              localStorage.contactStore = JSON.stringify(contactJSON)
            } catch (e) {
              console.log('存储通讯录失败，可能通讯录没数据')
            }
            return resolve([...res.folder, ...res.member, ...res.team])
          } else {
            if (res.folder.length > 0) {
              if (res.folder[0].lastModified !== JSON.parse(localStorage.contactStore).lastModified) {
                this.$confirm('通讯录有新的修改，是否更新?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  //重新加载
                  localStorage.contactStore = undefined
                  this.doNotInit = false
                  setTimeout(() => {
//                    this.getMyContacts(resolve)
                    this.doNotInit = true
                  }, 500)
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '取消操作'
                  });
                })
              } else {
                //doNothing
              }
            } else {
              //doNothing 新请求回来通讯变为无数据
            }
          }
        })
      },
      loadNode(node, resolve){
        if (node.level === 0) {
          this.loading = true
          if (localStorage.contactStore === undefined || localStorage.contactStore === 'undefined') {
            this.getMyContacts(resolve)
          } else {
            //从本地存储获取
            const contactJSON = JSON.parse(localStorage.contactStore)
            this.loading = false
            this.getMyContacts(resolve) //异步请求一次，看看是否有更新
            return resolve(contactJSON.data)
          }
        } else if (node.data.type !== 'person') {
          getMyContactTree({ id: node.data.id, folderOnly: false }).then(res => {
            res = res.data
            if (node.data.type === 'team') {
//              if (res.members.length > 0) {
//                res.members = res.members.map(item => {
//                  return Object.assign({}, item, { children: [] })
//                })
//              }
              this.loading = false
              res.members = res.members.map(item => {
                return { label: item.fullName, id: item.id, type: 'person' }
              })
              return resolve([...res.members])
            } else {
              this.loading = false
              res.folder = res.folder.map(item => {
                return { label: item.text, id: item.id, type: 'folder' }
              })
              res.member = res.member.map(item => {
                return { label: item.fullName, id: item.id, type: 'person' }
              })
              res.team = res.team.map(item => {
                return { label: item.text, id: item.id, type: 'team' }
              })
              return resolve([...res.folder, ...res.member, ...res.team])
            }
          })

        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .contactsTree /deep/ {
    .custom-tree-node {
      border-bottom: 1px solid #f1f1f1;
      width: 95%;
      line-height: 30px;
      font-size: 12px;
    }
    .el-tree-node__content {
      height: 38px !important;
    }
  }
</style>
