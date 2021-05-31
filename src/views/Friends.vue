<template>
  <div class="flex">
    <FriendsNav @showProfile="showProfile" class="w-64 border-r border-gray-700" />

    <div v-show="isProfileVisible" class="flex-grow flex flex-col justify-between p-6">
      <div class="h-48 mb-6 flex items-center justify-around rounded-2xl bg-gray-700">
        <button @click="message" class="hover:text-lightgreen focus:outline-none"><font-awesome-icon :icon="['fas', 'comment']" size="2x" /></button>
        <div class="flex flex-col items-center justify-around">
          <img :src="photoURL" v-if="photoURL" class="h-28 w-28 rounded-full" />
          <img src="@/assets/logo.png" v-else class="h-28 w-28 rounded-full" />
          <div class="relative inset-x-10 -inset-y-8 h-8 w-8 rounded-full bg-white flex items-center justify-center">
            <div class="relative h-5 w-5 rounded-full bg-red-600" />
          </div>
          <h1 class="font-bold text-3xl -m-5">{{ displayName }}</h1>
        </div>
        <button class="hover:text-lightred focus:outline-none"><font-awesome-icon :icon="['fas', 'heart']" size="2x" /></button>
      </div>
      <div class="flex justify-between flex-grow">
        <div class="w-48% flex flex-col justify-between">
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
          <div class="p-3 mt-6 flex-grow w-full flex flex-col rounded-2xl bg-darkred">
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

        <div class="w-48% p-3 w-full flex flex-col rounded-2xl bg-darkyellow">
          <div class="mb-2 flex items-center">
            <div class="mr-2 h-12 w-12 flex items-center justify-center rounded-lg bg-lightyellow">
              <font-awesome-icon :icon="['fas', 'bullhorn']" size="2x" />
            </div>
            <h1 class="font-bold text-xl">Self Introduction</h1>
          </div>
          <p class="flex-grow w-full p2">{{ selfIntroduction }}</p>
          <!-- <p>hello! i’m a 4th grade university student living in Japan.<br><br>i’m happy to talk in English or Japanese so let’s have a chat! (or call if you would like) 日本語でもOK!<br><br>i love traveling and gymnastics but after this pandemic happened, i’ve been getting into playstation games! i also love music, comics, cooking, netflix, and making web applications.<br><br>message me if you would like to talk😊</p> -->
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
  },
  methods: {
    showProfile(user) {
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
