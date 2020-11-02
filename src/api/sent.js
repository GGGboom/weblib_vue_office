import request from '@/utils/request'

/**
 * 获取我的分享列表
 * @param paramsObj
 */
export function getMyShared(paramsObj) {
  return request({
    url: '/group/getMyShared',
    method: 'post',
    params: paramsObj
  })
}


/**
 * 发送分享
 * @param paramsObj
 */
export function shareResourceToMember(paramsObj = {
  memberName: null,
  memberIds: null,
  resourceIds: null,
  groupId: null,
  desc: null
}) {
  return request({
    url: '/group/shareResourceToMember_v3',
    method: 'post',
    params: paramsObj
  })
}

/**
 * 删除分享
 * @param paramsObj
 */
export function deleteSharedResource(paramsObj = {
  memberName: null,
  memberIds: null,
  resourceIds: null,
  groupId: null,
  desc: null
}) {
  return request({
    url: '/group/deleteSharedResource_v3',
    method: 'post',
    params: paramsObj
  })
}


export function shareLink(paramsObj) {
  return request({
    url: '/webmail/getTokenDownloadUrl_v2',
    method: 'post',
    params: paramsObj
  })
}
