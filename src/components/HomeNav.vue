<template>
  <div>

    <div v-if="roomSelect" class="h-screen flex flex-col">
      <div class="p-3 flex justify-between items-center">
        <input placeholder="Search" class="h-10 w-44 p-3 bg-gray-900 rounded focus:outline-none" />
        <button @click="toggleRoomSelect" class="h-10 w-10 bg-lightgreen rounded hover:opacity-80 focus:outline-none">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </button>
      </div>
      <div class="h-full overflow-y-scroll">
        <button v-for="channel in $store.state.channels" :key="channel.id" @click="message(channel)" class="w-full flex items-center h-16 border-b border-gray-700 focus:outline-none">
          <img :src="channel.photoURL" v-if="channel.photoURL" class="mx-3 bg-black h-12 w-12 rounded-full" />
          <img :src="channel.opponent.photoURL" v-else-if="channel.opponent && channel.opponent.photoURL" class="mx-3 bg-black h-12 w-12 rounded-full" />
          <img src="@/assets/logo.png" v-else class="mx-3 bg-black h-12 w-12 rounded-full" />

          <div class="p-3 flex-grow flex flex-col items-start">
            <div class="w-full flex justify-between items-center">
              <p v-if="channel.opponent" class="font-bold text-sm">{{ channel.opponent.displayName }}</p>
              <p v-else class="font-bold text-sm">{{ channel.displayName }}</p>
              <p class="font-light text-xs">4:20 PM</p>
            </div>
            <div class="w-full flex justify-between items-center">
              <p class="font-thin text-xs">hello</p>
              <div class="font-light text-xs bg-lightgreen h-4 w-4 rounded-full">3</div>
            </div>
          </div>
        </button>
      </div>
    </div>

    <div v-else class="h-screen flex flex-col">
      <div class="p-3 flex justify-between items-center">
        <h1 class="font-bold text-xl">Create a chat room</h1>
        <button @click="toggleRoomSelect" class="h-10 w-10 bg-lightred rounded hover:opacity-80 focus:outline-none">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
      <div class="h-full w-full overflow-y-scroll">
        <button v-for="user in $store.state.users" :key="user.uid" class="w-full flex items-center h-16 border-b border-gray-700 focus:outline-none">
          <img :src="user.photoURL" v-if="user.photoURL" class="mx-3 bg-black h-12 w-12 rounded-full" />
          <img src="@/assets/logo.png" v-else class="mx-3 bg-black h-12 w-12 rounded-full" />
          <div class="relative -inset-x-7 inset-y-4 h-4 w-4 rounded-full bg-white flex items-center justify-center">
            <div class="relative h-2 w-2 rounded-full bg-red-600" />
          </div>
          <p class="font-bold text-sm">{{ user.displayName }}</p>
          <button @click="toggleUserChecked(user.uid)" class="ml-auto mr-4 hover:text-lightgreen focus:outline-none">
            <font-awesome-icon :icon="['fas', 'check-circle']" v-if="checkedUsers.includes(user.uid)" size="2x" class="text-lightgreen" />
            <font-awesome-icon :icon="['fas', 'plus-circle']" v-else size="2x" />
          </button>
        </button>
      </div>
      <div class="mt-auto w-full px-2">
        <input type="text" v-if="checkedUsers.length >= 3" v-model="channel" placeholder="Enter a chat room name" class="my-3 p-2 w-full h-12 rounded bg-gray-700 focus:outline-none" />
        <p class="font-semibold text-lightred">{{ error }}</p>
        <button @click="addChannel" class="font-bold text-xl my-3 p-2 w-full h-12 rounded bg-lightgreen hover:bg-darkgreen focus:outline-none">Create!</button>
      </div>
    </div>

    <!-- If I delete this code, I don't get the opponent info on channel -->
    <div v-show="false" v-for="user in $store.state.users" :key="user.uid" />
    <!-- which means displayName and photoURL are not shown on DM select -->
    
  </div>
</template>

<script>
import firebase from "firebase/app"

export default {
  data() {
    return {
      uid: "",
      roomSelect: true,
      channel: "",
      checkedUsers: [],
      error: "",
    }
  },
  computed: {
    // photoURL: function() {
    //   return function(participants) {
    //     const self = this
    //     let photoURL = ""
    //     participants.forEach(function(participant) {
    //       if (participant.uid != self.uid) {
    //         if (participant.photoURL) {
    //           photoURL = participant.photoURL
    //         } else {
    //           photoURL = ""
    //         }
    //       }
    //     })
    //     return photoURL
    //   }
    // },
    // displayName: function() {
    //   return function(participants) {
    //     const self = this
    //     let displayName = ""
    //     participants.forEach(function(participant) {
    //       if (participant.uid != self.uid) {
    //         displayName = participant.displayName
    //       }
    //     })
    //     return displayName
    //   }
    // },
    // countUnread: function() {
    //   const self = this
    //   return function(uid) {
    //     let countUnread = 0
    //     const messageId = self.uid > uid ? (self.uid + "-" + uid) : (uid + "-" + self.uid)
    //     firebase.database().ref("messages").child(messageId).once("child_added", (snapshot) => {
    //       if (snapshot.val().unread == self.uid) {
    //         countUnread = countUnread + 1
    //       }
    //       // console.log(snapshot.val())
    //     })
    //     // console.log(countUnread)
    //     return countUnread
    //   }
    // },
  },
  methods: {
    toggleRoomSelect() {
      this.roomSelect = this.roomSelect ? false : true
    },
    toggleUserChecked(uid) {
      if (this.checkedUsers.includes(uid)) {
        this.checkedUsers = this.checkedUsers.filter(
          (item) => item !== uid
        )
      } else {
        this.checkedUsers.push(uid)
      }
    },
    addChannel() {
      if (this.checkedUsers.length >= 3) {
        if (this.channel == "") {
          this.error = "Please enter a chat room name."
        } else {
          const newChannel = firebase.database().ref("channel").push()

          const key_id = newChannel.key

          newChannel
            .set({
              displayName: this.channel,
              users: this.checkedUsers,
              id: key_id,
            })
            .then(() => {
              this.channelModal = false
            })

          this.channel = ""
          this.checkedUsers = [this.uid]

          this.toggleRoomSelect()
        }
      } else {
        const self = this
        let user = {}
        this.$store.state.users.forEach(function(item) {
          if (item.uid == self.checkedUsers[1]) {
            user = item
          }
        })

        const roomId = this.uid > user.uid ? (this.uid + "-" + user.uid) : (user.uid + "-" + this.uid)
      
        let newChannel = firebase.database().ref("channel").child(roomId)
        
        newChannel.set({
          users: [this.uid,user.uid],
          id: roomId,
        })

        this.$store.state.channels.forEach(function(channel) {
          if (channel.id == roomId) {
            newChannel = channel
          }
        })
        
        this.$store.commit("setRoom", newChannel)

        this.$store.commit("setRoomId", roomId)

        const participants = [this.$store.state.user, user]
        this.$store.commit("setParticipants", participants)

        if (roomId) {
          firebase.database().ref("messages").child(roomId).off()
        }

        let messages = []
        firebase.database().ref("messages").child(roomId).on("child_added", (snapshot) => {
          messages.push(snapshot.val())
        })
        this.$store.commit("setMessages", messages)

        this.toggleRoomSelect()
      }
    },
    message(channel) {
      this.$store.commit("setRoom", channel)

      this.$store.commit("setRoomId", channel.id)

      let participants = []
      firebase.database().ref("users").once('child_added', function(snapshot) {
        channel.users.forEach(function(user) {
          if (user.uid == snapshot.val().uid) {
            participants.push(snapshot.val())
          }
        })
      })
      this.$store.commit("setParticipants", participants)

      if (channel.id) {
        firebase.database().ref("messages").child(channel.id).off()
      }

      let messages = []
      firebase.database().ref("messages").child(channel.id).on("child_added", (snapshot) => {
        messages.push(snapshot.val())
      })
      this.$store.commit("setMessages", messages)
    },
  },
  mounted() {
    this.uid = firebase.auth().currentUser.uid
    this.checkedUsers.push(this.uid)
  },
}
</script>
