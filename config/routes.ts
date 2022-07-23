export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/overview',
    name: 'overview',
    icon: 'global',
    component: './Overview',
  },
  {
    path: '/connection',
    name: 'connection',
    icon: 'apartment',
    component: './Connection',
  },
  {
    path: '/datasource',
    name: 'datasource',
    icon: 'database',
    component: './DataSource',
  },
  {
    path: '/sharingrule',
    name: 'sharingrule',
    icon: 'partition',
    component: './SharingRule',
  },
  {
    path: '/tenants',
    name: 'tenants',
    icon: 'usergroupAdd',
    component: './Tenants',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    path: '/',
    redirect: '/overview',
  },
  {
    component: './404',
  },
];
