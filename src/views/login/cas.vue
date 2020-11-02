<template>
  <div></div>
</template>
<script>
  import { getUserInfo } from '@/api/login'
  import { getToken, removeToken, setToken } from '@/utils/auth'
  export default {
    name: 'jwt_redirect',
    data(){
      return {}
    },
    created(){
      if (getToken() === undefined) {
        setToken(200)
        location.href = '/'
      } else {
        location.href = '/'
      }
    }
  }
</script>
