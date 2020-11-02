import request from '@/utils/request'
import axios from 'axios'

/**
 * 获取资源接口
 * @param account
 * @param password
 */
export function getResources(paramsObj) {
  return request({
    url: '/group/getResources_v2',
    method: 'post',
    params: paramsObj
  })
}
export function downloadResource(paramsObj) {
  return request({
    url: '/group/downloadResource_v2',
    method: 'post',
    params: paramsObj
  })
}
export function getTrees(paramsObj) {
  return request({
    url: '/group/trees_v2',
    method: 'post',
    params: paramsObj
  })
}

export function searchResources(paramsObj) {
  return request({
    url: '/group/searchResources_v3',
    method: 'post',
    params: paramsObj
  })
}

export function createDir(paramsObj) {
  return request({
    url: '/group/createDir_v2',
    method: 'post',
    params: paramsObj
  })
}

export function deleteResource(paramsObj) {
  return request({
    url: '/group/deleteResource_v2',
    method: 'post',
    params: paramsObj
  })
}

export function modifyResource(paramsObj) {
  return request({
    url: '/group/modifyResource_v2',
    method: 'post',
    params: paramsObj
  })
}

export function copyResource(paramsObj) {
  return request({
    url: '/group/copyResource_v2',
    method: 'post',
    params: paramsObj
  })
}

export function moveResource(paramsObj) {
  return request({
    url: '/group/moveResource_v2',
    method: 'post',
    params: paramsObj
  })
}

export function viewThumbnail(paramsObj) {
  return request({
    url: '/group/viewThumbnail',
    method: 'post',
    params: paramsObj
  })
}

export function getGroupPermission(paramsObj) {
  return request({
    url: '/group/getGroupPermission',
    method: 'post',
    params: paramsObj
  })
}

export function recycleResource(paramsObj) {
  return request({
    url: '/group/recycleResource',
    method: 'post',
    params: paramsObj
  })
}

const CancelToken = axios.CancelToken
let cancel = []
export function cancelGetThumbnail() {
  cancel.forEach(item => {
    item()
  })
  cancel = []
}

export function getThumbnail(paramsObj) {
  return request({
    url: '/group/getThumbnail',
    method: 'post',
    params: paramsObj,
    cancelToken: new CancelToken(function executor(c) {
      cancel.push(c)
    })
  }).catch(e => {
    console.log(e)
  })
}
export function getResourceSize(paramsObj) {
  return request({
    url: '/group/getResourceSize',
    method: 'post',
    params: paramsObj
  })
}

export function modifyResourceOrder(paramsObj = { id: null, orders: null }) {
  return request({
    url: '/group/modifyResourceOrder',
    method: 'post',
    params: paramsObj
  })
}

export function addWatch(paramsObj = { id: null }) {
  return request({
    url: '/user/addWatch_v2',
    method: 'post',
    params: paramsObj
  })
}

export function getWatchByGroup(paramsObj = { groupId: null }) {
  return request({
    url: '/user/getWatchByGroup_v2',
    method: 'post',
    params: paramsObj
  })
}

export function deleteWatch(paramsObj = { id: null }) {
  return request({
    url: '/user/deleteWatch_v2',
    method: 'post',
    params: paramsObj
  })
}


/**
 * 获取收藏列表
 * @param paramsObj
 */
export function getWatches(paramsObj) {
  return request({
    url: '/user/getWatches_v2',
    method: 'post',
    params: paramsObj
  })
}

/**
 * 搜索文件柜
 * @param paramsObj
 */
export function searchMyGroups(paramsObj) {
  return request({
    url: '/group/searchMyGroups',
    method: 'post',
    params: paramsObj
  })
}

/**
 * 根据parentId，resourceId，pageSize搜索资源在第几页
 * @param paramsObj
 */
export function locateResource(paramsObj) {
  return request({
    url: '/group/locateResource',
    method: 'post',
    params: paramsObj
  })
}


export function downloadResources(paramsObj){
  return request({
    url: '/group/downloadResource_v2',
    method: 'get',
    params: paramsObj,
    responseType: 'blob'
  })

}
