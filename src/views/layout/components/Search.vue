<template>
  <el-popover
    placement="bottom"
    width="300"
    v-model="isVisible"
    @show="showSearch"
    trigger="click">
    <el-row>
      <el-col :span="18">
        <div class="grid-content bg-purple el-popover-sarch">
          <el-input placeholder="请输入文件名" v-model="searchForm.query"
                    style="width:270px;margin-top:6px;"
                    size="mini" class="input-with-select fr" @keyup.native.enter="handleSearch">
            <el-select style="width:70px;" v-model="select" slot="prepend" @change="selectChange()">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-if="!item.disabled">
              </el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="6" style="text-align:center;">
        <!--<div class="grid-content bg-purple-light">-->
        <!--<el-button size="mini" type="text" style="line-height:20px;">高级搜索</el-button>-->
        <!--</div>-->
      </el-col>
    </el-row>


    <el-button :disabled="isDisabled" plain type="primary" ref="searchBtn" class="fr" icon="el-icon-search" size="mini"
               slot="reference"
               style="margin-top:6px;">{{searchText}}<i v-if="isDisabled" class="el-icon-loading"></i>
    </el-button>
  </el-popover>
</template>

<script>
  import { searchResources } from '@/api/resources'
  export default {
    name: 'searchBar',
    data(){
      return {
        isVisible: false,
        searchText: '搜索',
        isDisabled: false,
        select: '0',
        searchForm: {
          groupId: Math.abs(this.$route.params.id),
          parentId: '',
          query: null
        },
        options: [{
          value: '0',
          label: '本库'
        }, {
          value: '1',
          label: '全库'
        }]
      }
    },
    created(){
      this.select = '0'
      this.selectFunc(this.$route)
    },
    watch: {
      '$route'(to, from){
        this.selectFunc(to)
        this.searchForm = {
          query: to.params.query,
          groupId: to.params.id,
          parentId: to.params.id
        }
      }
    },
    methods: {
      //判断选择下拉默认是全库还是本库
      selectFunc(to){
        if (to.name === 'search') {
          if (localStorage.searchSelect === '1') {
            this.select = '1'
            this.options = [{
              value: '0',
              label: '本库',
              disabled: true
            }, {
              value: '1',
              label: '全库'
            }]
          } else {
            this.options = [{
              value: '0',
              label: '本库'
            }, {
              value: '1',
              label: '全库',
              disabled: true
            }]
          }
        } else if (to.name === 'publicWelcome') {
          this.select = '1'
          localStorage.searchSelect = '1'
          this.options = [{
            value: '0',
            label: '本库',
            disabled: true
          }, {
            value: '1',
            label: '全库'
          }]
        } else {
          if (localStorage.searchSelect === '1') {
            this.select = '1'
          } else {
            this.select = '0'
          }
          this.options = [{
            value: '0',
            label: '本库'
          }, {
            value: '1',
            label: '全库'
          }]
        }
      },
      handleSearch(){
        if (this.$route.name !== 'search') {
          localStorage.backPath = this.$route.path
        }
        this.$router.push({
          path: '/search/main/' + this.searchForm.query
        })

      },
      showSearch(){
        this.searchText = '搜索'
      },
      selectChange(){
        localStorage.searchSelect = this.select
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .el-popover-sarch {
    .el-input-group__prepend {
      background-color: #fff !important;
    }
    .el-input-group--prepend {
      left: 65px;
    }
  }
</style>
