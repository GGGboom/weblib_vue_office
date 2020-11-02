<template>
  <div></div>
</template>
<script>
  import { getUserInfo, jwtToken } from '@/api/login'
  import { getToken, removeToken, setToken } from '@/utils/auth'
  export default {
    name: 'cas',
    data(){
      return {}
    },
    created(){
      let params = {}
      location.hash.split('?')[1].split('&').forEach(item => {
        params[item.split('=')[0]] = item.split('=')[1]
      })
      console.log(params)
      console.log(getToken())

      if (parseInt(params.state) === parseInt(localStorage.jwtState)) {
        const code = parseInt(params.code)
        jwtToken({
          code
        }).then(res => {
          res = res.data
          const access_token = res.access_token
          setToken(access_token) //设置登录token
        }).catch(error => {
          location.href = '/'
        })
      } else {
//        location.href = '/'
      }

//      if (getToken() === undefined) {
//        setToken(200)
//        location.href = '/'
//      } else {
//        location.href = '/'
//      }
    }
  }
</script>
