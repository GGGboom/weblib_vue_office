<template>
  <el-dialog v-el-drag-dialog title="分享到" :visible.sync="visible" width="750px" class="shareDialog"
             @open="openCallback">

    <el-row :gutter="20">
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>选择分享对象</span>
              <!--<el-button style="float: right; padding: 3px 0" type="text">添加</el-button>-->
            </div>

            <el-tabs :tab-position="'left'" v-model="activeName">
              <el-tab-pane label="最近联系人" name="first">
                <VuePerfectScrollbar class="scroll-area" :settings="settings">
                  <el-tree @check-change="checkChange" @check="checkFunc" v-loading="loading" size="mini"
                           style="width:100%" :props="props"
                           :load="loadNode" lazy ref="recentConcatTree" node-key="key" v-if="isOpen"
                           :check-strictly="true" show-checkbox class="shareTreeDialog">

                    <div class="custom-tree-node" slot-scope="{ node, data }" :class="{noCheck:data.type==='folder'}">
                      <el-row :gutter="20">
                        <el-col :span="11">
                          <div class="grid-content bg-purple">
                            <svg-icon v-if="data.type==='team'" icon-class="team" />
                            <svg-icon v-if="data.type==='person'" icon-class="user2" />
                            <span v-html="node.label"></span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>

                  </el-tree>
                  <!--<el-table-->
                  <!--:data="tableData"-->
                  <!--style="width: 100%">-->
                  <!--<el-table-column-->
                  <!--type="selection"-->
                  <!--width="55">-->
                  <!--</el-table-column>-->
                  <!--<el-table-column-->
                  <!--prop="signature"-->
                  <!--label="姓名">-->
                  <!--<template slot-scope="scope">-->
                  <!--<el-tag v-if="scope.row.type === 'team'" type="success">-->
                  <!--<svg-icon iconClass="team"></svg-icon>-->
                  <!--{{scope.row.name}}-->
                  <!--</el-tag>-->
                  <!--<el-tag v-else >-->
                  <!--<svg-icon iconClass="user2"></svg-icon>-->
                  <!--{{scope.row.name}}-->
                  <!--</el-tag>-->
                  <!--</template>-->
                  <!--</el-table-column>-->
                  <!--</el-table>-->
                </VuePerfectScrollbar>
              </el-tab-pane>
              <el-tab-pane label="通讯录" name="second">
                <VuePerfectScrollbar class="scroll-area" :settings="settings">
                  <contacts-tree style="width:250px;height:300px;" v-if="isOpen"
                                 :callback="contactsTreeCallback"></contacts-tree>
                </VuePerfectScrollbar>

              </el-tab-pane>
            </el-tabs>


          </el-card>
        </div>
      </el-col>
      <!--<el-col :span="2">-->
      <!--<div class="grid-content bg-purple-light">-->
      <!--<div style="height:100px"></div>-->
      <!--<p>-->
      <!--<el-button type="primary" icon="el-icon-arrow-right" circle title="添加"></el-button>-->
      <!--</p>-->
      <!--<p>-->
      <!--<el-button icon="el-icon-arrow-left" circle title="移除"></el-button>-->
      <!--</p>-->
      <!--</div>-->
      <!--</el-col>-->
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已选项</span>
              <!--<el-button style="float: right; padding: 3px 0" type="text">移除</el-button>-->
            </div>
            <div style="height:300px;overflow:auto">
              <span v-for="item in checkedNodes" style="margin-right:5px;">
                <el-tag :type="item.type === 'team' ? 'success': '' " closable :key="item.id" @close="closeTag(item)">
                <span v-if="item.type === 'team'"><svg-icon iconClass="team"></svg-icon> {{item.label}}</span>
                <span v-if="item.type === 'person'"><svg-icon iconClass="user2"></svg-icon> {{item.label}}</span>
              </el-tag>
              </span>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>


    <span slot="footer" class="dialog-footer">
    <div style="padding:5px">
      <el-input v-model="form.desc" placeholder="附言：随便说几句吧：）"></el-input>
    </div>
    <div style="height:10px;"></div>
    <el-button type="default" @click="visible = false">取消</el-button>
    <el-button type="primary" @click="handleSubmit" :loading="isLoading">确定</el-button>
    </span>

  </el-dialog>
</template>

<script>
  import ContactsTree from './contactsTree'
  import { shareResourceToMember } from '@/api/sent'
  import { getRecentContacts } from '@/api/contact'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

  export default {
    name: 'copyDialog',
    directives: { elDragDialog },
    components: {
      ContactsTree, VuePerfectScrollbar
    },
    data(){
      return {
        settings: {
          maxScrollbarLength: 100
        },
        props: {
          id: 'id',
          isLeaf(data, node){
            return true
          }
        },
        visible: false,
        refreshContactsTree: false,
        isLoading: false,
        tableData: [],
        loading: false,
        isChecked: null,
        isOpen: false,
        activeName: 'first',
        form: {
          memberName: null,
          memberIds: null,
          resourceIds: null,
          groupId: null,
          desc: null
        },
        checkedNodes: [],//传递用选中节点
        members: [],
        checkedKeys: []
      }
    },
    watch: {
      '$store.getters.myParams'(val){
        if (val !== null) {
          this.checkedNodes = val.checkedNodes
          let _members = []
          if (this.members.length > 0) {
            _members = this.members.map(item => {
              return item.key
            })
            let __checkedKeys = this.$refs.recentConcatTree.getCheckedKeys()
            if (val.isChecked) {
              let __saveKeys = _members.filter((item => {
                return parseInt(item.split('-')[1]) === val.data.id
              }))
              this.$refs.recentConcatTree.setCheckedKeys(Array.from(new Set([...__checkedKeys, ...__saveKeys])))
            } else {
              __checkedKeys = __checkedKeys.filter(item => {
                return (parseInt(item.split('-')[1]) !== val.data.id)
              })
              this.$refs.recentConcatTree.setCheckedKeys(Array.from(new Set([...__checkedKeys])))
            }
          }
        }
      }
    },
    created(){
      this.$root.$on('open-share-dialog', (data) => {
        this.visible = data.visible
      })
    },
    methods: {
      closeTag(data){
        this.checkedNodes.splice(this.checkedNodes.indexOf(data), 1)
        this.$store.dispatch('SetMyParams', {
          checkedNodes: this.checkedNodes,
          isChecked: false,
          data: data
        })
      },
      contactsTreeCallback(data){
        this.checkedNodes = data
      },
      handleSubmit(){
        let memberName = [], memberIds = [], tableSelections = this.$store.getters.resources.tableSelections
        this.checkedNodes.forEach(item => {
          if (item.type === 'team') {
            memberIds.push(item.id)
          } else if (item.type === 'person') {
            memberName.push(item.text)
          }
        })
        tableSelections = tableSelections.map((item) => {
          return item.id
        }).join(';')
        const params = Object.assign({}, this.form, {
          memberName: memberName.join(';'),
          memberIds: memberIds.join(';'),
          resourceIds: tableSelections,
          groupId: Math.abs(parseInt(localStorage.groupId))
        })
        if (params.memberName !== '' || params.memberIds !== '') {
          this.isLoading = true
          shareResourceToMember(params).then(res => {
            this.isLoading = false
            res = res.data
            this.$message({ showClose: true, message: '分享成功', type: 'success' });
            this.checkedNodes = []
            this.visible = false
          }).catch(() => {
            this.isLoading = false
          })
        } else {
          this.$message({ showClose: true, message: '请选择分享对象', type: 'warning' });
        }
      },
      openCallback(){
        this.isOpen = false //初始化用，隐藏组件
        this.$store.dispatch('SetMyParams', null) //重置VUEX保存的选中参数
        this.$nextTick(() => {
          this.activeName = 'first' //打开first选中状态
          this.isOpen = true //显示组件初始化用
          this.checkedNodes = [] //重置选中节点
          this.form.desc = ''
        })
      },
      loadNode(node, resolve){
//        if (node.level === 0) {
        this.loading = true
        getRecentContacts({ limit: 30 }).then(res => {
          this.loading = false
          res = res.data
          res.teams = res.teams.map(item => {
            return {
              label: item.signature.split(':')[item.signature.split(':').length - 1],
              type: 'team',
              id: item.id,
              key: 'root-' + item.id
            }
          })
          res.accounts = res.accounts.map(item => {
            return {
              text: item.account,
              label: item.name,
              type: 'person',
              id: item.members[0].id,
              key: 'root-' + item.members[0].id
            }
          })
          this.members = [...res.accounts, ...res.teams]
          return resolve([...res.accounts, ...res.teams])
        })

//        }
      },
      checkChange(data, isChecked){
        this.isChecked = isChecked
        //获取当前选中的最近联系人节点

      },
      checkFunc(data){
        let _checkedNodes = this.$store.getters.myParams, __ids
        if (_checkedNodes !== null && _checkedNodes.checkedNodes !== undefined) {
          __ids = _checkedNodes.checkedNodes.map((item => {
            return item.id
          }))
          if (this.isChecked) {
            if (__ids.indexOf(data.id) < 0) {
              _checkedNodes.checkedNodes.push(data)
            }
          } else {
            _checkedNodes.checkedNodes.splice(__ids.indexOf(data.id), 1)
          }
        } else {
          _checkedNodes = { checkedNodes: [data] }
        }
        this.$store.dispatch('SetMyParams', {
          checkedNodes: _checkedNodes.checkedNodes,
          isChecked: this.isChecked,
          data: data
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .shareDialog /deep/ {
    .sidebarBox {
      height: 300px;
    }
    .el-dialog__body {
      padding: 5px 20px !important;
    }
    .el-card__body {
      padding: 5px;
    }

    .el-tabs__item {
      font-size: 12px;
    }
  }

  .scroll-area {
    position: relative;
    margin: auto;
    height: 300px;
  }

</style>
