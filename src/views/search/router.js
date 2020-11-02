const _import = require('@/router/_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '@/views/layout/Layout'


const Search = [{
  path: '/search',
  component: Layout,
  meta: { title: '搜索', icon: 'zip' },
  children: [
    // { path: 'main', component: _import('personal/index'), name: 'personal', meta: { title: '个人资源库' } },
    { path: 'main/:query', component: _import('search/index'), name: 'search', meta: { title: '搜索' } }
  ]
}]

export default Search
