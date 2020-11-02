<template>
  <!--<el-scrollbar ref="elScrollbar">-->
  <div class="sidebarBox flexBox">
    <div class="flexHeader" style="padding:5px;padding-top:0;">
      <el-button v-show="hiddenBackBtn" style="width:60px;padding:7px 0;" type="default" icon="el-icon-arrow-left"
                 size="mini"
                 @click="backToResourcesTree">返回
      </el-button>
      <!--<el-input size="mini" placeholder="输入文件夹名字..." style="width:200px"></el-input>-->
    </div>
    <div class="flexBody">
      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <div style="padding-left:5px;">
          <el-tag v-if="displayName !== ''">当前位置：{{displayName}}</el-tag>
        </div>
        <!--<el-tree :data="data" node-key="id" show-checkbox :check-strictly="true" :props="defaultProps" :load="getTrees" lazy-->
                 <!--@node-click="handleNodeClick" @check-change="handlecheckchange" ref="resourcesTree">-->
        <el-tree :data="data" node-key="id" show-checkbox :check-strictly="true" :props="defaultProps" :load="getTrees" lazy
                  @check="handlecheckchange"  ref="resourcesTree">
          <div class="custom-tree-node" slot-scope="{node,data}" >
            <svg-icon icon-class="folder" style="font-size:20px;position:relative;top:1px;" />
            <span v-html="node.label"></span>
          </div>
        </el-tree>
        <!--<el-tree :data="data"-->
                 <!--show-checkbox-->
                 <!--node-key="id"-->
                 <!--:default-expanded-keys="[2, 3]"-->
                 <!--:default-checked-keys="[5]">-->

        <!--</el-tree>-->
        <div style="height:30px"></div>
      </VuePerfectScrollbar>
    </div>
  </div>
  <!--</el-scrollbar>-->

</template>

<script>
  import { getResources } from '@/api/resources'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'


  export default {
    name: 'folderTree',
    components: { VuePerfectScrollbar },
    props: {
      id: {
        type: Number,
        default: null
      },
      displayName: {
        type: String,
        default: ''
      },
      hiddenBackBtn: {
        type: Boolean,
        default: true
      },
      CopyorMove:{
        type:Number,//判断复制还是移动 copy--0 move--1
        default:null
      }
    },
    watch: {
      hiddenBackBtn(val) {
        return val
      }
    },
    data(){
      return {

        data: [],



        settings: {
          maxScrollbarLength: 100
        },
        defaultProps: {
          label: 'text',
          disabled:'disabled',
          isLeaf: (data, node) => {
            return !data.hasChildren
          },

        }


      }
    },
    mounted(){
      //this.getTrees()
    },
    methods: {
//      getTreesRoot(id){
//        getResources({
//          parentId: id,
//          type: 'tree'
//        }).then(res => {
//          res = res.data
//          this.data = { label: '根节点', id: id, children: res }
//        })
//      },
      getTrees(node, resolve){
        console.log(node)
          //console.log(this.$store.getters.myParams.id)
        var tag=false;
        if (node.level === 0) {
          getResources({
            parentId: -this.id,
            type: 'tree'
          }).then(res => {
            res = res.data
            console.log("当前选择")
            var array=this.$store.getters.resources.tableSelections//该结点内有信息 id 父节点id 文件类型 是文件夹还是文件
            console.log(array)
            for(var j=0;j<array.length;j++){//遍历每一个所选
                if(array[j].type==2){
                    if(this.CopyorMove==1){//文件可以复制到父目录
                        for(var i=0;i<res.length;i++){
                            if(array[j].id==node.data.id){
                                tag=true
                            }
                            if(array[j].parentId==res[i].id){
                               // console.log("不能移动去的文件夹")
                              //  console.log(res[i])
                                res[i].disabled=true;
                            }else{
                                res[i].disabled=false;
                            }
                        }
                    }
                }
                else{//文件夹
                    for(var i=0;i<res.length;i++){
                        if(array[j].id==node.data.id){
                            tag=true
                        }
                        if(array[j].parentId==res[i].id||array[j].id==res[i].id){
                          //  console.log("不能移动去的文件夹")
                          //  console.log(res[i])
                            res[i].disabled=true;
                        }else{
                            res[i].disabled=false;
                        }
                    }
                }

                // console.log(array[j].id)
                // for(var i=0;i<res.length;i++){
                //     if(array[j].id==res[i].id||array[j].parentId==res[i].id){
                //         console.log("不能复制去的文件夹")
                //         console.log(res[i])
                //         res.splice(i,1)
                //     }
                // }




            }
            if(node.disabled&&tag){
                res= null
                tag=false
            }
           // console.log(res)
            res.unshift({ text: '根目录', id: this.id, isLeaf: true ,})

            resolve(res);

          })
        }
        if (node.level > 0 && !node.isLeaf) {
          getResources({
            parentId: node.data.id,
            type: 'tree'
          }).then(res => {
            res = res.data
            console.log("当前选择")
            var array=this.$store.getters.resources.tableSelections//该结点内有信息 id 父节点id 文件类型 是文件夹还是文件
              console.log(array)
            for(var j=0;j<array.length;j++){//遍历每一个所选
                if(array[j].type==2){//判断是否是文件
                    if(this.CopyorMove==1){//文件可以复制到父目录
                        for(var i=0;i<res.length;i++){
                            if(array[j].id==node.data.id){
                                tag=true
                            }
                            if(array[j].parentId==res[i].id){
                               // console.log("不能移动去的文件夹")
                             //   console.log(res[i])
                                res[i].disabled=true;

                            }
                            else{
                                res[i].disabled=false;
                            }
                        }
                    }
                }
                else{//文件夹
                    for(var i=0;i<res.length;i++){
                        if(array[j].id==node.data.id){
                            tag=true
                        }
                        if(array[j].parentId==res[i].id||array[j].id==res[i].id){
                         //   console.log("不能移动去的文件夹")
                         //   console.log(res[i])
                            res[i].disabled=true;
                        }else{
                            res[i].disabled=false;
                        }
                    }
                }

            }
            if(node.disabled&&tag){
                res= null
            }
           // console.log(res)
            resolve(res)
          })
        } else {
          setTimeout(() => {
            return resolve([])
          }, 100)
        }
      },
      handlecheckchange(node,data){
          let checkedkeys=data.checkedKeys;
          let currkey=node.id;
          this.$refs.resourcesTree.setCheckedKeys([currkey])
          console.log(data)
          this.$store.dispatch('SetMyParams',node)
      } ,
      // handleNodeClick(data) {
      //   this.$store.dispatch('SetMyParams', data)
      // },
      backToResourcesTree(){
        this.$root.$emit('back-to-resources-tree')
      },

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .sidebarBox {
    &.flexBox {
      flex: 1 1 auto;
      display: flex;
      flex-flow: column nowrap;
      .flexHeader {
        /*flex: 0 0 30px;*/
        flex: 0 0 0px;
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
