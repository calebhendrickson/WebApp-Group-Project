import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/views/Home'
import Auth from '@/components/views/auth/Auth'
import Signup from '@/components/views/auth/signup/Signup'
import Login from '@/components/views/auth/login/Login'
import User from '@/components/user/User'
import ViewUser from '@/components/user/View'
import EditUser from '@/components/user/Edit'
import firebase from '@/firebase'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'signup',
          name: 'Signup',
          component: Signup
        }
      ]
    },
    {
      path: '/user/:name',
      component: User,
      props: true,
      children: [
        {
          path: '',
          component: ViewUser
        },
        {
          path: 'settings',
          component: EditUser
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let user = firebase.auth().currentUser
  if (!user) {
    if (to.name !== 'Login' && to.name !== 'Signup') {
      next('/auth/login')
    } else {
      next()
    }
  } else if (user) {
    if (to.name === 'Auth' || to.name === 'Login' || to.name === 'Signup') {
      next('/')
    } else {
      next()
    }
  }
})

export default router
