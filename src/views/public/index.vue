<template>
  <list :listType="'public'"></list>
</template>

<script>
  import List from '../personal/components/list'

  export default {
    name: 'publicMain',
    components: {
      List
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
