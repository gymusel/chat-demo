import Vue from "vue"
import VueRouter from "vue-router"
import firebase from "firebase/app"
import "firebase/auth"
import Home from "../views/Home.vue"
import Profile from "../views/Profile.vue"
import Friends from "../views/Friends.vue"
import About from "../views/About.vue"
import Register from "../views/Register.vue"
import SignIn from "../views/SignIn.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    beforeEnter: (to, from, next) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log(user)
          next()
        } else {
          next("/signin")
        }
      })
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    beforeEnter: (to, from, next) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log(user)
          next()
        } else {
          next("/signin")
        }
      })
    },
  },
  {
    path: "/friends",
    name: "friends",
    component: Friends,
    beforeEnter: (to, from, next) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log(user)
          next()
        } else {
          next("/signin")
        }
      })
    },
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/signin",
    name: "signIn",
    component: SignIn,
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
