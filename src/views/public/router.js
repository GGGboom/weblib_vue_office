const _import = require('@/router/_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '@/views/layout/Layout'


const Public = [{
  path: '/public',
  component: Layout,
  meta: { title: '公共资源', icon: 'zip' },
  children: [
    // { path: 'main', component: _import('personal/index'), name: 'personal', meta: { title: '个人资源库' } },
    { path: 'welcome', component: _import('public/welcome'), name: 'publicWelcome', meta: { title: '欢迎页' } },
    { path: 'main/:id', component: _import('public/index'), name: 'publicMain', meta: { title: '公共资源' } }
  ]
}]

export default Public
