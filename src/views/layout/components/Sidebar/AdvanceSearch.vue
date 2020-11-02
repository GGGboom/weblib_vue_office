<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>高级搜索</span>
      </div>
      <div class="text item">
        <el-form :label-position="labelPosition" label-width="80px" size="mini">
          <!--<el-form-item label="">-->
          <!--<el-input placeholder="请输入文件名" :clearable=true />-->
          <!--</el-form-item>-->
          <el-form-item label="时间范围" style="margin-bottom:0;">
            <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="upCreationDate" placeholder="选择日期"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
          <div style="text-align:center;color:#909399;line-height:200%;">至</div>
          <el-form-item label="">
            <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="downCreationDate" placeholder="选择日期"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="创建者">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<div style="text-align:center;">-->
          <!--<el-button type="primary" style="width:100%;">搜索</el-button>-->
          <!--</div>-->
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'advanceSearch',
    watch: {
      upCreationDate(value){
//        console.log(value)
        if (Date.parse(this.downCreationDate) - Date.parse(value) < 0) {
          this.upCreationDate = null
          this.$message({
            message: '开始时间不能大于结束时间，请重新选择',
            type: 'warning',
            duration: 1500
          });
        } else {
          if (this.downCreationDate !== null && value !== null || (this.downCreationDate === null && value === null)) {
            this.searchCallback()
          }
        }
      },
      downCreationDate(value){
        if (Date.parse(value) - Date.parse(this.upCreationDate) < 0) {
          this.downCreationDate = null
          this.$message({
            message: '结束时间不能大于开始时间，请重新选择',
            type: 'warning',
            duration: 1500
          });
        } else {
          if (this.upCreationDate !== null && value !== null || (this.upCreationDate === null && value === null)) {
            this.searchCallback()
          }
        }
      },
      value(val){
        this.searchCallback()
      }
    },
    data(){
      return {
        labelPosition: 'top',
        upCreationDate: null,
        downCreationDate: null,
        options: [
          {
            value: '0',
            label: '全部'
          }, {
            value: '1',
            label: '由我创建'
          }, {
            value: '2',
            label: '其他人创建'
          }
        ],
        value: '0'
      }
    },
    methods: {
      searchCallback(){
        let _value = ''
        switch (this.value) {
          case '0':
            _value = '';
            break;
          case '1':
            _value = 'myself';
            break;
          case '2':
            _value = 'other';
            break;
        }
        this.$root.$emit('advance-search-callback', {
          downCreationDate: this.upCreationDate !== null ? Date.parse(this.upCreationDate) : '',
          upCreationDate: this.downCreationDate != null ? Date.parse(this.downCreationDate) : '',
          owner: _value
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-card /deep/ {
    font-size: 14px;
    .el-card__header {
      padding: 0;
      height: 39px;
      line-height: 39px;
      text-align: center;
      background: #409EFF;
      color: #fff;
    }
  }
</style>
