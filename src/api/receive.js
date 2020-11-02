import request from '@/utils/request'

/**
 * 获取我的接收列表父级
 * @param paramsObj
 */
export function getMyReceive(paramsObj) {
  return request({
    url: '/group/getMyReceive',
    method: 'post',
    params: paramsObj
  })
}

/**
 * 获取接收列表子级
 * @param paramsObj
 */
export function getSharedChildResources(paramsObj) {
  return request({
    url: '/group/getSharedChildResources_v2',
    method: 'post',
    params: paramsObj
  })
}

/**
 * 获取接收列表子级
 * @param paramsObj
 */
export function deleteReceivedResource(paramsObj) {
  return request({
    url: '/group/deleteReceivedResource_v2',
    method: 'post',
    params: paramsObj
  })
}

/**
 * 已读
 * @param paramsObj
 */
export function markReceived(paramsObj) {
  return request({
    url: '/group/markReceived',
    method: 'post',
    params: paramsObj
  })
}


