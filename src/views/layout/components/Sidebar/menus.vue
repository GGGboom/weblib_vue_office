<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="layoutTabs">
    <el-tab-pane label="我的资源" name="personal">
      <div class="menu-wrapper">
        <ul class="sidebarMenu">
          <li>
            <div :class="isActive === 0 ? 'active' : ''" @click="redirectToPersonal(0)">
              <svg-icon icon-class="my-16px" class="icon" />
              <span>我的文件</span>
            </div>
            <ul>
              <li>
                <div :class="isActive === 1 ? 'active' : ''" @click="redirectToPersonalFilter(1)">
                  <svg-icon icon-class="photo-16px" class="icon" />
                  <span>图片</span></div>
              </li>

              <li>
                <div :class="isActive === 2 ? 'active' : ''" @click="redirectToPersonalFilter(2)">
                  <!--<svg-icon icon-class="doc-16px" class="icon" />-->
                  <i style="font-size:20px" class="el-icon-document"></i>
                  <span>文档</span></div>
              </li>

              <li>
                <div :class="isActive === 3 ? 'active' : ''" @click="redirectToPersonalFilter(3)">
                  <svg-icon icon-class="video-16px" class="icon" />
                  <span>媒体</span></div>
              </li>
            </ul>
          </li>
          <li>
            <div :class="isActive === 5 ? 'active' : ''" @click="redirectToPersonalFilter(5)">
              <svg-icon icon-class="receiving-16px" class="icon" />
              <span><el-badge :value="count" class="item">我的接收</el-badge></span>
            </div>
          </li>
          <li>
            <div :class="isActive === 6 ? 'active' : ''" @click="redirectToPersonalFilter(6)">
              <svg-icon icon-class="share-16px" class="icon" />
              <span>我的分享</span></div>
          </li>
          <li>
            <div :class="isActive === 7 ? 'active' : ''" @click="redirectToPersonalFilter(7)">
              <svg-icon icon-class="star-16px" class="icon" />
              <span>我的收藏</span></div>
          </li>
          <li>
            <div :class="isActive === 4 ? 'active' : ''" @click="redirectToPersonalFilter(4)">
              <svg-icon icon-class="contact-16px" class="icon" />
              <span>通讯录</span></div>
          </li>
          <li>
            <div :class="isActive === 8 ? 'active' : ''" @click="redirectToPersonalFilter(8)">
              <svg-icon icon-class="user" class="icon" />
              <span>个人信息</span></div>
          </li>
          <!--<li>-->
            <!--<div :class="isActive === 8 ? 'active' : ''" @click="redirectToPersonalFilter(8)">-->
              <!--<svg-icon icon-class="team" class="icon" />-->
              <!--<span><a style="display:inline !important;" href="http://baidu.com" target="_blank">学习平台</a></span></div>-->
          <!--</li>-->


        </ul>
      </div>
    </el-tab-pane>
    <el-tab-pane label="公共资源" name="public">
      <tree :nodeClick="handleNodeClick" v-if="isShow"></tree>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import Tree from './tree.vue'
  import request from '../../../../utils/request.js'
  export default {
    name: 'sidebarMenus',
    components: { Tree },
    data(){
      return {
        activeName: 'personal',
        isShow: true,
        isActive: 0,
        count: 0
      }
    },
    watch: {
      '$route' (to, from) {
        //路由改变时判断当前的地址，然后跳转到当前tab
        if (to.path.indexOf('personal') >= 0) {
          this.activeName = 'personal'
          this.menuActive(to.path)
        } else {
          this.activeName = 'public'
        }
        if (to.name === 'contact') {
          this.isShow = false
        }
        if (to.name === 'publicMain') {
          this.isShow = true
        }
      },
      myReceiveCount(val){
        this.count = val
      }
    },
    computed: {
      myReceiveCount() {
        return this.$store.getters.newReceiveCount
      }
    },
    created(){
        request({
            url: '/group/getMyNewReceiveCount',
            method: 'post',
        }).then(res=>{
          const data=res.data
          this.count=data.count
        })
        console.log("更新我的接收")
//      //显示树
//      this.$root.$on('show-tree-callback', () => {
//        this.isShow = true
//      })
      //刷新时判断当前的地址，然后跳转到当前tab
      if (this.$route.path.indexOf('personal') >= 0) {
        this.activeName = 'personal'
        this.menuActive(this.$route.path)
      } else {
        this.activeName = 'public'
      }
    },
    methods: {
      menuActive(url){
        //用于菜单的active class 标亮显示
        if (url.indexOf('pic') >= 0) {
          this.isActive = 1
        } else if (url.indexOf('doc') >= 0) {
          this.isActive = 2
        } else if (url.indexOf('media') >= 0) {
          this.isActive = 3
        } else if (url.indexOf('contact') >= 0) {
          this.isActive = 4
        } else if (url.indexOf('receive') >= 0) {
          this.isActive = 5
        } else if (url.indexOf('sent') >= 0) {
          this.isActive = 6
        } else if (url.indexOf('favorite') >= 0) {
          this.isActive = 7
        } else if(url.indexOf('info')>=0){
            this.isActive = 8
        } else {
          this.isActive = 0
        }
      },
      handleClick(view){
        this.$store.dispatch('SetTableSelection', undefined)
        if (view.index === '0') {
          if (this.$route.path.indexOf('personal') < 0) {
            this.$router.push({ path: '/personal/main/' + -this.$store.getters.personalGroupID })
            this.isShow = false
          }
        } else {
          if (this.$route.path.indexOf('public') < 0) {
            this.isShow = true
            this.$router.push({ path: '/public/welcome' })
          }
        }
      },
      handleNodeClick(data){
        if (data.type === 'group') {
          this.$router.push({ path: '/public/main/' + -data.id })
          this.$store.dispatch('SetGroupID', data.id)
        }
      },
      redirectToPersonalFilter(num){
        //菜单跳转
        this.isActive = num
        switch (num) {
          case 1:
            this.$router.push({ path: '/personal/filter/pic' })
            break;
          case 2:
            this.$router.push({ path: '/personal/filter/doc' })
            break;
          case 3:
            this.$router.push({ path: '/personal/filter/media' })
            break;
          case 4:
            this.$router.push({ path: '/personal/contact' })
            break;
          case 5:
            this.$router.push({ path: '/personal/receive' })
            break;
          case 6:
            this.$router.push({ path: '/personal/sent' })
            break;
          case 7:
            this.$router.push({ path: '/personal/favorite' })
//            this.$root.$emit('open-favorite-dialog', { visible: true })
            break;
          case 8:
            this.$router.push({path:'/personal/info',query:{id:this.$store.getters.personalGroupID}})

            break;

        }
      },
      redirectToPersonal(num){
        this.isActive = num
        this.$router.push({ path: '/' })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-tabs /deep/ {
    height: calc(100% - 40px) !important;
    display: flex;
    flex-flow: column nowrap;
    .el-tabs__header {
      flex: 0 0 40px;
    }
    .el-tabs__content {
      flex: 1 1 auto;
      display: flex;
      flex-flow: column nowrap;
    }
    .el-tab-pane {
      flex: 1 1 auto;
      overflow: auto;
      display: flex;
      flex-flow: column nowrap;
    }
    .menu-wrapper {
      font-size: 12px;
      .sidebarMenu {
        margin: 0;
        padding-left: 20px;
        /*font-size: 14px;*/
        div {
          height: 40px;
          line-height: 40px;
          cursor: pointer;
        }
        div:hover {
          color: #409EFF;
        }
        ul {
          margin: 0;
          padding-left: 20px;
        }
        li {
          list-style: none;
          margin: 0;
          padding: 0;
        }
      }
      .active {
        color: #409EFF;
        font-weight: bold;
      }
    }
    .el-badge__content {
      left: -28px !important;
      background: #f56c6c !important;
    }
    .svg-icon {
      font-size: 20px;
      position: relative;
      top: 2px;
    }
  }
</style>
