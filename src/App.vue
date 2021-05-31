<template>
  <div class="h-screen flex">
    <div class="w-16 bg-gray-900 text-gray-700">
      <!-- apparently $store.state.user below becomes null after loging out and throw an error -->
      <div v-if="$store.state.user.uid" class="h-screen flex flex-col items-center">
        <router-link to="/profile" class="w-10 h-10 m-2 hover:opacity-75 focus:outline-none">
          <img :src="$store.state.user.photoURL" v-if="$store.state.user.photoURL" class="rounded-full" />
          <img src="@/assets/logo.png" v-else class="rounded-full" />
        </router-link>
        <router-link to="/friends" class="m-2 hover:opacity-75 focus:outline-none"><font-awesome-icon :icon="['fas', 'users']" size="2x" /></router-link>
        <router-link to="/" class="m-2 hover:opacity-75 focus:outline-none"><font-awesome-icon :icon="['fas', 'comment-dots']" size="2x" /></router-link>
        <button class="mt-auto mb-2 hover:opacity-75 focus:outline-none"><font-awesome-icon :icon="['fas', 'bell']" /></button>
      </div>
    </div>

    <router-view class="flex-grow bg-gray-800 text-white" />
    
    <div class="w-80 flex flex-col items-center bg-gray-800 text-white border-l border-gray-700">
      <div class="ad" />
      <div class="ad" />
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
    }
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
      const self = this
      let channels = []
      firebase.database().ref("channel").on("child_added", (snapshot) => {
        if (snapshot.val().users.includes(this.uid)) {
          let channel = snapshot.val()
          let users = []
          firebase.database().ref("users").once('child_added', function(snap) {
            if (snapshot.val().users.includes(snap.val().uid)) {
              users.push(snap.val())
              if (!channel.displayName && snap.val().uid != self.uid) {
                channel.opponent = snap.val()
              }
            }
          })
          channel.users = users
          channels.push(channel)
        }
      })
      firebase.database().ref("channel").on("child_changed", (snapshot) => {
        let channels = this.$store.state.channels.filter(
          (item) => item.id !== snapshot.val().id
        )
        let changedChannel = this.$store.state.channels.filter(
          (item) => item.id === snapshot.val().id
        )
        changedChannel[0].updatedAt = snapshot.val().updatedAt
        changedChannel[0].newestMessage = snapshot.val().newestMessage
        channels.push(changedChannel)
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
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid
        this.setUser()
        this.setChannels()
        this.setUsers()
        this.setConnected()
        this.setConnectionAdded()
        this.setConnectionRemoved()
      }
    })
  },
  beforeDestroy() {
    firebase.database().ref("channel").off()
    firebase.database().ref("users").off()
    firebase.database().ref(".info/connected").off()
    firebase.database().ref("connections").off()
  },
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
  /* background-color: transparent; */
}
.ad {
  width: 300px;
  height: 250px;
  background-color: gray;
  margin: 10px;
}
</style>