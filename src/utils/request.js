import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // request timeout
})

let _config = null
// request interceptor
service.interceptors.request.use(config => {
  _config = config
  // Do something before request is sent

  // if (store.getters.token) {
  // config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  if (config.headers['no-token']) {
  } else {
    config.headers['Authorization'] = `Bearer ${getToken()}`
  }

  // }
  return config
}, error => {
  // Do something with request error
  // console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => response,
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    if (error.message === '终止请求缩略图') {
      return Promise.reject({ data: [] })
    }
    if (error.response.data.detail === '请登录后再进行操作！') {
      Message({
        message: '登录超时',
        type: 'error',
        duration: 3 * 1000,
        onClose(){
          location.reload()
        }
      })
    } else {
      if (_config.headers['no-tips']) {
      } else {
        console.log(error.response.data.error)
        Message({
          message: error.response.data.detail === undefined ? error.response.data.error : error.response.data.detail,
          type: 'error',
          duration: 5 * 1000
        })
      }


    }
    return Promise.reject(error)
  })

export default service
