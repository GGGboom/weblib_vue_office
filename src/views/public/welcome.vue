<template>
  <div class="welcomeWrap">
    <div class="innerWrap">
      <el-alert
        title="这里是公共资源库"
        type="info"
        :closable="false"
        description="请选择一个柜子浏览公共资源"
        show-icon>
      </el-alert>
      <div class="logo" :style="bg"></div>
    </div>
  </div>
</template>
<script>
  import avatar from '@/assets/weblib-plus-logo@2x.png'
  export default {
    name: 'welcome',
    data(){
      return {
        bg: { backgroundImage: 'url("weblib-plus-logo@2x.png")' }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .welcomeWrap {
    height: 100%;
    padding: 20px;
    .innerWrap {
      height: 100%;
      border-radius: 10px;
      border: 1px dashed #ccc;
      .el-alert {
        margin: 0 auto;
      }
    }
    .logo {
      height: 40px;
      border-bottom: 1px solid #e6e6e6;
      background: no-repeat center center;
      background-size: 90% auto;
      width: 220px;
      margin: 0 auto;
      margin-top: 15%;
    }
  }
</style>
