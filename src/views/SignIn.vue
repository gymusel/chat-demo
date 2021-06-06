<template>
  <div class="flex">
    <header class="hidden md:inline bg-darkgreen w-64 pt-32 px-5">
      <h1 class="font-bold text-4xl my-4">chat demo</h1>
      <h3 class="font-semibold">Talk to the World</h3>
      <p class="flex-wrap my-6">
        Learn a language by chatting with native speakers around the world. For
        free!
      </p>
      <font-awesome-icon
        :icon="['fas', 'globe']"
        size="10x"
        transform="grow-16 down-28 right-8"
      />
    </header>
    <div class="z-10 bg-gray-800 flex-grow flex items-center justify-center">
      <div class="w-full flex justify-center">
        <div class="w-5/6">
          <div
            class="
              h-12
              w-12
              flex
              items-center
              justify-center
              rounded-lg
              bg-lightgreen
            "
          >
            <font-awesome-icon :icon="['fas', 'thumbs-up']" size="2x" />
          </div>
          <h2 class="text-4xl font-bold my-5">Wellcome!</h2>
          <p class="text-gray-400">Sign in to continue</p>
          <form
            @submit.prevent="signIn"
            class="mt-4 flex flex-col items-center"
          >
            <div class="w-full my-2 flex items-center">
              <div
                class="
                  mr-2
                  h-12
                  w-12
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  bg-darkyellow
                "
              >
                <font-awesome-icon
                  :icon="['fas', 'envelope']"
                  class="text-lightyellow"
                />
              </div>
              <input
                type="email"
                v-model="email"
                ref="input"
                placeholder="email"
                class="
                  bg-gray-800
                  w-full
                  text-xl
                  p-3
                  rounded
                  focus:outline-none
                  focus:bg-gray-700
                "
              />
            </div>
            <div class="w-full my-2 flex items-center">
              <div
                class="
                  mr-2
                  h-12
                  w-12
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  bg-darkred
                "
              >
                <font-awesome-icon
                  :icon="['fas', 'lock']"
                  class="text-lightred"
                />
              </div>
              <input
                type="password"
                v-model="password"
                placeholder="password"
                class="
                  bg-gray-800
                  w-full
                  text-xl
                  p-3
                  rounded
                  focus:outline-none
                  focus:bg-gray-700
                "
              />
            </div>

            <div v-if="errors.length">
              <ul class="my-4">
                <li
                  v-for="(error, index) in errors"
                  :key="index"
                  class="font-semibold text-lightred"
                >
                  {{ error }}
                </li>
              </ul>
            </div>

            <button
              type="submit"
              class="
                my-6
                w-full
                h-12
                bg-lightgreen
                rounded-lg
                flex
                items-center
                justify-center
                focus:outline-none
              "
            >
              <p class="mr-2">Sign in</p>
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </button>
          </form>
          <p class="flex justify-center text-gray-400">Forgot password?</p>
          <router-link
            to="/register"
            class="
              my-6
              w-full
              h-12
              bg-darkgreen
              rounded-lg
              flex
              items-center
              justify-center
              focus:outline-none
            "
          >
            <p>Create an account</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app"
import "firebase/auth"

export default {
  data() {
    return {
      email: "",
      password: "",
      errors: [],
    }
  },
  mounted() {
    if (matchMedia("(min-width: 640px)").matches) {
      this.$refs.input.focus()
    }
  },
  methods: {
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((response) => {
          console.log(response)
          this.$router.push("/")
        })
        .catch(() => {
          this.password = ""
          this.errors.push("Invalid email or password.")
        })
    },
  },
}
</script>
