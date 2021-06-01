<template>
  <div class="flex">
    <FriendsNav @showProfile="showProfile" :class="{ 'hidden sm:inline': !isNavVisible }" class="w-full sm:w-64 border-r border-gray-700" />

    <div v-show="isProfileVisible" :class="{ 'hidden sm:inline': isNavInvisible }" class="mb-24 sm:mb-0 lg:flex lg:justify-between lg:flex-wrap flex-grow h-screen overflow-y-auto">
      <button @click="toggleNavVisible" class="sm:hidden focus:outline-none mt-5 mx-5 flex items-center">
        <font-awesome-icon :icon="['fas', 'angle-left']" size="2x" />
        <h1 class="ml-5 font-bold">Back to previous page</h1>
      </button>
      <div class="pt-5 px-5 xl:p-5 lg:flex lg:flex-col lg:justify-between xl:h-screen xl:w-1/2 w-full">
        <div class="p-3 w-full flex flex-col items-center rounded-2xl bg-gray-700">
          <div class="w-full flex justify-around">
            <button @click="message" class="hover:text-lightgreen focus:outline-none"><font-awesome-icon :icon="['fas', 'comment']" size="2x" /></button>
            <img :src="photoURL" v-if="photoURL" class="h-28 w-28 rounded-full" />
            <img src="@/assets/logo.png" v-else class="h-28 w-28 rounded-full" />
            <button class="hover:text-lightred focus:outline-none"><font-awesome-icon :icon="['fas', 'heart']" size="2x" /></button>
          </div>
          <country-flag country='jp' rounded class="relative bottom-5 left-11" />
          <h1 class="font-bold text-3xl">{{ displayName }}</h1>
        </div>
        <div class="lg:flex-grow p-3 mt-5 w-full flex flex-col rounded-2xl bg-darkyellow">
          <div class="mb-2 flex items-center">
            <div class="mr-2 h-12 w-12 flex items-center justify-center rounded-lg bg-lightyellow">
              <font-awesome-icon :icon="['fas', 'bullhorn']" size="2x" />
            </div>
            <h1 class="font-bold text-xl">Self Introduction</h1>
          </div>
          <p class="flex-grow w-full p2">{{ selfIntroduction }}</p>
        </div>
      </div>
      <div class="mb-24 sm:mb-0 lg:flex lg:flex-col lg:justify-between xl:h-screen xl:w-1/2 w-full p-5">
        <div class="p-3 w-full flex flex-col rounded-2xl bg-darkgreen">
          <div class="mb-2 flex items-center">
            <div class="mr-2 h-12 w-12 flex items-center justify-center rounded-lg bg-lightgreen">
              <font-awesome-icon :icon="['fas', 'people-arrows']" size="2x" />
            </div>
            <h1 class="font-bold text-xl">Language Exchange</h1>
          </div>
          <div class="flex-grow flex items-center justify-center">
            <p>{{ nativeLang1.toUpperCase() }}</p>
            <font-awesome-icon :icon="['fas', 'exchange-alt']" size="2x" class="m-4" />
            <p>{{ learningLang1.toUpperCase() }}</p>
          </div>
        </div>
        <div class="lg:flex-grow p-3 mt-5 w-full flex flex-col rounded-2xl bg-darkred">
          <div class="mb-2 flex items-center">
            <div class="mr-2 h-12 w-12 flex items-center justify-center rounded-lg bg-lightred">
              <font-awesome-icon :icon="['fas', 'icons']" size="2x" />
            </div>
            <h1 class="font-bold text-xl">Hobbies</h1>
          </div>
          <div class="flex items-center flex-wrap">
            <p v-for="hobby in hobbies" :key="hobby" class="m-2 px-2 rounded-2xl bg-lightred">{{ hobby }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import FriendsNav from "../components/FriendsNav.vue"
import firebase from "firebase/app"
import "firebase/auth"

export default {
  components: {
    FriendsNav,
  },
  data() {
    return {
      isNavVisible: true,
      isNavInvisible: false,
      currentUserId: "",
      isProfileVisible: false,
      user: {},
      displayName: "",
      photoURL: "",
      nativeLang1: "ja",
      learningLang1: "en",
      hobbies: [],
      selfIntroduction: "",
    }
  },
  mounted() {
    this.currentUserId = firebase.auth().currentUser.uid
    if (matchMedia('(max-width: 640px)').matches) {
      this.isNavInvisible = true
    }
  },
  methods: {
    toggleNavVisible() {
      if (matchMedia('(max-width: 640px)').matches) {
        this.isNavVisible = this.isNavInvisible = this.isNavVisible ? false : true
      }
    },
    showProfile(user) {
      this.toggleNavVisible()
      this.isProfileVisible = true
      this.user = user
      this.displayName = user.displayName
      this.photoURL = user.photoURL
      this.nativeLang1 = user.nativeLang1
      this.learningLang1 = user.learningLang1
      this.hobbies = user.hobbies
      this.selfIntroduction = user.selfIntroduction
    },
    message() {
      const roomId = this.currentUserId > this.user.uid ? (this.currentUserId + "-" + this.user.uid) : (this.user.uid + "-" + this.currentUserId)
      
      let newChannel = firebase.database().ref("channel").child(roomId)
      
      newChannel.set({
        users: [this.currentUserId,this.user.uid],
        id: roomId,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      })

      this.$store.state.channels.forEach(function(channel) {
        if (channel.id == roomId) {
          newChannel = channel
        }
      })
      
      this.$store.commit("setRoom", newChannel)

      this.$store.commit("setRoomId", roomId)

      const participants = [this.$store.state.user, this.user]
      this.$store.commit("setParticipants", participants)

      if (roomId) {
        firebase.database().ref("messages").child(roomId).off()
      }

      let messages = []
      firebase.database().ref("messages").child(roomId).on("child_added", (snapshot) => {
        messages.push(snapshot.val())
      })
      this.$store.commit("setMessages", messages)

      this.$router.push('/')
    },
  },
}
</script>
