<template>
  <div class="h-screen flex flex-col last:justify-end">

    <div class="p-3 flex justify-between items-center">
      <button @click="showPartners" v-bind:class="{ active: isPartnersVisible }" class="p-2 bg-gray-900 h-10 rounded text-xs hover:bg-darkgreen focus:outline-none">Partners</button>
      <button @click="showNewPartners" v-bind:class="{ active: isNewPartnersVisible }" class="p-2 bg-gray-900 h-10 rounded text-xs hover:bg-darkgreen focus:outline-none">New Partners</button>
      <button class="h-10 w-10 bg-lightgreen rounded hover:opacity-80 focus:outline-none">
        <font-awesome-icon :icon="['fas', 'tasks']" />
      </button>
    </div>

    <div class="py-2 overflow-y-auto">
      <button v-show="isNewPartnersVisible" v-for="user in $store.state.users" :key="user.uid" @click="showProfile(user)" class="w-full flex items-center h-16 border-b border-gray-700 focus:outline-none">
        <img :src="user.photoURL" v-if="user.photoURL" class="mx-3 bg-black h-12 w-12 rounded-full" />
        <img src="@/assets/logo.png" v-else class="mx-3 bg-black h-12 w-12 rounded-full" />
        <div class="relative -inset-x-7 inset-y-4 h-4 w-4 rounded-full bg-white flex items-center justify-center">
          <div class="relative h-2 w-2 rounded-full bg-red-600" />
        </div>
        <div class="p-3 flex-grow flex flex-col items-start">
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
            <span class="rounded-full w-3 h-3 mr-2" :class="[isOnline(user) ? 'bg-lightgreen' : 'bg-gray-600']" />
          </div>
        </div>
      </button>
    </div>

    <!-- <div class="overflow-y-scroll">
      <div class="px-4 mt-5 flex items-center">
        <button @click="toggleUsersVisible" class="p-1 w-6 text-white opacity-25 rounded hover:bg-black focus:outline-none">
          <font-awesome-icon :icon="['fas', 'caret-down']" v-if="isUsersVisible" />
          <font-awesome-icon :icon="['fas', 'caret-right']" v-else />
        </button>
        <div class="font-bold opacity-50 text-lg">New Friends Recommendation</div>
      </div>
      <button v-show="isUsersVisible" v-for="user in $store.state.users" :key="user.uid" @click="directMessage(user)" class="w-full pl-8 mt-2 flex items-center hover:bg-black focus:outline-none">
        <span class="rounded-full w-3 h-3 mr-2" :class="[isOnline(user) ? 'bg-yellow-400' : 'bg-gray-600']" />
        <span class="opacity-50">{{ user.displayName }}</span>
        <font-awesome-icon :icon="['fas', 'comment']" class="ml-3 text-red-600" />
        <div class="rounded-full w-9 ml-auto mr-5 bg-red-600">{{ countUnread(user.uid) }}</div>
      </button>
    </div> -->

  </div>
</template>

<script>
import firebase from "firebase/app"
import "firebase/auth"

export default {
  data() {
    return {
      uid: "",
      isPartnersVisible: false,
      isNewPartnersVisible: true,
    }
  },
  methods: {
    isOnline(user) {
      return user.status === "online" ? true : false
    },
    showPartners() {
      this.isPartnersVisible = true
      this.isNewPartnersVisible = false
    },
    showNewPartners() {
      this.isPartnersVisible = false
      this.isNewPartnersVisible = true
    },
    showProfile(user) {
      this.$emit("showProfile",user)
    },
  },
  mounted() {
    this.uid = firebase.auth().currentUser.uid
  },
}
</script>

<style scoped>
.active {
  background-color: #286053;
}
</style>