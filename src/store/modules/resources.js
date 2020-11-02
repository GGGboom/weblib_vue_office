import { getResources, searchResources } from '../../api/resources'

const resources = {
  state: {
    // list: [],
    searchResults: null,
    isSearch: false,
    searchParams: {},
    myParams: null,
    groupId: null,
    tableSelections: null,
    perm: null,
    pageNum: null
  },
  mutations: {
    // SET_DATA: (state, data) => {
    //   state.list = data
    // },
    SET_GROUPID: ((state, data) => {
      state.groupId = data
    }),
    SET_SEARCH_CALLBACK: (state, data) => {
      state.searchResults = data
    },
    SET_IS_SEARCH: (state, data) => {
      state.isSearch = data
    }
    ,
    SET_SEARCH_PARAMS: (state, data) => {
      state.searchParams = data
    },
    SET_TABLE_SELECTION: (state, data) => {
      state.tableSelections = data
    },
    SET_PARAMS: (state, data) => {
      state.myParams = data
    },
    SET_PERM: ((state, data) => {
      state.perm = data
    }),
    SET_PAGENUM: ((state, data) => {
      state.pageNum = data
    })
  },
  actions: {
    // 用户名登录
    // GetResources({ commit }, paramsObj) {
    //   return new Promise((resolve, reject) => {
    //     getResources(paramsObj).then(response => {
    //       commit('SET_DATA', response.data)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }
    SetGroupID({ commit }, paramsObj){
      commit('SET_GROUPID', paramsObj)
    },
    ClearSearch({ commit }, param){
      return new Promise((resolve, reject) => {
        commit('SET_SEARCH_CALLBACK', {})
        commit('SET_IS_SEARCH', false)
        commit('SET_SEARCH_PARAMS', {})
        resolve()
      })
    },
    SearchCallback({ commit }, paramsObj) {
      return new Promise((resolve, reject) => {
        if (paramsObj.query !== '') {
          searchResources(paramsObj).then(response => {
            commit('SET_SEARCH_CALLBACK', response.data)
            commit('SET_IS_SEARCH', true)
            commit('SET_SEARCH_PARAMS', paramsObj)
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
        } else {
          getResources(paramsObj).then(response => {
            commit('SET_SEARCH_CALLBACK', response.data)
            commit('SET_IS_SEARCH', false)
            commit('SET_SEARCH_PARAMS', paramsObj)
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    SetTableSelection({ commit }, paramsObj){
      return new Promise((resolve, reject) => {
        commit('SET_TABLE_SELECTION', paramsObj)
        resolve()
      })
    },
    SetMyParams({ commit }, paramsObj){
      return new Promise((resolve, reject) => {
        commit('SET_PARAMS', paramsObj)
        resolve()
      })
    },
    SetPerm({ commit }, paramsObj){
      commit('SET_PERM', paramsObj)
    },
    SetPageNum({ commit }, paramsObj){
      commit('SET_PAGENUM', paramsObj)
    }
  }
}

export default resources
