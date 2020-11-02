import request from '@/utils/request'

/**
 * 登录接口
 * @param account
 * @param password
 */
export function loginByUsername(account, password) {
  const data = {
    account,
    password
  }
  return request({
    url: '/login/authenticate_v2',
    method: 'post',
    params: data
  })
}

/**
 * 设置马甲接口
 * @param memberId
 */
export function selectMember(memberId) {
  const data = { memberId }
  return request({
    url: '/login/selectMember_v2',
    method: 'post',
    params: data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/status',
    method: 'post',
    params: { token }
  })
}

export function getMyNewReceiveCount(paramsObj) {
  return request({
    url: '/group/getMyNewReceiveCount',
    method: 'post',
    params: paramsObj
  })
}

export function jwtLogin(params) {
  return request({
    url: '/uaa/oauth/token?client_id=client&grant_type=authorization_code&redirect_uri='
    + process.env.BASE_API + '/#/cas',
    method: 'post',
    params: params
  })
}

/**
 * 微服务接口
 */

//获取微服务系统版本号
export function getSystemVersion() {
  return request({
    headers:{'no-token':true},
    url: `/global/getSystemVersion`,
    method: 'post'
  })
}

//微服务登录接口
export function newLogin(params) {
  return request({
    headers:{'no-token':true},
    url: `/uaa/newLogin`,
    method: 'post',
    params: params
  })
}

//微服务用授权码换取fa访问令牌
export function jwtToken(params) {
  return request({
    headers:{'no-token':true},
    url: `/uaa/oauth/token`,
    method: 'post',
    headers: {
      'no-tips': true
    },
    params: {
      ...params,
      client_id: 'client_ios',
      client_secret: 'ios@123',
      grant_type: 'password'
      // grant_type: 'authorization_code',
      // redirect_uri: '/#jwt_redirect'
    }
  })
}


export function checkLogin(params, token) {
  return request({
    url: `/login/authenticate_v2`,
    method: 'post',
    params: params,
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
}





//微服务请求授权码code
export function authorize(params) {
  let state = Math.random().toFixed(6) * 1000000
  localStorage.jwtState = state
  return request({
    url: `/uaa/oauth/authorize`,
    method: 'post',
    params: {
      ...params,
      response_type: 'code',
      client_id: 'client_windows	',
      client_secret: 'windows@123',
      state: state,
      redirect_uri: '/#jwt_redirect'

    }
  })
}

