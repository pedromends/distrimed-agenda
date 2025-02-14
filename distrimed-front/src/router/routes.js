const routes = [
  {
    path: '/',
    component: () => import('pages/LoginScreen.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/room-one', component: () => import('pages/RoomOne.vue') },
      { path: '/room-two', component: () => import('pages/RoomTwo.vue') },
      { path: '/room-three', component: () => import('pages/RoomThree.vue') },
    ],
  },
]

export default routes
