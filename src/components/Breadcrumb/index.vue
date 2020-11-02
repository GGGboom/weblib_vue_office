<template>

  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!--<transition-group name="breadcrumb">-->
    <span style="cursor:pointer;float:left;margin-top:14px;margin-right:5px;" @click="addWatch"
          v-if="!((route=$route.path).indexOf('personal') > -1)"
          :class="startCss"></span>
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.id">
      <span v-if="item.id === 'filter'"><span v-html="item.displayName"></span></span>
      <span v-else>
        <router-link v-if="isPersonal()" :to="{path:'/personal/main/'+item.id}">
          <span v-if="index===0">个人资源库</span>
          <span v-else v-html="item.displayName"></span>
        </router-link>

        <router-link v-if="!isPersonal()" :to="{path:'/public/main/'+item.id}" v-html="item.displayName"></router-link>
      </span>
    </el-breadcrumb-item>
    <!--</transition-group>-->
  </el-breadcrumb>
</template>

<script>
  import { generateTitle } from '@/utils/i18n'
  import { addWatch, deleteWatch, getWatchByGroup } from '@/api/resources'

  export default {
    props: {
      path: {
        type: Array
      }
    },
    created() {
      this.getBreadcrumb()
      this.$root.$on('delete-watch-success')
//      this.$root.$on('has-set-groupId', () => {
//        if (!(this.$route.name.indexOf('personal') > -1)) {
//          getWatchByGroup({ groupId: -parseInt(localStorage.groupId) }).then(res => {
//            res = res.data
//            this.watchId = res.watchId
//            if (res.watchId !== 0) {
//              this.startCss = 'el-icon-star-on'
//            } else {
//              this.startCss = 'el-icon-star-off'
//            }
//          })
//        }
//      })
    },
    data() {
      return {
        levelList: null,
        pathObj: null,
        route: null,
        watchId: null,
        startCss: 'el-icon-star-off'
      }
    },
    watch: {
      route(evt){
        //判断切换柜子的时候，才要清掉星星样式
//        this.levelList = []
//        this.startCss = ''
      },
      $route() {
        //获取watchId，查看柜子是否被收藏


//        this.getBreadcrumb()
      },
      path(){
        if (!(this.$route.name.indexOf('personal') > -1)) {
          getWatchByGroup({ groupId: -parseInt(localStorage.groupId) }).then(res => {
            res = res.data
            this.watchId = res.watchId
            if (res.watchId !== 0) {
              this.startCss = 'el-icon-star-on'
            } else {
              this.startCss = 'el-icon-star-off'
            }
          })
        }
        this.getBreadcrumb()
      }
    },
    methods: {
      generateTitle,
      isPersonal(){
        if (this.$store.getters.personalGroupID === -(this.levelList[0].id)) {
          return true
        } else {
          return false
        }
      },
      getBreadcrumb() {
//        let matched = this.$route.matched.filter(item => item.name)
//        const first = matched[0]
//        if (first && first.name !== 'dashboard') {
//          matched = [{ path: '/dashboard', meta: { title: 'dashboard' } }].concat(matched)
//        }
        this.levelList = this.path
      },
      addWatch(){
        //添加收藏的方法
        if (this.startCss === 'el-icon-star-off') {
          this.startCss = 'el-icon-star-on'
          addWatch({ id: -parseInt(localStorage.groupId), type: 'group' }).then(res => {
            res = res.data
            if (res.success) {
              this.$message({
                type: 'success',
                message: '收藏成功'
              });
            }
          })
        } else {
          this.startCss = 'el-icon-star-off'
          deleteWatch({ id: this.watchId, type: 'group' }).then(res => {
            res = res.data
            if (res.success) {
              this.$message({
                type: 'success',
                message: '取消收藏成功'
              });
            }
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 12px !important;
    line-height: 40px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }

  .el-icon-star-on {
    color: #ffc224;
  }
</style>
