<template>
  <keep-alive :include="cachedViews">
    <div class="sidebarOutWrap">

      <div class="logo" :style="bg">
        <!--<el-badge :value="'vue'"></el-badge>-->
      </div>

      <component :is="currentView"></component>
    </div>
  </keep-alive>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SldebarMenus from './menus.vue'
  import AdvanceSearch from './AdvanceSearch.vue'

  import avatar from '@/assets/weblib-plus-logo@2x.png'
  export default {
    components: { SldebarMenus, AdvanceSearch },
    data(){
      return {
        activeName: 'personal',
        currentView: SldebarMenus,
        bg: { backgroundImage: 'url("weblib-plus-logo@2x.png")' }
      }
    },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      },
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.name === 'search') {
          this.currentView = AdvanceSearch
        } else {
          this.currentView = SldebarMenus
        }
      }
    },
    created(){
      if (this.$route.name === 'search') {
        this.currentView = AdvanceSearch
      } else {
        this.currentView = SldebarMenus
      }
    },
    mounted(){
    },
    methods: {
      handleOpenMenu(){
        console.log(23)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .sidebarOutWrap /deep/ {
    .logo {
      height: 40px;
      border-bottom: 1px solid #e6e6e6;
      background: no-repeat center center;
      background-size: 90% auto;
    }
    .el-badge__content {
      position: relative;
      top: -2px;
      left: 147px;
      font-size: 11px;
      background: #70AE14;
    }
  }


</style>
