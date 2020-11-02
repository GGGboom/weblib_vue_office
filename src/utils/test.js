import axios from 'axios'
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://localhost:8080/' : 'http://localhost:8080/'

const service = axios.create({
  baseURL: 'http://localhost:9000/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器，在请求头中加token
service.interceptors.request.use(
  config => {
    let token = JSON.parse(localStorage.getItem('token'));
    if(token){
      config.headers.Authorization = token;
    }
    return config
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return error
  }
)

export function get(url, params, data) {
  if (data) {
    url = `${url}${data}`
    service({url, method: 'get', params})
  }
  return service({url, method: 'get', params})
}

/**
 *
 * @param url
 * @param data
 * @param token
 * @returns {AxiosPromise}
 */
export function post(url, data) {
  return service({url, method: 'post', data})
}

/**
 *
 * @param url
 * @param params
 * @param token
 * @param id
 * @returns {AxiosPromise}
 */
export function deletefn(url, params, id) {
  if (id) {
    url = url + id
  }
  return service({url, method: 'delete', params})
}

export function put(url, data) {
  return service({url, method: 'put', data})
}

export default service
