<template>
  <div class="h-screen flex flex-col last:justify-end">
    <div class="px-4 pb-4 border-b border-gray-700  flex justify-between items-center">
      <h1 class="font-semibold text-xl leading-tight">chat demo</h1>
      <font-awesome-icon :icon="['fas', 'bell']" class="h-6 w-6 text-white opacity-25" />
    </div>
    <div class="overflow-y-scroll">
      <!-- channel -->
      <div class="px-4 mt-5 flex items-center">
        <button @click="toggleChannelsVisible" class="p-1 w-6 text-white opacity-25 rounded hover:bg-black focus:outline-none">
          <font-awesome-icon :icon="['fas', 'caret-down']" v-if="isChannelsVisible" />
          <font-awesome-icon :icon="['fas', 'caret-right']" v-else />
        </button>
        <div class="font-bold opacity-50 text-lg">チャンネル</div>
        <button class="ml-auto text-white opacity-25 rounded hover:opacity-100 focus:outline-none">
          <font-awesome-icon :icon="['fas', 'plus-circle']" @click="showChannelModal" />
        </button>
        <!-- modal -->
        <div v-show="channelModal" @click="closeChannelModal" class="z-20 fixed top-0 left-0 h-full w-full flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5)">
          <div @click.stop class="z-20 bg-white text-gray-900 w-1/3 rounded-md">
            <div class="flex flex-col p-6 modal">
              <div class="flex justify-between items-center">
                <h2 class="text-3xl font-black leading-loose">チャンネルを作成する</h2>
                <span @click="closeChannelModal" class="text-4xl">×</span>
              </div>
              <input type="text" v-model="channel" placeholder="チャンネル名" class="my-3 w-full rounded border-gray-900 border-solid border p-3" />
              <p class="text-xl font-bold pb-2">招待するメンバーを選択</p>
              <div class="overflow-y-scroll">
                <div v-for="user in $store.state.users" :key="user.uid">
                  <input type="checkbox" :value="user.uid" v-model="checkedUsers" class="checkbox" />
                  <span>{{ user.displayName }}</span>
                </div>
              </div>
              <button @click="addChannel" class="mt-3 px-8 py-2 rounded bg-green-900 font-bold text-white">作成</button>
            </div>
          </div>
        </div>
      </div>
      <button v-show="isChannelsVisible" v-for="channel in $store.state.channels" :key="channel.id" @click="channelMessage(channel)" class="w-full pl-8 flex flex-col opacity-50 mt-1 hover:bg-black focus:outline-none">
        <span># {{ channel.displayName }}</span>
      </button>

      <!-- direct message -->
      <div class="px-4 mt-5 flex items-center">
        <button @click="toggleUsersVisible" class="p-1 w-6 text-white opacity-25 rounded hover:bg-black focus:outline-none">
          <font-awesome-icon :icon="['fas', 'caret-down']" v-if="isUsersVisible" />
          <font-awesome-icon :icon="['fas', 'caret-right']" v-else />
        </button>
        <div class="font-bold opacity-50 text-lg">ダイレクトメッセージ</div>
        <!-- <button class="ml-auto text-white opacity-25 rounded hover:opacity-100 focus:outline-none">
          <font-awesome-icon :icon="['fas', 'plus-circle']" />
        </button> -->
      </div>
      <button v-show="isUsersVisible" v-for="user in $store.state.users" :key="user.uid" @click="directMessage(user)" class="w-full pl-8 mt-2 flex items-center hover:bg-black focus:outline-none">
        <span class="rounded-full w-3 h-3 mr-2" :class="[isOnline(user) ? 'bg-yellow-400' : 'bg-gray-600']" />
        <span class="opacity-50">{{ user.displayName }}</span>
        <!-- <font-awesome-icon :icon="['fas', 'comment']" class="ml-3 text-red-600" /> -->
        <!-- <div class="rounded-full w-9 ml-auto mr-5 bg-red-600">{{ countUnread(user.uid) }}</div> -->
      </button>
    </div>

    <button @click="showEditProfileModal" class="mx-3 text-white mt-auto rounded-3xl flex items-center bg-gray-900 hover:bg-opacity-50 focus:outline-none">
      <img :src="$store.state.user.photoURL" v-if="$store.state.user.photoURL" class="h-12 w-12 rounded-full p-1" />
      <img src="@/assets/logo.png" v-else class="h-12 w-12 rounded-full p-1" />
      <p>{{ $store.state.user.displayName }}</p>
      <font-awesome-icon :icon="['fas', 'ellipsis-h']" class="opacity-25 ml-auto mr-2" />
    </button>
    <div v-show="editProfileModal" @click="closeEditProfileModal" class="z-20 fixed top-0 left-0 h-full w-full flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5)">
      <div v-on:click.stop class="z-20 bg-white text-gray-900 rounded-md flex flex-col items-center text-center"><EditProfileModal @closeEditProfileModal="closeEditProfileModal" /></div>
    </div>
  </div>
</template>

<script>
import EditProfileModal from "./EditProfileModal.vue"
import firebase from "firebase/app"

export default {
  components: {
    EditProfileModal,
  },
  data() {
    return {
      uid: "",
      editProfileModal: false,
      isChannelsVisible: true,
      channelModal: false,
      channel: "",
      checkedUsers: [],
      isUsersVisible: true,
    }
  },
  computed: {
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
    // }
  },
  methods: {
    setUser() {
      const self = this
      firebase.auth().onAuthStateChanged((user) => {
        firebase.database().ref("users").child(user.uid).get().then(function(snapshot) {
          self.$store.commit("setCurrentUser", snapshot.val())
        })
      })
    },
    setChannels() {
      let channels = []
      firebase.database().ref("channel").on("child_added", (snapshot) => {
        if (snapshot.val().users.includes(this.uid)) {
          channels.push(snapshot.val())
        }
      })
      this.$store.commit("setChannels", channels)
    },
    setUsers() {
      const self = this
      let users = []
      firebase.database().ref("users").on("child_added", (snapshot) => {
        let user = snapshot.val()
        user.status = "offline"

        ///
        // let countUnread = 0
        // const messageId = self.uid > user.uid ? (self.uid + "-" + user.uid) : (user.uid + "-" + self.uid)
        // firebase.database().ref("messages").child(messageId).on("child_added", (snap) => {
        //   if (snap.val().unread == self.uid) {
        //     countUnread = countUnread + 1
        //   }
        // })
        // user.countUnread = countUnread
        ///

        if (self.uid != user.uid) {
          users.push(user)
        }
      })
      console
      this.$store.commit("setUsers", users)
    },
    setConnected() {
      firebase.database().ref(".info/connected").on("value", (snapshot) => {
        if (snapshot.val() === true) {
          let ref = firebase.database().ref("connections").push()
          this.$store.commit("setConnectionKey", ref.key)
          ref.onDisconnect().remove()

          ref.set({
            uid: this.uid,
            key: this.$store.state.connection_key,
          })
        }
      })
    },
    setConnectionAdded() {
      firebase.database().ref("connections").on("child_added", (snapshot) => {
        let new_connection = snapshot.val()
        this.$store.commit("setConnections", new_connection)

        let user = this.$store.state.users.find(
          (user) => user.uid === new_connection.uid
        )

        if (user != undefined) {
          user.status = "online"
        }
      })
    },
    setConnectionRemoved() {
      firebase.database().ref("connections").on("child_removed", (snapshot) => {
        let remove_connection = snapshot.val()

        this.$store.state.connections = this.$store.state.connections.filter(
          (connection) => connection.key !== remove_connection.key
        )

        let index = this.$store.state.connections.findIndex((connection) => {
          return connection.uid === remove_connection.uid
        })

        if (index === -1) {
          let user = this.$store.state.users.find(
            (user) => user.uid == remove_connection.uid
          )
          user.status = "offline"
        }
      })
    },
    showEditProfileModal() {
      this.editProfileModal = true;
    },
    closeEditProfileModal() {
      this.editProfileModal = false;
    },
    isOnline(user) {
      return user.status === "online" ? true : false
    },
    toggleChannelsVisible() {
      this.isChannelsVisible = !this.isChannelsVisible
    },
    showChannelModal() {
      this.channelModal = true
    },
    closeChannelModal() {
      this.channelModal = false
    },
    addChannel() {
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
    },
    channelMessage(channel) {
      this.$store.commit("setRoom", channel)

      this.$store.commit("setRoomId", channel.id)

      let participants = []
      firebase.database().ref("users").once('child_added', function(snapshot) {
        if (channel.users.includes(snapshot.val().uid)) {
          participants.push(snapshot.val())
        }
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
    toggleUsersVisible() {
      this.isUsersVisible = !this.isUsersVisible
    },
    directMessage(user) {
      this.$store.commit("setRoom", user)

      const self = this
      const messageId = this.uid > user.uid ? (this.uid + "-" + user.uid) : (user.uid + "-" + this.uid)
      this.$store.commit("setRoomId", messageId)

      firebase.database().ref("messages").child(messageId).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          if (child.val().unread == self.uid) {
            child.ref.update({
              unread: ""
            })
          }
        })
      })

      // this.setUsers()

      const participants = [this.$store.state.user, user]
      this.$store.commit("setParticipants", participants)

      if (this.$store.state.room_id) {
        firebase.database().ref("messages").child(this.$store.state.room_id).off()
      }

      let messages = []
      firebase.database().ref("messages").child(this.$store.state.room_id).on("child_added", (snapshot) => {
        messages.push(snapshot.val())
      })
      this.$store.commit("setMessages", messages)
    },
  },
  mounted() {
    this.uid = firebase.auth().currentUser.uid
    this.checkedUsers.push(this.uid)
    this.setUser()
    this.setChannels()
    this.setUsers()
    this.setConnected()
    this.setConnectionAdded()
    this.setConnectionRemoved()
  },
  beforeDestroy() {
    firebase.database().ref("channel").off()
    firebase.database().ref("users").off()
    firebase.database().ref(".info/connected").off()
    firebase.database().ref("connections").off()
  },
}
</script>

<style scoped>
.modal {
  max-height: calc(100vh - 100px);
}
.checkbox {
  position: relative;
  /* top: -0.375rem; */
  margin: 0 1rem 0 0;
  cursor: pointer;
}
.checkbox:before {
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  content: "";
  position: absolute;
  left: 0;
  z-index: 1;
  width: 1rem;
  height: 1rem;
  border: 2px solid #009688;
}
.checkbox:checked:before {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
  height: 0.5rem;
  border-color: #009688;
  border-top-style: none;
  border-right-style: none;
}
.checkbox:after {
  content: "";
  position: absolute;
  top: -0.125rem;
  left: 0;
  width: 1.1rem;
  height: 1.1rem;
  background: #fff;
  cursor: pointer;
}
</style>