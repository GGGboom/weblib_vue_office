<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <sticky :zIndex="zIndex">
        <navbar></navbar>
      </sticky>
      <!--<tags-view></tags-view>-->
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
  import { Navbar, Sidebar, AppMain, TagsView } from './components'
  import Sticky from '@/components/Sticky'
  // TagsView
  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      TagsView,
      AppMain,
      Sticky
    },
    data() {
      return {
        zIndex: 9
      }
    },
//    computed: {
//      sidebar() {
//        return this.$store.state.app.sidebar
//      }
//    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    .sidebar-container {
      position: inherit !important;
      float: left;
    }
  }


</style>
