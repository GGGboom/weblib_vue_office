<template>
  <el-tree size="mini" style="width:100%" :props="props" :load="loadNode" lazy>
     <span class="custom-tree-node" slot-scope="{ node, data }" @mouseover="handleMouseOver(node.id)"
           @mouseout="handleMouseOut">
        <span>{{ node.label }}</span>
        <span v-show="node.id === showTreeID">
          <el-button  @click.stop="downloadFile(data.resourceId)" type="text">下载</el-button>
          <el-button  @click.stop="saveTo(data.resourceId)" type="text">保存到</el-button>
          <!--<el-button type="text" size="mini"><el-tag type="info">删除</el-tag></el-button>-->
        </span>
     </span>
  </el-tree>
</template>

<script>
  import { getSharedChildResources } from '@/api/receive'
  export default {
    name: 'receiveTree',
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    data(){
      return {
        parentId: null,
        showTreeID: null,
        props: {
          label: 'displayName',
          id: 'resourceId',
          isLeaf: (obj) => {
            if (obj.type === 1) {
              return false
            } else {
              return true
            }
          }
        }
      }
    },
    methods: {
      handleMouseOver(id){
        this.showTreeID = id
      },
      handleMouseOut(){
        this.showTreeID = null
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.data.resources);
        } else {
          getSharedChildResources({ parentId: node.data.resourceId }).then(res => {
            res = res.data
            return resolve(res.resources)
          })

        }
      },
      saveTo(id){
        this.$store.dispatch('SetTableSelection', [{ id: id }])
        this.$root.$emit('open-recover-dialog', { visible: true, id: this.$store.getters.personalGroupID })
      },
      downloadFile(id){
        location.href = process.env.BASE_API + '/group/downloadResource_v2?id=' + id
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 60px;
  }
</style>
