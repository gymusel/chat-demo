<template>
  <div class="h-screen flex flex-col">
    <div class="w-full p-3 flex justify-between items-center">
      <button
        @click="togglePartners"
        v-bind:class="{ active: isPartnersVisible }"
        class="
          flex-grow
          sm:flex-grow-0
          m-2
          sm:m-0
          p-2
          bg-gray-900
          h-10
          rounded
          text-xs
          hover:bg-darkgreen
          focus:outline-none
        "
      >
        Partners
      </button>
      <button
        @click="togglePartners"
        v-bind:class="{ active: !isPartnersVisible }"
        class="
          flex-grow
          sm:flex-grow-0
          m-2
          sm:m-0
          p-2
          bg-gray-900
          h-10
          rounded
          text-xs
          hover:bg-darkgreen
          focus:outline-none
        "
      >
        New Partners
      </button>
      <button
        @click="changeOrder"
        class="
          m-2
          sm:m-0
          h-10
          w-10
          bg-lightgreen
          rounded
          hover:opacity-80
          focus:outline-none
        "
      >
        <font-awesome-icon
          :icon="['fas', 'sort-alpha-down']"
          v-if="sortOrder == 1"
        />
        <font-awesome-icon :icon="['fas', 'sort-alpha-up']" v-else />
      </button>
    </div>

    <div class="mb-24 sm:mb-0 py-2 overflow-y-auto">
      <button
        v-for="user in sortedUsers"
        :key="user.uid"
        @click="showProfile(user)"
        class="
          w-full
          flex
          items-center
          h-16
          border-b border-gray-700
          focus:outline-none
        "
      >
        <div class="ml-3 flex items-end">
          <img
            :src="user.photoURL"
            v-if="user.photoURL"
            class="bg-black h-12 w-12 object-cover rounded-full"
          />
          <img
            src="@/assets/logo.png"
            v-else
            class="bg-black h-12 w-12 rounded-full"
          />
          <country-flag
            country="jp"
            size="small"
            rounded
            class="mt-auto relative right-4"
          />
        </div>
        <div class="pr-3 flex-grow flex flex-col items-start">
          <div class="w-full flex justify-between items-center">
            <p class="font-bold text-sm">{{ user.displayName }}</p>
            <!-- <div class="mb-1 flex items-center justify-center rounded-2xl w-10 h-5 bg-blue-400 text-sm"><font-awesome-icon :icon="['fas', 'mars']" />22</div> -->
          </div>
          <div class="w-full flex justify-between items-center">
            <div class="font-thin text-xs flex items-center">
              <p>{{ user.nativeLang1.toUpperCase() }}</p>
              <font-awesome-icon :icon="['fas', 'exchange-alt']" class="mx-1" />
              <p>{{ user.learningLang1.toUpperCase() }}</p>
            </div>
            <span
              class="rounded-full w-3 h-3 mr-2"
              :class="[isOnline(user) ? 'bg-lightgreen' : 'bg-gray-600']"
            />
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app"
import "firebase/auth"

export default {
  data() {
    return {
      uid: "",
      isPartnersVisible: true,
      sortOrder: 1,
    }
  },
  methods: {
    changeOrder() {
      this.sortOrder = this.sortOrder > 0 ? -1 : 1
    },
    isOnline(user) {
      return user.status === "online" ? true : false
    },
    togglePartners() {
      this.isPartnersVisible = this.isPartnersVisible ? false : true
    },
    showProfile(user) {
      this.$emit("showProfile", user)
    },
  },
  mounted() {
    this.uid = firebase.auth().currentUser.uid
    if (!this.$store.state.follows.length) {
      this.isPartnersVisible = false
    }
  },
  computed: {
    sortedUsers() {
      const users = this.isPartnersVisible ? this.$store.state.follows : this.$store.state.users
      return users.slice().sort((a, b) => {
        let textA = a.displayName.toUpperCase()
        let textB = b.displayName.toUpperCase()
        return textA < textB
          ? -this.sortOrder
          : textA > textB
          ? this.sortOrder
          : 0
      })
    },
  },
}
</script>

<style scoped>
.active {
  background-color: #286053;
}
</style>
