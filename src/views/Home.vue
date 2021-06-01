<template>
  <div class="flex">
    <HomeNav v-on:toggleNavVisible="toggleNavVisible" :class="{ 'hidden sm:inline': !isNavVisible }" class="w-full sm:w-64 border-r border-gray-700" />
    <div :class="{ 'hidden sm:inline': isNavInvisible }" class="flex-grow">
      <div v-if="!$store.state.room_id" class="h-screen flex justify-center items-center text-gray-400">Start a new conversation!</div>

      <div v-else class="h-screen flex flex-col">
        <header class="border-b border-gray-700 text-gray-400 flex justify-between p-3">
          <div class="flex items-center">
            <button @click="toggleNavVisible" class="sm:hidden mr-6 focus:outline-none"><font-awesome-icon :icon="['fas', 'angle-left']" size="2x" /></button>
            <font-awesome-icon :icon="['far', 'star']" class="mr-3" />
            <div v-if="$store.state.room.displayName" class="font-bold text-lg">{{ $store.state.room.displayName }}</div>
            <div v-if="$store.state.room.opponent" class="font-bold text-lg">{{ $store.state.room.opponent.displayName }}</div>
          </div>
          <div class="flex items-center">
            <font-awesome-icon :icon="['fas', 'phone-alt']" class="mx-2" />
            <font-awesome-icon :icon="['fas', 'cog']" class="mx-2" />
          </div>
        </header>
        <main @dragenter="dragEnter" @dragleave="dragLeave" @drop.prevent="dropFile" @dragover.prevent class="flex-grow flex flex-col px-6 overflow-y-auto" ref="message_bottom">
          <div v-for="message in $store.state.messages" :key="message.key" style="pointer-events: none" class="mt-2 mb-4 flex">
            <div v-if="message.uid==$store.state.user.uid" class="ml-auto flex items-end">
              <p class="mr-2 font-thin text-xs text-gray-400">{{ howOld(message.createdAt) }}</p>
              <div>
                <img :data-src="message.url" v-if="message.url" width="360px" height="542px" class="lazyload mt-2 rounded-bl-2xl rounded-t-2xl" />
                <div v-if="message.content" class="whitespace-pre bg-darkgreen px-2 py-1 rounded-bl-2xl rounded-t-2xl">{{ message.content }}</div>
              </div>
            </div>
            <div v-else class="flex">
              <img :src="photoURL(message.uid)" class="h-10 w-10 rounded-full" />
              <div class="ml-2">
                <div class="font-bold">{{ displayName(message.uid) }}</div>
                <img :data-src="message.url" v-if="message.url" width="320px" height="542px" class="lazyload mt-2 rounded-tr-2xl rounded-b-2xl" />
                <div v-if="message.content" class="whitespace-pre bg-gray-500 px-2 py-1 rounded-tr-2xl rounded-b-2xl">{{ message.content }}</div>
              </div>
              <p class="mt-auto ml-2 font-thin text-xs text-gray-400">{{ howOld(message.createdAt) }}</p>
            </div>
          </div>
        </main>

        <div v-show="file_upload_overlay" style="pointer-events: none" class="mx-80 inset-x-0 fixed h-screen z-10 flex justify-center items-center bg-gray-800">
          <p class="font-bold text-4xl">chat demoへアップロードする</p>
        </div>

        <footer class="mb-14 sm:mb-0 border-t border-gray-700">
          <textarea v-model="message" ref="input" @keydown.enter.exact="keyDownEnter" @keyup.enter.exact="keyUpEnter" placeholder="Enter a message" :rows="rows" class="w-full py-4 pl-6 outline-none resize-none bg-gray-800" />
          <div class="flex items-center fill-current text-gray-400 ml-6 mb-2">
            <label class="flex items-center hover:opacity-70">
              <input type="file" @change="setFile" class="absolute opacity-0 w-9" />
              <font-awesome-icon :icon="['fas', 'image']" v-if="!file" size="2x" class="mr-2" />
              <font-awesome-icon :icon="['fas', 'image']" v-else size="2x" class="mr-2 text-green-500" />
              <span v-text="file.name" class="text-green-500" />
            </label>
            <button class="ml-auto mr-5 focus:outline-none">
              <font-awesome-icon :icon="['fas', 'paper-plane']" v-if="!message && !file" />
              <font-awesome-icon :icon="['fas', 'paper-plane']" @click="sendMessage" v-else class="text-green-500" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import HomeNav from "../components/HomeNav.vue"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/storage"
import 'lazysizes'

export default {
  components: {
    HomeNav,
  },
  data() {
    return {
      isNavVisible: true,
      isNavInvisible: false,
      opponents: "",
      message: "",
      file_upload_overlay: false,
      file: "",
      url: "",
    }
  },
  mounted() {
    if (matchMedia('(max-width: 640px)').matches) {
      this.isNavInvisible = true
    }
    if (this.$store.state.room_id) {
      this.toggleNavVisible()
    }
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.input.focus()
      const chatLog = this.$refs.message_bottom
      if (!chatLog) return
      chatLog.scrollTop = chatLog.scrollHeight

      if (this.$store.state.room.users) {
        this.opponents = this.$store.state.room.users.filter(
          (uid) => uid != this.$store.state.user.uid
        )
      } else {
        this.opponents = this.$store.state.room.uid
      }
    })
  },
  methods: {
    toggleNavVisible() {
      if (matchMedia('(max-width: 640px)').matches) {
        this.isNavVisible = this.isNavInvisible = this.isNavVisible ? false : true
      }
    },
    howOld(timestamp) {
      const now = new Date()
      const nowHour = (`${now.getHours()}`).slice(-2)
      const nowMin = (`${now.getMinutes()}`).slice(-2)
      const nowSec = (`${now.getSeconds()}`).slice(-2)

      const time = new Date(timestamp)
      const year = time.getFullYear()
      const month = (`${time.getMonth() + 1}`).slice(-2)
      const day = (`${time.getDate()}`).slice(-2)
      const hour = (`${time.getHours()}`).slice(-2)
      const min = (`${time.getMinutes()}`).slice(-2)
      const sec = (`${time.getSeconds()}`).slice(-2)

      const hourDiff = nowHour - hour
      const minDiff = nowMin - min
      const secDiff = nowSec - sec

      const diff = now - time

      if (diff < 10000) {
        return "now"
      } else if (diff < 60000) {
        return secDiff < 0 ? `${secDiff + 60} seconds` : `${secDiff} seconds`
      } else if (diff < 3600000) {
        return minDiff < 0 ? `${minDiff + 60} minutes` : `${minDiff} minutes`
      } else if (diff < 86400000) {
        return hourDiff < 0 ? `${hourDiff + 24} hours` : `${hourDiff} hours`
      } else if (diff < 2592000000) {
        return `${month}/${day}`
      } else {
        return `${year}/${month}/${day}`
      }
    },
    dragEnter() {
      this.file_upload_overlay = true
    },
    dragLeave() {
      this.file_upload_overlay = false
    },
    dropFile() {
      console.log("drop file")
      this.file_upload_overlay = false
      this.file = event.dataTransfer.files[0]
    },
    setFile() {
      this.file = event.target.files[0]
      console.log("set " + this.file.name)
    },
    keyDownEnter(e) {
      e.preventDefault()
    },
    keyUpEnter(e) {
      e.preventDefault()
      if (this.message === "" && !this.file) {
        console.log("message and file are blank")
      } else {
        this.sendMessage()
      }
    },
    sendMessage() {
      const newMessage = firebase.database().ref("messages").child(this.$store.state.room_id).push()
      const key_id = newMessage.key

      if (!this.file) {
        newMessage.set({
          key: key_id,
          content: this.message,
          uid: this.$store.state.user.uid,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          unread: this.opponents,
        })
        firebase.database().ref("channel").child(this.$store.state.room_id).update({
          newestMessage: this.message,
          "updatedAt": firebase.database.ServerValue.TIMESTAMP,
        })
      } else {
        const storageRef = firebase.storage().ref("images/" + this.file.name)
        const uploadTask = storageRef.put(this.file)
        uploadTask.on(
          "state_changed",
          // (snapshot) => {
          //   let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          //   this.$refs.progress_bar.style.width = percentage + "%"
          // },
          // (error) => {
          //   console.log(error)
          // },
          () => {
            storageRef.getDownloadURL().then((url) => {
              newMessage.set({
                key: key_id,
                uid: this.$store.state.user.uid,
                url: url,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                unread: this.opponents,
              })
            })
          }
        )
        firebase.database().ref("channel").child(this.$store.state.room_id).update({
          newestMessage: "Image sent",
          "updatedAt": firebase.database.ServerValue.TIMESTAMP,
        })
      }
      this.message = this.url = this.file = ""
    },
  },
  computed: {
    photoURL: function() {
      return function(uid) {
        let photoURL = require("@/assets/logo.png")
        this.$store.state.participants.forEach(function(participant) {
          if (participant.uid == uid && participant.photoURL != undefined) {
            photoURL = participant.photoURL
          }
        })
        return photoURL
      }
    },
    displayName: function() {
      return function(uid) {
        let displayName = ""
        this.$store.state.participants.forEach(function(participant) {
          if (participant.uid == uid) {
            displayName = participant.displayName
          }
        })
        return displayName
      }
    },
    // placeholder() {
    //   // if (this.$store.state.room.displayName) {
    //     return "Message " + this.$store.state.room.displayName
    //   // } else {
    //   //   return "Message " + this.$store.state.room.opponent.displayName
    //   // }
    // },
    rows:function(){
      return this.message.split("\n").length
    },
  },
  beforeDestroy() {
    this.$store.commit("resetRoom")
  },
}
</script>
