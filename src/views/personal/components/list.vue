<template>
  <div class="flexBox resourceList">
    <div class="breadcrumbWrap flexHeader">
      <breadcrumb class="breadcrumb-container" :path="path"></breadcrumb>
      <el-button
          :class="{'btnActive':isPhotoView,'btnDefault':!isPhotoView}"
          @click="togglePhotoView" icon="el-icon-menu" size="mini"
          style="float:right;position:relative;top:5px;right:5px;"></el-button>
      <!--<span style="line-height:40px;color:#606266;font-size:14px;"-->
      <!--v-if="isSearch">搜索关键字:{{searchParams.query}}</span>-->
    </div>
    <div class="flexBody">
      <el-table v-contextmenu:contextmenu ref="table" v-if="!isPhotoView" :data="tableData" tooltip-effect="dark"
                :key='0' :row-class-name="tableRowClassName"
                v-loading="loading"
                @selection-change="handleSelectionChange" style="width: 100%" @row-contextmenu="contextmenuCallback">
        <div class="empty" slot="empty">{{ emptyText }}</div>
        <el-table-column type="selection" width="35">
        </el-table-column>
        <el-table-column label="文件名">
          <template slot-scope="scope">
            <div>
            <span style="cursor: pointer" v-if="scope.row.type === 1 || scope.row.type === 'folder'"
                  @click="handleFileClick(scope.row)">
              <!--<i class="el-icon-message"></i>-->
              <svg-icon icon-class="folder" class="icon"/>
              <a href="javascript:void(0)" v-html="scope.row.displayName"></a>
            </span>
              <span v-if="scope.row.type === 2 || scope.row.type === 'file'">
              <i class="el-icon-document"></i>

              <a v-if="getNamenail(scope.row)=='pdf'&&thumbnail(scope.row) !== 'pic'" v-html="scope.row.displayName"
                 @dblclick="handleshowpdf(scope.row.id)"></a>
                <!--<a v-if="thumbnail(scope.row) !== 'pic'" href="#" @dblclick="handleDownload(scope.row.id)"-->
                <!--v-html="scope.row.displayName"> </a>-->

               <a v-else-if="getNamenail(scope.row)=='doc'||getNamenail(scope.row)=='txt'"
                  v-html="scope.row.displayName" @dblclick="preview(scope.row)"></a>
              <a href="#" style="cursor: pointer" v-else-if="thumbnail=='pic'" @click="openGallery(scope.row)"
                 v-html="scope.row.displayName"></a>
              <a v-else v-html="scope.row.displayName" @dblclick="handleDownload(scope.row.id)"></a>
            </span>
              <span v-if="scope.row.type === 3">
              <i class="el-icon-view"></i>
              <a :href="scope.row.linkPath" target="_blank" v-html="scope.row.displayName"></a>
            </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="180" label="上传时间">
          <template slot-scope="scope">
            <div style="text-align:center">
              <span>{{ scope.row.creationDate }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="文件大小" width="100">
          <template slot-scope="scope">
            <div style="text-align: right">
              <span>{{ scope.row.size | fileSize }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="100" label="创建者">
          <template slot-scope="scope">
            <div style="text-align:center">
              <span>{{ scope.row.memberName }}</span>
            </div>
          </template>
        </el-table-column>


        <el-table-column label="备注" width="100" style="text-align:center">
          <template slot-scope="scope">
            <div>
              <span :title="scope.row.desc" v-html="scope.row.desc === '' ? '&nbsp;' : scope.row.desc"
                    style="white-space: nowrap"></span>
            </div>
          </template>
        </el-table-column>

      </el-table>
      <!--<div class="show-d">{{ $t('table.dragTips1') }} : &nbsp; {{ oldList }}</div>-->
      <!--<div class="show-d">{{ $t('table.dragTips2') }} : {{ newList }}</div>-->

      <div id="photoView" v-if="isPhotoView">
        <el-row :gutter="20" v-if="!isToggle">
          <el-col :span="24" v-if="tableData === undefined || tableData.length === 0"
                  style="text-align:center;padding:20px;font-size:12px;">
            <span style="color:#909399">暂无数据</span>
          </el-col>
          <el-checkbox-group v-model="checkList">
            <el-col :xs="4" :sm="4" :md="4" :lg="3" v-for="item in tableData" :key="item.id">
              <div class="grid-content bg-purple" style="text-align:center">
                <div class="picBox">
                  <el-checkbox :label="item" :key="item.id"></el-checkbox>
                  <!--<div style="cursor: pointer" v-if="item.type === 1 || item.type==='folder'" class="picWrap"-->
                  <!--v-lazy:background-image="thumbnail(item)" @click="handleFileClick(item)"></div>-->
                  <!--<div class="picWrap"-->
                  <!--v-lazy:background-image="thumbnail(item)" v-else></div>-->
                  <div v-if="thumbnail(item) !== 'pic'">
                    <div class="picWrap" v-if="item.type === 1 || item.type==='folder'"
                         v-lazy:background-image="thumbnail(item)" @click="handleFileClick(item)"
                         style="cursor: pointer"></div>
                    <div class="picWrap" v-else
                         v-lazy:background-image="thumbnail(item)"></div>
                  </div>

                  <div class="picWrap" v-else
                       v-lazy:background-image="thumbnailCompoted(item)"
                       :style="{background:'#f1f1f1'}" style="cursor: pointer" @click="openGallery(item)"></div>


                  <div class="picTitle" style="margin-top:10px;" v-html="item.displayName"
                       :title="item.displayName">
                  </div>
                </div>
              </div>
            </el-col>
          </el-checkbox-group>
        </el-row>
      </div>


    </div>
    <div class="pagination-container flexFooter">
      <el-row style="padding:0 20px">
        <div style="height:3px"></div>
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <el-pagination v-if="isPaging" align="left" background @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           :total="total"
                           :current-page.sync="currentPage"
                           :page-size="listQuery.limit" :page-sizes="[40,60,80]"
                           layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light fr">
            <el-button v-if="showRecycle" @click="goToRecycle" class="fr" type="text"
                       style="position: relative;top:-3px;">
              <svg-icon iconClass="recycle" style="font-size:18px"></svg-icon>
              回收站
            </el-button>
          </div>
          <div v-if="showProcessBar" style="width:100px" class="fr"
               :title="progressText">
            <el-progress :percentage="percentage" :text-inside="true" :stroke-width="13"
                         color="rgb(146, 239, 85)"
                         style="margin-right:5px;positon:relative;top:10px;font-size:12px"></el-progress>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--图片灯箱-->
    <LightBox v-if="isLightBox" id="lightbox" :images="images" ref="lightbox"
              :show-caption="true"
              :show-light-box="false">
      <div><a href="javascript:void(0)">下载</a></div>
    </LightBox>

    <!--右键菜单-->
    <v-contextmenu ref="contextmenu" style="width:120px;">
      <v-contextmenu-item :disabled="!perm.open" @click="contextEvent(0)">打开</v-contextmenu-item>
      <v-contextmenu-item :disabled="!perm.download" @click="contextEvent(1)">下载</v-contextmenu-item>
      <v-contextmenu-item :disabled="!perm.download" @click="contextEvent(8)">预览</v-contextmenu-item>
      <v-contextmenu-item :disabled="!perm.download" @click="contextEvent(9)">编辑</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item :disabled="!perm.share" @click="contextEvent(2)">站内分享</v-contextmenu-item>
      <v-contextmenu-item :disabled="!(perm.share && perm.shareLink)" @click="contextEvent(3)">外链分享</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item :disabled="!perm.move" @click="contextEvent(4)">复制到</v-contextmenu-item>
      <v-contextmenu-item :disabled="!perm.copy" @click="contextEvent(5)">移动到</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item :disabled="!perm.edit" @click="contextEvent(6)">编辑</v-contextmenu-item>
      <v-contextmenu-item :disabled="!perm.del" @click="contextEvent(7)">删除</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  getResources,
  deleteResource,
  recycleResource,
  getThumbnail,
  searchResources,
  cancelGetThumbnail,
  getResourceSize,
  modifyResourceOrder,
  downloadResources
} from '@/api/resources'
import Breadcrumb from '@/components/Breadcrumb'
import {mapGetters} from 'vuex'
import contentmenu from 'v-contextmenu'
import ICON from '@/utils/icon'
import LightBox from 'vue-image-lightbox'
import VueLazyload from 'vue-lazyload'
import {isChooseOne, isChoose} from '@/utils/index'
import Sortable from 'sortablejs'
import 'v-contextmenu/dist/index.css'
import request from '../../../utils/request'

require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
Vue.use(VueLazyload)
Vue.use(contentmenu)
export default {
  name: 'list',
  components: {
    Breadcrumb, LightBox
  },
  props: {
    listType: {
      type: String
    }
  },
  created() {

    console.log("打印" + this)

    this.$root.$on('create-dir-callback', this.refreshListCallback)
    this.$root.$on('delete-resources-callback', this.recycleResource)
    this.$root.$on('edit-success-callback', this.refreshListCallback)
    this.$root.$on('handle-realDelete-resources', this.deleteResource)
    this.$root.$on('move-success-callback', this.refreshListCallback)
    this.$root.$on('copy-success-callback', this.refreshListCallback)
    this.$root.$on('recover-success-callback', this.refreshListCallback)

//      this.perm = Object.assign({}, this.perm, this.$store.getters.resources.perm) //右键菜单权限


    if (this.$route.name === 'personalFilter') {
      this.searchResources(this.$route.params.id)
    } else {
      this.listQuery.start = 0
      if (this.$store.state.resources.pageNum !== null) {
        this.listQuery.start = (this.$store.state.resources.pageNum - 1) * this.listQuery.limit
        this.currentPage = this.$store.state.resources.pageNum
        this.$store.dispatch('SetPageNum', null)
      }
      this.initLodaData(this.$route.params.id)
      this.getSize(this.$route.name)
    }

    this.perm = Object.assign({}, this.perm, this.$store.getters.resources.perm)

  },
  computed: {
    searchResults() {
      return this.resources.searchResults
    },
    isSearch() {
      return this.resources.isSearch
    },
    searchParams() {
      return this.resources.searchParams
    },
    ...mapGetters([
      'resources', 'personalGroupID'
    ])
  },
  watch: {
    '$route'(to, from) {
      this.perm = this.$store.getters.resources.perm
      this.isPaging = false
      this.listQuery.start = 0 //切换页面重置页码
      this.currentPage = 1 //切换页面重置页码


      if (to.name === 'personalFilter') {
        this.searchResources(this.$route.params.id)
      } else {
        this.initLodaData(to.params.id)
        this.getSize(to.name)
      }
      this.id = to.params.id
      if (to.params.id > 0) {
        this.$store.dispatch('ClearSearch').then(res => {
        })
      }
    },
    '$store.getters.resources.perm'(val) {
      this.perm = val
    },
    searchResults(res) {
      const resources = res.resources
      this.tableData = []
      this.total = res.totalCount
      this.listLoading = false
      this.path = res.path
      this.$nextTick(() => {
        this.tableData = resources
      })
    },
    tableSelection(val) {
      if (val.length == 0) {
        val = undefined
      }
      this.$store.dispatch('SetTableSelection', val) //用vuex记录表格已选项

    },
    checkList(val) {
      this.$store.dispatch('SetTableSelection', val)
    },
    isPhotoView(val) {
      if (val) {
        if (this.isLoadingThumbnail) {
          //this.thumbnailByLazyLoad(this.tableData) //把图片ID暂存
        }
      }
    },
//      images(){
////        this.isLightBox = true
////        this.$nextTick(() => {
////          this.isLightBox = false
////        })
//      }
  },
  data() {
    return {
      config: null,
      pdfsrc: null,
      canSort: false,//是否可排序标识
      oldIndex: 0,
      sortable: null,
      oldList: [],
      newList: [],
      percentage: 0,
      tableData: null,
      tableSelection: [],
      total: null,
      dialogUpload: false,
      path: null,
      emptyText: '暂无数据',
      loading: false,
      showRecycle: false,
      isPhotoView: false,
      isLightBox: false,
      markRow: null,
      id: this.$route.params.id,//获取路由的当前groupId
      isPaging: true,//用于重置分页，分页初始化用
      checkList: [],
      markPhotosObj: [],//用来保存图片对象
      showProcessBar: false,
      progressText: '',
      currentPage: 0,
      rowIndex: 0,
      chooseRow: 'chooseRow',
      perm: {
        open: false,
        shareLink: false,
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
      },
      images: [
        {
          thumb: '',
          src: '',
          caption: ''
        }
      ],
      isToggle: false,
      listQuery: {
        start: 0,
        limit: 40,
        parentId: -this.personalGroupID
      }
    }
  },
  methods: {
    getSize(name) {
      this.showProcessBar = false
      let _id = this.personalGroupID
      if (name === 'publicMain') {
        _id = Math.abs(parseInt(localStorage.groupId))
      }
      getResourceSize({groupId: _id}).then(res => {
        this.showProcessBar = true
        res = res.data
        let {resourcesSize, totalSize} = res
        if (resourcesSize > totalSize) {
          resourcesSize = totalSize
        }
        this.percentage = parseFloat(((resourcesSize / totalSize) * 100).toFixed(2))

        this.progressText = this.$options.filters['fileSize'](resourcesSize) +
            ' / ' + this.$options.filters['fileSize'](totalSize)

      })
    },
    initLodaData(pid) {
      if (pid !== undefined) {
        this.listQuery.parentId = pid
        this.getResources()
      } else {
        this.listQuery.parentId = -this.personalGroupID
        this.getResources()
      }
    },
    getResources() {
      this.emptyText = ''
      this.loading = true
      this.isToggle = true
      this.$store.dispatch('SetTableSelection', undefined)
      getResources(this.listQuery).then(res => {
        this.isPaging = true
        this.isLightBox = true
        res = res.data
        this.path = res.path
        const resources = res.resources
        localStorage.groupId = res.path[0].id
//          this.$root.$emit('has-set-groupId')
        localStorage.groupName = res.path[0].displayName
        localStorage.recycleId = res.recyclerId
        this.total = res.totalCount
        if (this.path.length > 1 && this.path[1].displayName === '回收站') {
          this.$root.$emit('recycle-pem')
          this.showRecycle = false
        } else {
          this.$root.$emit('personal-pem')
          this.showRecycle = true
        }
        this.tableData = []

        this.$nextTick(() => {
          this.tableData = resources
          //排序列表
          this.oldList = this.tableData.map(v => v.id)
          this.newList = this.oldList.slice()
          this.$nextTick(() => {
            this.setSort()
            if (localStorage.queryResourceId !== undefined) {
              let _id = parseInt(localStorage.queryResourceId)
              let _tableData = this.tableData.map(item => {
                return item.id
              })
              this.setCurrentRow(_tableData.indexOf(_id) + 1)
              localStorage.removeItem('queryResourceId')
            }
//              setTimeout(() => {
//                this.sortable.option("disabled", true)
//              }, 500)
          })


//            if (this.isPhotoView) {

          this.thumbnailByLazyLoad(this.tableData) //把图片ID暂存
//            }


          if (this.tableData.length === 0) {
            this.emptyText = '暂无数据'
          }
          this.isToggle = false
          this.loading = false
        })
      })
    },
    handleCurrentChange(val) {

      if (this.$route.name !== 'personalFilter') {
        this.$store.dispatch('SetPageNum', val) //记住页码
      } else {
        this.$store.dispatch('SetPageNum', null) //记住页码
      }


      this.isLightBox = false

      cancelGetThumbnail() //取消正在获取Thumbnail的请求

      this.listQuery.start = (val - 1) * this.listQuery.limit

      if (this.$route.name === 'personalFilter') {
        this.searchResources(this.id)
      } else {
        this.getResources()
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      if (this.$route.name === 'personalFilter') {
        this.searchResources(this.id)
      } else {
        this.getResources()
      }
    },
    handleDownload(id) {

      console.log("下载")
      console.log("id" + id)
      /* downloadResources({ id }).then(res => {
         let blob = new Blob([res], { type: res.type })
         let downloadElement = document.createElement('a')
         let href = window.URL.createObjectURL(blob); //创建下载的链接
         downloadElement.href = href;
         downloadElement.download = fileName; //下载后文件名
         document.body.appendChild(downloadElement);
         downloadElement.click(); //点击下载
         document.body.removeChild(downloadElement); //下载完成移除元素
         window.URL.revokeObjectURL(href); //释放blob对象
       })*/
      location.href = process.env.BASE_API + '/group/downloadResource_v2?id=' + id


    },
    preview(row) {
      var item_id = row.id;
      var filename = row.displayName;
      // var originurl="http://cshyang.vip.qydev.com/group/downloadResource_v2?id="+id;
      // var previewurl=originurl+'&fullfilename='+name;
      // console.log(previewurl)
      // window.open('http://106.52.57.15:8016/onlinePreview?url='+encodeURIComponent(previewurl));
      request({
        url: '/group/onlineview',
        //url:'user/getProfilePic.action',
        method: 'post',
        params: {
          id: item_id
        }
      }).then(response => {
            var url = "http://cshyang.vip.qydev.com/static/" + filename;
            window.open('http://106.52.57.15:8016/onlinePreview?url=' + encodeURIComponent(url));
          }
      ).catch((err) => {
        console.log("err")
      })

    },
    handleshowpdf(val) {
      window.open(process.env.BASE_API + '/group/downloadResource_v2?id=' + val + '&isInline=1')
      //  location.href = process.env.BASE_API + '/group/downloadResource_v2.action?id=' + val


      // console.log(val);
      // request({
      //       url:'/group/downloadResource_v2.action',
      //       //url:'user/getProfilePic.action',
      //       method: 'get',
      //       params:{
      //           id:val
      //       },
      //     responseType:'blob'
      //   }).then(res=>{
      //     console.log(res)
      //   const binaryData = []
      //   binaryData.push(res)
      //   // 获取blob链接
      //    let pdfUrl = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }))
      //   window.open(pdfUrl)
      //  //  console.log(pdfUrl)
      //   console.log(pdfUrl)
      //   this.$refs.pdf.previewpdf(pdfUrl)
      // })

      // this.$refs.pdf.previewpdf(this.pdfsrc)

    },
    handleSelectionChange(val) {
      this.tableSelection = val
      this.$nextTick(() => {
        if (isChoose(this, true)) {
          if (isChooseOne(this, true)) {
            if (val.length > 0 && val[0].type === 1) {
              this.perm = Object.assign({}, this.perm, {open: true})
            } else {
              this.perm = Object.assign({}, this.perm, {open: false})
            }


            this.perm = Object.assign({}, this.perm, {
//                edit: () => {
//                  if (this.perm.edit) {
//                    return true
//                  } else {
//                    return false
//                  }
//                },
              shareLink: () => {
                if (this.perm.share) {
                  return true
                } else {
                  return false
                }
              }
            })
          } else {
            this.perm = Object.assign({}, this.perm, {open: false, edit: false, shareLink: false}) //选择多个情况下，不能有打开
          }
        } else {
          this.$refs.contextmenu.hide()
        }
      })
    },
    refreshListCallback() {
      setTimeout(() => {
        if (this.$route.name === 'personalFilter') {
          this.searchResources(this.id)
        } else {
          this.initLodaData(this.$route.params.id)
        }
      }, 10)
    },
    recycleResource() {
      let ids = []

      if (this.isPhotoView) {
        this.tableSelection = this.checkList
      }

      ids = this.tableSelection.map(item => {
        return item.id
      })


      if (ids.length !== 0) {
        this.$confirm('此操作将删除所选文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          recycleResource({id: ids.join(',')}).then(res => {
            if (this.$route.name === 'personalFilter') {
              this.searchResources(this.id)
            } else {
              this.initLodaData(this.$route.params.id)
            }
            this.$message({showClose: true, message: '操作成功', type: 'success'});
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      } else {
      }
    },
    deleteResource() {
      let ids = []

      ids = this.tableSelection.map(item => {
        return item.id
      })

      if (ids.length !== 0) {
        this.$confirm('此操作将删除所选文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteResource({id: ids.join(',')}).then(res => {
            this.initLodaData(this.$route.params.id)
            this.$message({showClose: true, message: '操作成功', type: 'success'});
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      } else {
      }
    },
    handleFileClick(row) {
      if (this.listType === 'personal') {
        location.hash = '/personal/main/' + row.id
      } else {
        location.hash = '/public/main/' + row.id
      }
    },
    goToRecycle() {
      this.handleFileClick({
        id: parseInt(localStorage.recycleId)
      })
    },
    thumbnailCompoted(item) {
      let _target = this.markPhotosObj.filter(subItem => {
        return item.id === subItem.id
      })
      return _target.length > 0 ? (process.env.BASE_API + _target[0].thumbUrl) : ''
    },

    thumbnailByLazyLoad(resources) {
      let _markPhotoObj = []
      resources.forEach(item => {
        let _ext = item.displayName.substring(item.displayName.lastIndexOf('.') + 1)
        if (_ext !== undefined && _ext !== '') {
          _ext = _ext.toLowerCase()
          if (_ext === 'png' || _ext === 'jpg' || _ext === 'jpeg' || _ext === 'gif' || _ext === 'bmp') {
            _markPhotoObj.push(item)
          }
        }
      })


      let _markPhotoName = _markPhotoObj.map(item => {
        return item.displayName
      })

      _markPhotoObj = _markPhotoObj.map(item => {
        return item.id
      })


      let _size = 10, _times = Math.ceil(_markPhotoObj.length / _size), _count = 0

      this.markPhotosObj = []
      let _getThumbnail = () => {
        getThumbnail({
          id: _markPhotoObj.slice(_count * _size, _count * _size + _size).join(','),
          width: 100,
          height: 100,
          quality: 90
        }).then(res => {
          let _res = res.data
          // console.log("打印返回"+res.data)
          this.markPhotosObj = [...this.markPhotosObj, ..._res]


          if (_count !== _times - 1) {
            _count++
            _getThumbnail()
          } else {

          }
          this.images = this.markPhotosObj.map((item, index) => {
                return {
                  // thumb:""+item.thumbUrl,
                  //  src:""+ '/group/viewThumbnail.action?id=' + item.id,
                  thumb: process.env.BASE_API + item.thumbUrl,
                  src: process.env.BASE_API + '/group/viewThumbnail?id=' + item.id,
                  caption: _markPhotoName[index]
                }
                this.markPhotosObj = [];//清空
              }
          )

        }).catch(e => {
          console.log(e)
        })
      }
      if (_markPhotoObj.length != 0) {
        _getThumbnail()
      }
    },
    getNamenail(item) {
      let _ext = item.displayName.substring(item.displayName.lastIndexOf('.') + 1)
      return _ext
    },
    thumbnail(item) {
      let _ext = item.displayName.substring(item.displayName.lastIndexOf('.') + 1)
      if (_ext !== undefined && _ext !== '') {
        _ext = _ext.toLowerCase()

        if (item.type === 1) {
          _ext = 'folder'
        }

        if (_ext === 'zip' || _ext === 'rar') {
          _ext = 'zip'
        }

        if (_ext === 'png' || _ext === 'jpg' || _ext === 'jpeg' || _ext === 'gif' || _ext === 'bmp') {
          _ext = 'pic'
        }

        if (_ext === 'doc' || _ext === 'docx' || _ext === 'wps') {
          _ext = 'word'
        }

        if (_ext === 'txt') {
          _ext = 'txt'
        }

        if (_ext === 'ppt' || _ext === 'pptx') {
          _ext = 'ppt'
        }

        if (_ext === 'xls' || _ext === 'xlsx') {
          _ext = 'xls'
        }

        if (_ext === 'avi' || _ext === 'mov' || _ext === 'swf' || _ext === 'wmv' || _ext === 'mp4'
            || _ext === 'mpeg' || _ext === 'rmvb' || _ext === 'rm' || _ext === 'mkv' || _ext === 'mpg') {
          _ext = 'media'
        }

        if (_ext === 'mp3' || _ext === 'midi') {
          _ext = 'music'
        }

        if (_ext === 'psd') {
          _ext = 'psd'
        }

        switch (_ext) {
          case 'html':
            return ICON.html_icon
            break
          case 'css':
            return ICON.css_icon
            break
          case 'word':
            return ICON.word_icon
            break
          case 'txt':
            return ICON.txt_icon
            break
          case 'ppt':
            return ICON.ppt_icon
            break
          case 'pdf':
            return ICON.pdf_icon
            break
          case 'xls':
            return ICON.xls_icon
            break
          case 'txt':
            return ICON.txt_icon
            break
          case 'music':
            return ICON.music_icon
            break
          case 'media':
            return ICON.media_icon
            break
          case 'folder':
            return ICON.folder_icon
            break
          case 'zip':
            return ICON.zip_icon
            break
          case 'psd':
            return ICON.psd_icon
            break
          case 'pic':
            return 'pic'
//              return process.env.BASE_API + '/group/viewThumbnail.action?id=' + item.id
            break
          default:
            return ICON.default_icon
        }
      }
    },
    togglePhotoView() {
//        this.isLightBox = false
      this.isToggle = true
      setTimeout(() => {
        this.isToggle = false
      }, 500)
      if (!this.isPhotoView) {
        //列表模式
        this.isPhotoView = true
        let tableSelections = this.$store.getters.resources.tableSelections
        this.$nextTick(() => {
          if (tableSelections !== undefined) {
            this.checkList = tableSelections
          } else {
            this.checkList = []
          }
        })
      } else {
        //图片模式
        this.isPhotoView = false
        let tableSelections = this.$store.getters.resources.tableSelections
        this.$nextTick(() => {
          if (tableSelections !== undefined) {
            tableSelections.forEach(item => {
              this.$refs.table.toggleRowSelection(item, true)
            })
          } else {
            this.$refs.table.clearSelection()
          }
        })
      }
    },
    searchResources(type) {
      this.isToggle = true
      let _query = ''
      switch (type) {
        case 'pic':
          _query = '.jpg,bmp,jpeg,.png,.gif,.tiff,.tif,.raw,.cdr,.psd,.cr2,.cr3'
          this.path = [{displayName: '图片', id: 'filter'}]
          break
        case 'doc':
          _query = '.doc,.docx,.xls,.xlsx,.txt,.rp,.wps,.pdf,.chm,.pdg,.wdl,.ppt,.pptx,.vsd,.rtf,.html,.sjs,.css'
          this.path = [{displayName: '文档', id: 'filter'}]
          break
        case 'media':
          _query = '.avi,.mp4,.mkv,.rm,.rmvb,.mov,.mp3,.midi,.mpg,.mpeg,.wmv,.swf,.wav,.vsd'
          this.path = [{displayName: '媒体', id: 'filter'}]
          break
      }
      _query = _query + ',' + _query.toUpperCase()

      this.listQuery.query = _query
      this.listQuery.groupId = this.personalGroupID

      this.$store.dispatch('SetTableSelection', undefined)

      searchResources(this.listQuery).then(res => {

        this.isLightBox = true
        this.isPaging = true
        res = res.data
        const resources = res.resources


        this.total = res.totalCount
        this.tableData = []

        this.emptyText = '加载中...'

        setTimeout(() => {
          this.$nextTick(() => {
            this.tableData = resources


//              if (this.isPhotoView) {
            this.thumbnailByLazyLoad(this.tableData) //把图片ID暂存
//              }

            if (this.tableData.length === 0) {
              this.emptyText = '暂无数据'
            }
            this.isToggle = false
            this.loading = false
          })
        }, 100)

      })
    },
    openGallery(item) {
//        this.isLightBox = true
      setTimeout(() => {
//          this.isLightBox = true
        this.$nextTick(() => {
          let _index = 0
          this.images.map((subItem, index) => {
            if (item.displayName === subItem.caption) {
              _index = index
            }
          })
          this.$refs.lightbox.showImage(_index)
        })
      }, 500)
    },
    contextmenuCallback(row) {
      this.markRow = row
      let selected = this.$store.getters.resources.tableSelections
      if (selected !== undefined && selected !== null) {
        selected = selected.map(item => {
          return item.id
        })
        if (selected.indexOf(row.id) < 0) {
          this.$refs.table.clearSelection()
          this.$refs.table.toggleRowSelection(row)
        }
      } else {
        this.$refs.table.toggleRowSelection(row)
      }
    },
    contextEvent(code) {
      switch (code) {
        case 0:
          this.handleFileClick(this.markRow)
          break;
        case 1:
          this.$root.$emit('download')
          break;
        case 2:
          this.$root.$emit('open-share-dialog', {visible: true})
          break;
        case 3:
          this.$root.$emit('open-linkShare-dialog', {visible: true})
          break;
        case 4:
          this.$root.$emit('open-copy-dialog', {visible: true})
          break;
        case 5:
          this.$root.$emit('open-move-dialog', {visible: true})
          break;
        case 6:
          this.$root.$emit('open-edit-dialog', {visible: true})
          break;
        case 7:
          this.$root.$emit('delete-resources-callback')
          break;
        case 8: {
          if(this.checkPreview("view"))
            this.$router.push('/personal/office')
          break;
        }
        case 9: {
          if(this.checkPreview("edit"))
            this.$router.push('/personal/office')
          break;
        }
      }
    },
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
//          setData: function(dataTransfer) {
//            dataTransfer.setData('Text', '')
//          },
        onStart: evt => {
          this.oldIndex = evt.oldIndex
          window.isSorting = true //不允许打开上传窗口
        },
        onMove: evt => {


          window.isSorting = true //不允许打开上传窗口

          let newIndex = Sortable.utils.index(evt.related, '.el-table__row')
          let oldIndex = this.oldIndex

          let _current = this.tableData[oldIndex] //当前拖动的行
          let _next = this.tableData[newIndex] //移到新的位置的下一个
          let _prev = this.tableData[newIndex - 1] //移到新位置的前一个

          if (_next === undefined) {
            //拖动到最后一个，下一个是undefined的时候，type:{1:文件夹，2：文件}
            if (_prev.type === 1 && _current.type !== 1) { //正拖放的是非文件夹，并且当前拖放上一个是文件夹
              this.canSort = false
              return false
            }
            if (_prev.type !== 1 && _current.type === 1) { //正拖放的是文件夹，并且当前拖放上一个是非文件夹
              this.canSort = false
              return false
            }
          } else {
            if (_next.type === 1 && _current.type !== 1) {
              this.canSort = false
              return false
            }
            if (_next.type !== 1 && _current.type === 1) {
              this.canSort = false
              return false
            }
          }

          this.canSort = true

//            let nextIndex = this.tableData[newIndex]
//            if (nextIndex !== undefined) {
//              if (nextIndex.type === 1 && this.tableData[oldIndex - 1].type === 2) {
//                this.isSort = false
//                return false
//              }
//              if (nextIndex.type === 2 && this.tableData[oldIndex - 1].type === 1) {
//                this.isSort = false
//                return false
//              }
//            } else {
//              if (this.tableData[newIndex-1].type === 1 && this.tableData[oldIndex - 1].type === 2) {
//                this.isSort = false
//                return false
//              }
//              if (this.tableData[newIndex-1].type === 2 && this.tableData[oldIndex - 1].type === 1) {
//                this.isSort = false
//                return false
//              }
//            }
//            this.isSort = true
        },
        onEnd: evt => {
          window.isSorting = false //允许打开上传窗口
          if (!this.canSort) {
            return false
          }
          let indexArr = this.tableData.map((item, index) => {
            return index
          })
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
          modifyResourceOrder({id: this.newList.join(','), orders: indexArr.join(',')}).then(res => {
            this.$message({showClose: true, message: '排序成功', type: 'success'});
          })
        }
      })
    },
    setCurrentRow(i) {
      this.$refs.table.setCurrentRow(this.tableData[i - 1])
      const targetTop = this.$refs.table.$el.querySelectorAll('.el-table__body tr')[i - 1].getBoundingClientRect().top
      const containerTop = this.$refs.table.$el.querySelector('.el-table__body').getBoundingClientRect().top
      const scrollParent = document.querySelectorAll('.flexBody')[1]
      scrollParent.scrollTop = targetTop - containerTop
      this.rowIndex = i
    },
    tableRowClassName(row) {
      if ((row.rowIndex + 1) === this.rowIndex) {
        setTimeout(() => {
          this.chooseRow = ''
        }, 3500)
        return this.chooseRow
      } else {
        return ''
      }
    },
    getOffice(id,mode) {
      request({
        url: '/office/preview',
        method: 'get',
        params: {
          id: id,
          mode: mode,
          type: "desktop"
        }
      }).then(data => {
        this.config = data.data.model;
        this.$root.$emit('open-office', {config: this.config})
      }).catch(err => {
        console.log(err);
      })
    },
    checkPreview(mode) {
      let tableSelectoins = this.$store.getters.resources.tableSelections
      tableSelectoins = tableSelectoins.map(item => {
        return item.id
      });
      if (tableSelectoins.length > 1) {
        this.$message.error("只能预览一个文件");
        return false;
      }
      this.getOffice(tableSelectoins[0],mode);
      return true;
    }
  }
}
</script>
<style>
.sortable-ghost {
  opacity: .5;
  color: #fff !important;
  background: #42b983 !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.breadcrumbWrap {
  border-bottom: 1px solid #e6e6e6;
  height: 40px;
}

.el-breadcrumb__item {
  height: 40px !important;
  line-height: 40px !important;
}

.el-table__body /deep/ {

  td {
    padding: 0 !important;
  }

  th {
    padding: 0 !important;
  }

  .cell {
    div {
      padding: 6px 0;
    }
  }
}

.svg-icon {
  font-size: 20px;
  position: relative;
  top: 2px;
}

.el-icon-document {
  font-size: 16px;
}

.btnActive {
  color: #409EFF;
  border-color: #dcdfe6;
  background-color: #ecf5ff;
}

.btnDefault {
  color: #606266;
  border-color: #dcdfe6;
  opacity: .6;
  background-color: #fff;
}

#photoView /deep/ {
  .el-row {
    margin: 0 !important;
  }

  .picBox {
    display: inline-block;
    margin: 25px 0px;
    text-align: center;
    position: relative;

    .el-checkbox__label {
      display: none !important;
    }

    .el-checkbox__inner {
      position: absolute;
      top: 78px;
      left: -38px;
    }

    .picWrap {
      width: 90px;
      height: 90px;
      display: block;
      background-size: 100% auto;
    }

    .picTitle {
      font-size: 12px;
      text-align: center;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 90px;
    }
  }
}

#lightbox /deep/ {

  .vue-lb-figure {
    min-width: 600px !important;
    min-height: 400px !important;

    img {
      min-width: 100px;
    }

    /*background: #fff;*/
  }

  .vue-lb-info {
    line-height: 40px !important;
    bottom: 0 !important;
    opacity: .8;
  }

  .vue-lb-footer-count {
    position: absolute;
    bottom: 3px;
    color: #fff;
    right: 5px;
  }

  .vue-lb-modal-thumbnail-active {
    width: 55px;
    height: 55px;
  }
}

.resourceList /deep/ {
  .el-table__header {
    th:nth-of-type(3) {
      .cell {
        text-align: center;
      }
    }

    th:nth-of-type(4) {
      .cell {
        text-align: right;
      }
    }

    th:nth-of-type(5) {
      .cell {
        text-align: center;
      }
    }
  }

  .chooseRow > td {
    background: #ecf5ff !important;
    color: #409EFF !important;
  }
}


</style>
