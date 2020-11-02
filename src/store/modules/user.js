import { getMyNewReceiveCount, getUserInfo, loginByUsername, logout, selectMember } from '@/api/login'
import { getToken, removeToken, setToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: '',
    name: '',
    account: '',
    isAdmin: false,
    avatar: '',
    introduction: '',
    newReceiveCount: null,
    roles: [],
    personalGroupID: '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_ISADMIN: (state, isadmin) => {
      state.isAdmin = isadmin
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_PERSONALGROUPID: (state, id) => {
      state.personalGroupID = id
    },
    SET_PERSONALMEMBERID: (state, id) => {
      state.memberId = id
    },
    SET_RECEIVECOUNT: (state, count) => {
      state.newReceiveCount = count
    }
  },

  actions: {
    setToken({ commit }, state){
      commit('SET_TOKEN', state)
    },
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          selectMember(data.members[0].id).then(res => {
            res = res.data
            if (res.code === 200) {
              console.log(res.code,'setToken')
              commit('SET_TOKEN', res.code) // 把登录结果放到store
              setToken(res.code) // 把登录结果保存在cookie中
              resolve()
            } else {
              reject(res)
            }
          })
          // setToken(response.data.token)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data
          if (data.status === 'login') {
            const response = { data: {} }
            response.data.roles = ['admin']
            commit('SET_ROLES', response.data.roles)
            commit('SET_NAME', data.name)
            commit('SET_ACCOUNT', data.account)
            commit('SET_PERSONALGROUPID', data.personGroupId)
            commit('SET_PERSONALMEMBERID', data.memberId)
            commit('SET_ISADMIN', data.isAdmin)
            getMyNewReceiveCount().then(res => {
              res = res.data
              commit('SET_RECEIVECOUNT', res.count)
            })
            window.getMyReceiveCount = setInterval(() => {
              getMyNewReceiveCount().then(res => {
                res = res.data
                // setTimeout(() => {
                //   commit('SET_RECEIVECOUNT', res.count)             2020 07.17 判断计时器没有销毁，yh把计时器注释掉
                // }, 50)
                commit('SET_RECEIVECOUNT', res.count)
              })
            }, 50000)
            resolve(response)
          } else {
            reject(response)
          }
          // commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          // commit('SET_INTRODUCTION', data.introduction)
          // resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetMyReceiveCount({ commit, state }){
      return new Promise((resolve, reject) => {
        getMyNewReceiveCount().then(res => {
          res = res.data
          commit('SET_RECEIVECOUNT', res.count)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          clearInterval(window.getMyReceiveCount) //移除定期请求
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
