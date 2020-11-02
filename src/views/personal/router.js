const _import = require('@/router/_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '@/views/layout/Layout'

import store from '@/store'

const Personal = [{
  path: '/personal',
  component: Layout,
  redirect: to => {
    return { path: '/personal/main/' + -store.getters.personalGroupID }
  },
  meta: { title: '我的资源', icon: 'zip' },
  children: [
    { path: 'contact', component: _import('personal/contact'), name: 'contact', meta: { title: '通讯录' } },
    { path: 'favorite', component: _import('personal/favorite'), name: 'favorite', meta: { title: '我的收藏' } },
    { path: 'receive', component: _import('personal/receive'), name: 'receive', meta: { title: '我的接收' } },
    { path: 'sent', component: _import('personal/sent'), name: 'sent', meta: { title: '我的发送' } },
    { path: 'filter/:id', component: _import('personal/filter'), name: 'personalFilter', meta: { title: '资源筛选' } },
    { path: 'main/:id', component: _import('personal/index'), name: 'personalMain', meta: { title: '个人资源库' } },
      {path:'info',component:_import('personal/info'),name:'info',meta:{title:'个人信息'}},
    {path:'office',component: _import('personal/office'),name: 'office',meta: {title: '编辑office'}}
  ]
}]

export default Personal
