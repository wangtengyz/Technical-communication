export default [
  {
    path: '/',
    redirect: '/painting'
  },
  // 画布编辑器
  {
    path: '/painting',
    name: 'painting',
    component: () => import(/* webpackChunkName: "imageEdit" */ '@/pages/Painting/index.vue'),
  },
];
