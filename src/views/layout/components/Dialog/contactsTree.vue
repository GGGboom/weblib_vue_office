<template>
  <div>
    <el-tree @check-change="checkChange" v-loading="loading" size="mini" style="width:100%" :props="props"
             :load="loadNode" lazy ref="shareTree" node-key="key" @check="checkFunc"
             :check-strictly="true" show-checkbox class="shareTreeDialog">
      <div class="custom-tree-node" slot-scope="{ node, data }" :class="{noCheck:data.type==='folder'}">
        <el-row :gutter="20">
          <el-col :span="11">
            <div class="grid-content bg-purple">
              <svg-icon v-if="data.type==='team'" icon-class="team" />
              <svg-icon v-if="data.type==='folder'" icon-class="cluster" />
              <svg-icon v-if="data.type==='person'" icon-class="user2" />
              <span v-html="node.label"></span>
            </div>
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
    },
    props: {
      callback: {
        type: Function
      },
      checkNodes: {
        type: Object
      }
    },
    watch: {
      '$store.getters.myParams'(val){
        this.checkedNodes = val.checkedNodes
        this.callback(this.checkedNodes)//树选中的节点数组传递给父组件
        if (this.treeKeys.length > 0) {
          let __checkedKeys = this.$refs.shareTree.getCheckedKeys()
          if (val.isChecked) {
            let __saveKeys = this.treeKeys.filter((item => {
              return parseInt(item.split('-')[1]) === val.data.id
            }))
            this.$refs.shareTree.setCheckedKeys(Array.from(new Set([...__checkedKeys, ...__saveKeys])))
          } else {
            __checkedKeys = __checkedKeys.filter(item => {
              return (parseInt(item.split('-')[1]) !== val.data.id)
            })
            this.$refs.shareTree.setCheckedKeys(Array.from(new Set([...__checkedKeys])))
          }
        }
      }
    },
    data(){
      return {
        loading: false,
        checkedKeys: [],//选中的节点Key
        treeKeys: [],//保存树显示的节点的key
        checkedNodes: [],//选中的节点
        isChecked: null,
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
      checkChange(data, isChecked){
        this.isChecked = isChecked
      },
      hideCheckBox(){
        setTimeout(() => {
          document.querySelectorAll('.noCheck').forEach((item) => {
            item.previousElementSibling.style.display = 'none'
          })
        }, 100)
      },
      getMyContacts(resolve, params = {}){
        getMyContactTree(params).then(res => {
          res = res.data
          if (res.members !== undefined) {
            this.loading = false
            this.hideCheckBox()
            res.members = res.members.map(item => {
              this.treeKeys.push(params.id + '-' + item.id)
              return {
                label: item.fullName,
                id: item.id,
                type: 'person',
                text: item.text,
                key: params.id + '-' + item.id
              }
            })
            /**
             * 展开的时候，判断有没已经选中的相同项，有的话则自动选中
             * @type {*}
             * @private
             */


            let _checkedKeys = this.getIds(this.checkedNodes)

            let _openAndCheckedArr = [...res.members]
            _openAndCheckedArr.forEach(item => {
              if (_checkedKeys.indexOf(item.id) > -1) {
                this.checkedKeys.push(item.key)
              }
            })
            this.$nextTick(() => {
              this.$refs.shareTree.setCheckedKeys(this.checkedKeys)
            })

            return resolve([...res.members])
          } else {
            this.loading = false
            this.hideCheckBox()
            res.folder = res.folder.map(item => {
              this.treeKeys.push(params.id + '-' + item.id)
              return {
                label: item.text,
                id: item.id,
                type: 'folder',
                key: params.id + '-' + item.id
              }
            })
            res.member = res.member.map(item => {
              this.treeKeys.push(params.id + '-' + item.id)
              return {
                label: item.fullName,
                id: item.id,
                type: 'person',
                text: item.text,
                key: params.id + '-' + item.id
              }
            })
            res.team = res.team.map(item => {
              this.treeKeys.push(params.id + '-' + item.id)
              return {
                label: item.text,
                id: item.id,
                type: 'team',
                key: params.id + '-' + item.id
              }
            })

            /**
             * 展开的时候，判断有没已经选中的相同项，有的话则自动选中
             * @type {*}
             * @private
             */

            let _checkedKeys = this.checkedNodes.map(item => {
              return item.id
            })

            let _openAndCheckedArr = [...res.member, ...res.team]
            _openAndCheckedArr.forEach(item => {
              if (_checkedKeys.indexOf(item.id) > -1) {
                this.checkedKeys.push(item.key)
              }
            })
            this.$nextTick(() => {
              this.$refs.shareTree.setCheckedKeys(this.checkedKeys)
            })


            return resolve([...res.folder, ...res.member, ...res.team]);
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
            this.hideCheckBox()
            return resolve(contactJSON.data)
          }
        } else if (node.data.type !== 'person') {
          this.getMyContacts(resolve, { id: node.data.id, folderOnly: false })
        }
      },
      countTheTimes(array, subject){
        let count = 0, _arrary = []
        array.forEach((item, index) => {
          if (item.split('-')[1] === subject) {
            _arrary.push({ key: item, index: index })
            count++
          }
        })
        return { count: count, data: _arrary }
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
//            this.checkedFunc(data)
          } else {
            _checkedNodes.checkedNodes.splice(__ids.indexOf(data.id), 1)
//            this.uncheckedFunc(data)
          }
        } else {
          _checkedNodes = { checkedNodes: [data] }
        }
        this.$store.dispatch('SetMyParams', {
          checkedNodes: _checkedNodes.checkedNodes,
          isChecked: this.isChecked,
          data: data
        })
      },
      getIds(arr){
        return arr.map(item => {
          return item.id
        })
      },
      getKeys(arr){
        return arr.map(item => {
          return item.key
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .shareTreeDialog /deep/ {
    .custom-tree-node {
      border-bottom: 1px solid #f1f1f1;
      width: 95%;
      line-height: 38px;
      font-size: 12px;
    }

    .el-tree-node__content {
      height: 38px;
    }
  }
</style>
