import request from '@/utils/request'

/**
 * 获取通讯录
 * @param account
 * @param password
 */
export function getContacts(paramsObj) {
  return request({
    url: '/user/getContacts',
    method: 'post',
    params: paramsObj
  })
}

/**
 * 获取通讯录树
 * @param account
 * @param password
 */
export function getMyContactTree(paramsObj){
  return request({
      url: '/user/getMyContactTree',
      method: 'post',
      params: paramsObj
  })
    //
}

/**
 * 获取最近联系人
 */
export function getRecentContacts(paramsObj){
  return request({
    url:'/group/getRecentContacts',
    method: 'post',
    params: paramsObj
  })
}


