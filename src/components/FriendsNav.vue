<template>
  <div class="h-screen flex flex-col last:justify-end">

    <div class="p-3 flex justify-between items-center">
      <button @click="showPartners" v-bind:class="{ active: isPartnersVisible }" class="p-2 bg-gray-900 h-10 rounded text-xs hover:bg-darkgreen focus:outline-none">Partners</button>
      <button @click="showNewPartners" v-bind:class="{ active: isNewPartnersVisible }" class="p-2 bg-gray-900 h-10 rounded text-xs hover:bg-darkgreen focus:outline-none">New Partners</button>
      <button @click="changeOrder" class="h-10 w-10 bg-lightgreen rounded hover:opacity-80 focus:outline-none">
        <font-awesome-icon :icon="['fas', 'sort-alpha-down']" v-if="sortOrder == 1" />
        <font-awesome-icon :icon="['fas', 'sort-alpha-up']" v-else />
      </button>
    </div>

    <div class="py-2 overflow-y-auto">
      <button v-show="isNewPartnersVisible" v-for="user in sortedUsers" :key="user.uid" @click="showProfile(user)" class="w-full flex items-center h-16 border-b border-gray-700 focus:outline-none">
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
      sortOrder: 1,
    }
  },
  methods: {
    changeOrder(){
      this.sortOrder = this.sortOrder > 0 ? -1 : 1
    },
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
  computed: {
    sortedUsers() {
      return this.$store.state.users.slice().sort((a, b) => {
        let textA = a.displayName.toUpperCase()
        let textB = b.displayName.toUpperCase()
        return (textA < textB) ? -this.sortOrder : (textA > textB) ? this.sortOrder : 0
      })
    }
  }
}
</script>

<style scoped>
.active {
  background-color: #286053;
}
</style>