<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <el-row style="height: 37px;">
        <el-col :span="8">
          &nbsp;
          <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
        </el-col>
        <el-col :span="8">
          <el-button style="position:relative;top:1px;" class="topBtn" size="mini" type="info" v-if="isVisible" plain
                     icon="el-icon-arrow-left" @click="goBack">返回
          </el-button>

          <!--<router-link to="/personal/contact" v-if="permission.contact">-->
          <!--<el-button class="topBtn" type="info" size="mini" title="通讯录" style="position:relative;top:1px;">-->
          <!--<svg-icon icon-class="contact-white" class="icon" style="color:#fff;" />-->
          <!--</el-button>-->
          <!--</router-link>-->


          <el-button-group>
            <el-button title="新建文件夹" v-if="permission.add" type="primary" icon="el-icon-plus" size="mini"
                       @click="openNewFolderDialog" class="topBtn"></el-button>
          </el-button-group>

          <el-button-group>

            <el-button class="topBtn" type="primary"
                       @click="openUploadDialog2()"
                       v-if="permission.upload" icon="el-icon-upload" size="mini" title="断点续传"></el-button>
            <el-button class="topBtn" v-if="permission.upload" type="primary" icon="el-icon-upload2" size="mini"
                       @click="openUploadDialog" title="上传"></el-button>
            <el-button class="topBtn" title="下载" icon="el-icon-download" v-if="permission.download" @click="download()"
                       type="primary"
                       size="mini">
            </el-button>
          </el-button-group>


          <el-button-group>

            <el-button class="topBtn" title="恢复到" v-if="permission.recover" type="primary" size="mini"
                       @click="recoverResources">
              <svg-icon iconClass="recover" style="font-size:16px;"></svg-icon>
            </el-button>

            <el-button title="彻底删除" v-if="permission.realDel" type="primary" icon="el-icon-delete" size="mini"
                       @click="realDeleteResources" class="topBtn"></el-button>


            <el-button title="移到回收站" v-if="permission.del" type="primary" icon="el-icon-delete" size="mini"
                       @click="deleteResources" class="topBtn"></el-button>
            <el-button title="删除" v-if="permission.deleteReceive" type="primary" icon="el-icon-delete" size="mini"
                       @click="deleteReceive" class="topBtn"></el-button>
            <el-button title="删除" v-if="permission.deleteShare" type="primary" icon="el-icon-delete" size="mini"
                       @click="deleteShare" class="topBtn"></el-button>

          </el-button-group>


          <el-dropdown @command="handleCommand" trigger="click" v-if="permission.more">
            <el-button title="更多" type="primary" icon="el-icon-more" size="mini"
                       style="position:relative;top:1px;" class="topBtn"></el-button>
            <el-dropdown-menu slot="dropdown" style="width:80px;">
              <el-dropdown-item command="4" v-if="permission.download">下载</el-dropdown-item>
              <el-dropdown-item divided v-if="permission.edit" command="0">编辑</el-dropdown-item>
              <el-dropdown-item v-if="permission.move" command="1">移动</el-dropdown-item>
              <el-dropdown-item v-if="permission.copy" command="2">复制</el-dropdown-item>
              <el-dropdown-item divided v-if="permission.share" command="3">站内分享</el-dropdown-item>
              <el-dropdown-item divided v-if="permission.share" command="5">外链分享</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="8">

          <div class="right-menu">
            <!--<error-log class="errLog-container right-menu-item"></error-log>-->
            <el-dropdown class="avatar-container right-menu-item" trigger="click">
              <div class="avatar-wrapper">
                <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
                <el-button size="mini">{{userName}}<i
                  class="el-icon-caret-bottom el-icon--right"></i></el-button>
              </div>
              <el-dropdown-menu slot="dropdown" style="width:100px;">
                <!--<router-link to="/">-->
                <!--<el-dropdown-item>-->
                <!--{{$t('navbar.dashboard')}}-->
                <!--</el-dropdown-item>-->
                <!--</router-link>-->
                <!--<a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">-->
                <!--<el-dropdown-item>-->
                <!--{{$t('navbar.github')}}-->
                <!--</el-dropdown-item>-->
                <!--</a>-->

                <!--<el-dropdown-item>-->
                <!--<span @click="openFavoriteDialog" style="display:block;">收藏夹</span>-->
                <!--</el-dropdown-item>-->
                <!--<div v-if="isAdmin">-->
                  <!--<el-dropdown-item>-->
                    <!--<a href="/pages/c/manager/" target="_blank" style="display:block;">管理端</a>-->
                  <!--</el-dropdown-item>-->
                  <!--<el-dropdown-item>-->
                    <!--<a href="/pages/c/manager0824/#/manager/usermanagement" target="_blank"-->
                       <!--style="display:block;">管理端</a>-->
                  <!--</el-dropdown-item>-->
                <!--</div>-->
                <el-dropdown-item>
                  <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>


          <!--<el-button class="fr" icon="el-icon-search" circle size="mini"></el-button>-->

          <!--<el-input placeholder="请输入文件名" style="width:210px;margin-top:6px;"-->
          <!--size="mini" class="input-with-select fr">-->
          <!--<el-select v-model="searchOption" slot="prepend" placeholder="请选择">-->
          <!--<el-option label="本库" value="1"></el-option>-->
          <!--<el-option label="全库" value="2"></el-option>-->
          <!--</el-select>-->
          <!--&lt;!&ndash;<i slot="prefix" class="el-input__icon el-icon-search"></i>&ndash;&gt;-->
          <!--</el-input>-->

          <search ref="search"></search>
        </el-col>
      </el-row>
      <!--<breadcrumb class="breadcrumb-container"></breadcrumb>-->
    </el-menu>
    <!--搜索组件-->

    <!--上传对话框-->
    <uploadDialog></uploadDialog>

    <!--新建文件夹对话框-->
    <newFolderDialog></newFolderDialog>

    <!--编辑对话框-->
    <edit-dialog></edit-dialog>

    <!--复制对话框-->
    <copy-dialog></copy-dialog>

    <!--移动对话框-->
    <move-dialog></move-dialog>

    <!--复制对话框-->
    <share-dialog></share-dialog>

    <!--恢复对话框-->
    <recover-dialog></recover-dialog>

    <!--链接分享对话框-->
    <share-link-dialog></share-link-dialog>

    <!--收藏夹对话框-->
    <favorite-dialog></favorite-dialog>
    <upload-dialog2></upload-dialog2>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import UploadDialog from './Dialog/uploadDialog'
  import NewFolderDialog from './Dialog/newFolderDialog'
  import EditDialog from './Dialog/editDialog'
  import CopyDialog from './Dialog/copyDialog'
  import MoveDialog from './Dialog/moveDialog'
  import ShareDialog from './Dialog/shareDialog'
  import FavoriteDialog from './Dialog/favoriteDialog'
  import RecoverDialog from './Dialog/recoverDialog'
  import ShareLinkDialog from './Dialog/shareLinkDialog'
  import Search from './Search.vue'
  import { getTrees,getGroupPermission } from '@/api/resources'
  import { isChooseOne, isChoose } from '@/utils/index'
  import ElButtonGroup from '../../../../node_modules/element-ui/packages/button/src/button-group'
  import UploadDialog2 from "./Dialog/uploadDialog2";

  export default {
    name: 'NavBar',
    data(){
      return {
        userName: this.$store.getters.account,
        searchOption: 1,
        isShowUploadDialog: false,
        isVisible: false,
        isAdmin: false,
        permission: {
          upload: false,
          add: false,
          del: false,
          more: false,
          copy: false,
          move: false,
          share: false,
          edit: false,
          recover: false,
          realDel: false,
          deleteReceive: false,
          deleteShare: false,
          contact: false,
          download: false
        }
      }
    },
    components: {
        UploadDialog2,
      ElButtonGroup,
      FavoriteDialog,
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Search,
      UploadDialog,
      NewFolderDialog,
      EditDialog,
      CopyDialog,
      MoveDialog,
      ShareDialog,
      RecoverDialog,
      ShareLinkDialog
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar'
      ])
    },
    watch: {
      '$route'(to, from){
        if (to.name === 'search') {
          this.isVisible = true
        } else {
          this.isVisible = false
        }
        //判断顶层菜单显示隐藏
        this.menusShowFunc(to)
      },
      permission(val){
        this.$store.dispatch('SetPerm', val)
      }
    },
    created(){
      if (this.$store.getters.isAdmin) {
        this.isAdmin = true
      }
      this.menusShowFunc(this.$route)
      window.isUpload = true
      document.body.addEventListener("dragenter", (event) => {
        if (!window.isSorting) {
          if (this.permission.upload) {
            if (window.isUpload) {
              this.openUploadDialog()
              window.isUpload = false
            }
          }
        }
      })

      if (this.$route.name === 'search') {
        this.isVisible = true
      } else {
        this.isVisible = false
      }
      this.$root.$on('recycle-pem', () => {
        this.recyclePem()
      })
      this.$root.$on('personal-pem', () => {
        this.personalMainPem()
      })
      this.$root.$on('download', () => {
        this.download()
      })
      window.logout = () => {
        this.logout()
      }
    },
    methods: {
      menusShowFunc(to){
        //判断顶层菜单显示隐藏
        switch (to.name) {
          case'personalMain':
            this.personalMainPem()
            break
          case 'publicWelcome':
            this.publicWelcomePem()
            break
          case 'publicMain':
            this.publicMainPem()
            break
          case 'personalFilter' :
            this.personalFilterPem()
            break
          case 'contact':
            this.contactPem()
            break
          case 'receive':
            this.receivePem()
            break
          case 'sent':
            this.sentPem()
            break
          case 'search':
            this.searchPem()
            break
          case 'info':
            this.infopem()
            break
        }
      },
        //个人信息页面 各按钮不显示
      infopem(){
            this.permission = {
                upload: false,
                add: false,
                del: false,
                more: false,
                copy: false,
                move: false,
                share: false,
                edit: false,
                deleteReceive: false,
                deleteShare: false,
                contact: false,
                download: false
            }
        },
      sentPem(){
        //我的发送按钮权限
        this.permission = {
          upload: false,
          add: false,
          del: false,
          more: false,
          copy: false,
          move: false,
          share: false,
          edit: false,
          deleteReceive: false,
          deleteShare: true,
          contact: true,
          download: false
        }
      },
      receivePem(){
        //我要接收按钮权限
        this.permission = {
          upload: false,
          add: false,
          del: false,
          more: false,
          copy: false,
          move: false,
          share: false,
          edit: false,
          deleteReceive: true,
          deleteShare: false,
          contact: true,
          download: false
        }
      },
      publicWelcomePem(){
        //欢迎页按钮权限
        this.permission = {
          upload: false,
          add: false,
          del: false,
          more: false,
          copy: false,
          move: false,
          share: false,
          edit: false,
          deleteReceive: false,
          deleteShare: false,
          contact: false,
          download: false
        }
      },
      publicMainPem(){
       // this.personalMainPem()
        //公共资源库权限判断
        // getTrees({
        //     containAblumCategory: false,
        //         containPersonGroup: false,
        //     categoryId: localStorage.fileid
        // }).then(res => {
        //   res = res.data
        //     //group=res.group
        //     console.log("测试")
        //     console.log(res)
        //     var group=localStorage.group
        //     for(var i=0;i<group.length;i++){
        //         console.log(group[i].id+'...'+Math.abs(localStorage.guiziid))
        //         if (group[i].id==Math.abs(localStorage.guiziid)){
        //             console.log("比对成功")
        //             this.permission = {
        //                 upload: group[i].upload,
        //                 add: group[i].addDir,
        //                 del: group[i].delete,
        //                 more: true,
        //                 copy: true,
        //                 move: group[i].modify,
        //                 share: true,
        //                 edit: group[i].modify,
        //                 deleteReceive: false,
        //                 deleteShare: false,
        //                 contact: true,
        //                 download: true
        //             }
        //         }
        //     }
        //
        //
        // })
        //     if(localStorage.fenleiid!=localStorage.parentid){
        //             console.log("换分类")
        //             localStorage.setItem('fenleiid',localStorage.parentid)
        //             getTrees({
        //                 containAblumCategory: false,
        //                 containPersonGroup: false,
        //                 categoryId: localStorage.parentid
        //             }).then(res=>{
        //                 var group1=JSON.stringify(res.data.group)
        //                 localStorage.setItem('group',group1)
        //                 var group=res.data.group
        //         for (var i = 0; i < group.length; i++) {
        //             //   console.log(group[i].id + '...' + Math.abs(localStorage.guiziid))
        //             if (Math.abs(group[i].id) ==Math.abs(localStorage.guiziid)) {
        //                 console.log("比对成功")
        //                 this.permission = {
        //                     upload: group[i].upload,
        //                     add: group[i].addDir,
        //                     del: group[i].delete,
        //                     more: true,
        //                     copy: true,
        //                     move: group[i].modify,
        //                     share: true,
        //                     edit: group[i].modify,
        //                     deleteReceive: false,
        //                     deleteShare: false,
        //                     contact: true,
        //                     download: true
        //                 };
        //
        //             }
        //         }
        //         })
        //         }else{
        //         var group = JSON.parse(localStorage.group)
        //         for (var i = 0; i < group.length; i++) {
        //             //   console.log(group[i].id + '...' + Math.abs(localStorage.guiziid))
        //             if (Math.abs(group[i].id) ==Math.abs(localStorage.guiziid)) {
        //                 console.log("比对成功")
        //                 this.permission = {
        //                     upload: group[i].upload,
        //                     add: group[i].addDir,
        //                     del: group[i].delete,
        //                     more: true,
        //                     copy: true,
        //                     move: group[i].modify,
        //                     share: true,
        //                     edit: group[i].modify,
        //                     deleteReceive: false,
        //                     deleteShare: false,
        //                     contact: true,
        //                     download: true
        //                 };
        //
        //             }
        //         }
        //     }
            getTrees({
                containAblumCategory: false,
                containPersonGroup: false,
                categoryId: localStorage.parentid
            }).then(res=>{
                var group=res.data.group
            for (var i = 0; i < group.length; i++) {
                //   console.log(group[i].id + '...' + Math.abs(localStorage.guiziid))
                if (Math.abs(group[i].id) ==Math.abs(localStorage.guiziid)) {
                    console.log("比对成功")
                    this.permission = {
                        upload: group[i].upload,
                        add: group[i].addDir,
                        del: group[i].delete,
                        more: true,
                        copy: true,
                        move: group[i].modify,
                        share: true,
                        edit: group[i].modify,
                        deleteReceive: false,
                        deleteShare: false,
                        contact: true,
                        download: true
                    };

                }
            }
        })
        },
      searchPem(){
        this.permission = {
          upload: false,
          add: false,
          del: true,
          more: true,
          copy: true,
          move: true,
          share: true,
          edit: true,
          deleteReceive: false,
          deleteShare: false,
          contact: true,
          download: false
        }
      },
      personalMainPem(){
        //个人资源按钮权限
        this.permission = {
          upload: true,
          add: true,
          del: true,
          more: true,
          copy: true,
          move: true,
          share: true,
          edit: true,
          deleteReceive: false,
          deleteShare: false,
          contact: true,
          download: true
        }
      },
      personalFilterPem(){
        //个人资源过滤按钮权限
        this.permission = {
          upload: false,
          add: false,
          del: true,
          more: true,
          copy: true,
          move: true,
          share: true,
          edit: true,
          deleteReceive: false,
          deleteShare: false,
          contact: true,
          download: true
        }
      },
      recyclePem(){
        //个人资源过滤按钮权限
        this.permission = {
          upload: false,
          add: false,
          del: false,
          more: false,
          copy: false,
          move: false,
          share: false,
          edit: false,
          recover: true,
          realDel: true,
          deleteReceive: false,
          deleteShare: false,
          contact: false,
          download: false
        }
      },
      contactPem(){
        //通讯录按钮权限
        this.permission = {
          upload: false,
          add: false,
          del: false,
          more: false,
          copy: false,
          move: false,
          share: false,
          edit: false,
          deleteReceive: false,
          deleteShare: false,
          contact: false,
          download: false
        }
      },
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      openUploadDialog(){
        this.$root.$emit('open-upload-dialog', { visible: true })
      },
      openUploadDialog2(){
        console.log("点击断点续传")
        this.$root.$emit('open-upload-dialog2', { visible: true })
            console.log("点击断点续传1111")
      },
      openNewFolderDialog(){
        this.$root.$emit('open-new-folder-dialog', { visible: true })
      },
      openCopyDialog(){
        this.$root.$emit('open-copy-dialog', { visible: true })
      },
      openMoveDialog(){
        this.$root.$emit('open-move-dialog', { visible: true })
      },
      openEditDialog(){
        this.$root.$emit('open-edit-dialog', { visible: true })
      },
      openShareDialog(){
        this.$root.$emit('open-share-dialog', { visible: true })
      },
      openLinkShareDialog(){
        this.$root.$emit('open-linkShare-dialog', { visible: true })
      },
      openRecoverDialog(){
        this.$root.$emit('open-recover-dialog', { visible: true })
      },
      goBack(){
        if (localStorage.backPath !== undefined) {
          this.$router.push({ path: localStorage.backPath })
        } else {
          this.$router.push('/')
        }
      },
      deleteResources(){
        if (isChoose(this)) {
          this.$root.$emit('delete-resources-callback')
        }
      },
      deleteReceive(){
        this.$root.$emit('delete-receive-callback')
      },
      deleteShare(){
        this.$root.$emit('delete-share-callback')
      },
//      isChooseOne(){
//        const _tableSelections = this.$store.getters.resources.tableSelections
//        if (_tableSelections === undefined) {
//          this.$message({ showClose: true, message: '请选择一个操作项！', type: 'warning', duration: 3000 })
//          return false
//        } else if (_tableSelections.length > 1) {
//          this.$message({ showClose: true, message: '抱歉，本操作只能单选！', type: 'warning', duration: 3000 })
//          return false
//        } else {
//          return true
//        }
//      },
//      isChoose(){
//        const _tableSelections = this.$store.getters.resources.tableSelections
//        if (_tableSelections === undefined || _tableSelections.length === 0) {
//          this.$message({ showClose: true, message: '请选择一个操作项！', type: 'warning', duration: 3000 })
//          return false
//        } else {
//          return true
//        }
//      },
      handleCommand(command){
        switch (parseInt(command)) {
          case 0 :
            if (isChooseOne(this)) {
              this.openEditDialog()
            }
            break
          case 1 :
            if (isChoose(this)) {
              this.openMoveDialog()
            }
            break
          case 2 :
            if (isChoose(this)) {
              this.openCopyDialog()
            }
            break
          case 3 :
            if (isChoose(this)) {
              this.openShareDialog()
            }
            break
          case 4 :
            this.download()
            break
          case 5 :
            if (isChooseOne(this)) {
              this.openLinkShareDialog()
            }
            break
        }
      },
      recoverResources(){
        if (isChoose(this)) {
          this.openRecoverDialog()
          this.$root.$emit('handle-recover-resources')
        }
      },
      realDeleteResources(){
        if (isChoose(this)) {
          this.$root.$emit('handle-realDelete-resources')
        }
      },
      download(){
          console.log("右键下载")
        let _tableSelections = this.$store.getters.resources.tableSelections
        if (isChoose(this)) {
          _tableSelections = _tableSelections.map(item => {
            return item.id
          })
          location.href = process.env.BASE_API + '/group/downloadResource_v2?id=' + _tableSelections.join('&id=')
        }
      },
      openFavoriteDialog(){
        this.$root.$emit('open-favorite-dialog', { visible: true })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 40px;
    line-height: 36px;
    border-radius: 0px !important;
    .topBtn {
      padding: 5px 13px !important;
      font-size: 14px !important;
      height: 28px !important;
      box-sizing: border-box;
    }
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
    }
  }

  .input-with-select /deep/ {
    .el-input-group__prepend {
      background-color: #fff;
      width: 80px;
    }
  }
</style>
