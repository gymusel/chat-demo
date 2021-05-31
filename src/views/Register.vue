<template>
  <div class="flex">
    <header class="bg-darkgreen w-64 py-3 border-r border-gray-700 flex flex-col items-center">
      <div class="w-4/5 mt-12">
        <h1 class="font-bold text-4xl my-4">chat demo</h1>
        <h3 class="font-semibold">Talk to the World</h3>
        <p class="flex-wrap my-6">Learn a language by chatting with native speakers around the world. For free!</p>
      </div>
      <font-awesome-icon :icon="['fas', 'globe']" size="10x" transform="grow-16" class="mt-auto relative inset-x-16" />
    </header>
    <div class="z-10 bg-gray-800 flex-grow flex items-center justify-center">
      <div class="w-full flex justify-center">
        <div class="w-5/6">
          <div class="h-12 w-12 flex items-center justify-center rounded-lg bg-lightgreen">
            <font-awesome-icon :icon="['fas', 'thumbs-up']" size="2x" />
          </div>
          <h2 class="text-4xl font-bold my-5">Hello!</h2>
          <p class="text-gray-400">Lets introduce</p>
          <form @submit.prevent="registerUser" class="mt-4 flex flex-col items-center">
            <div class="w-full my-2 flex items-center">
                <div class="mr-2 h-12 w-12 flex items-center justify-center rounded-lg bg-darkyellow">
                  <font-awesome-icon :icon="['fas', 'user']" class="text-lightyellow" />
                </div>
                <input type="displayName" v-model="displayName" ref="input" placeholder="name" class="bg-gray-800 w-full text-xl p-3 rounded focus:outline-none focus:bg-gray-700" />
              </div>
            <div class="w-full my-2 flex items-center">
              <div class="mr-2 h-12 w-12 flex items-center justify-center rounded-lg bg-darkyellow">
                <font-awesome-icon :icon="['fas', 'envelope']" class="text-lightyellow" />
              </div>
              <input type="email" v-model="email" placeholder="email" class="bg-gray-800 w-full text-xl p-3 rounded focus:outline-none focus:bg-gray-700" />
            </div>
            <div class="w-full my-2 flex items-center">
              <div class="mr-2 h-12 w-12 flex items-center justify-center rounded-lg bg-darkred">
                <font-awesome-icon :icon="['fas', 'lock']" class="text-lightred" />
              </div>
              <input type="password" v-model="password" placeholder="password" class="bg-gray-800 w-full text-xl p-3 rounded focus:outline-none focus:bg-gray-700" />
            </div>
            
            <div v-if="errors.length">
              <ul class="my-4">
                <li v-for="(error, index) in errors" :key="index" class="font-semibold text-lightred">
                  {{ error }}
                </li>
              </ul>
            </div>
            
            <button type="submit" class="my-6 w-full h-12 bg-lightgreen rounded-lg flex items-center justify-center focus:outline-none">
              <p class="mr-2">Create an account</p>
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </button>
          </form>
          <router-link to="/signin" class="my-6 w-full h-12 bg-darkgreen rounded-lg flex items-center justify-center focus:outline-none">
            <p>Sign in</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

export default {
  data() {
    return {
      displayName: "",
      email: "",
      password: "",
      errors: [],
    }
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    registerUser() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((response) => {
          const user = response.user

          user.updateProfile({
            displayName: this.displayName
          })

          firebase
            .database()
            .ref("users")
            .child(user.uid)
            .set({
              uid: user.uid,
              email: user.email,
              displayName: this.displayName,
              nativeLang1: "ja",
              learningLang1: "en",
              hobbies: [""],
              selfIntroduction: "",
            })
            .then(() => {
              this.$router.push("/")
            })
            .catch((e) => {
              console.log(e)
            })
        })
        .catch((e) => {
          console.log(e)
          if (e.code == "auth/email-already-in-use") {
            this.errors.push("入力したメールアドレスは登録済みです。")
          } else {
            this.errors.push(
              "入力したメールアドレスかパスワードに問題があります。"
            )
          }
        })
    },
  },
}
</script>
