<template>
  <div>
    <Loading v-show="loading" class="h-screen bg-gray-900 text-gray-700" />

    <div v-show="!loading" class="h-screen flex">
      <!-- apparently $store.state.user below becomes null after loging out and throw an error -->
      <div
        v-if="$store.state.user.uid"
        class="
          fixed
          sm:static
          bottom-0
          w-screen
          sm:w-14
          sm:h-screen
          py-5
          sm:py-0
          rounded-t-3xl
          sm:rounded-none
          z-10
          flex
          sm:flex-col
          justify-around
          sm:justify-start
          items-center
          bg-gray-900
          text-gray-700
        "
      >
        <router-link
          to="/profile"
          class="
            order-last
            sm:order-none
            w-10
            h-10
            m-3
            hover:opacity-75
            focus:outline-none
          "
        >
          <img
            :src="$store.state.user.photoURL"
            v-if="$store.state.user.photoURL"
            class="rounded-full object-cover h-10 w-10"
          />
          <img src="@/assets/logo.png" v-else class="rounded-full" />
        </router-link>
        <router-link
          to="/friends"
          class="m-3 hover:opacity-75 focus:outline-none"
        >
          <font-awesome-icon :icon="['fas', 'users']" size="2x" />
        </router-link>
        <router-link
          to="/"
          class="relative m-3 hover:opacity-75 focus:outline-none"
        >
          <div
            v-if="$store.state.user.newMessagesCount"
            class="
              absolute
              bottom-5
              left-4
              flex
              items-center
              justify-center
              h-6
              w-6
              font-bold
              text-xs
              bg-lightred
              text-white
              rounded-full
            "
          >
            {{ $store.state.user.newMessagesCount }}
          </div>
          <font-awesome-icon :icon="['fas', 'comment-dots']" size="2x" />
        </router-link>
      </div>

      <router-view class="flex-grow bg-gray-800 text-white" />

      <div
        class="
          hidden
          lg:inline
          w-80
          flex flex-col
          items-center
          bg-gray-800
          text-white
          border-l border-gray-700
        "
      >
        <div class="ad" />
        <div class="ad" />
      </div>
    </div>

    <div
      v-show="!addedToHomeScreen"
      class="fixed bottom-0 z-30 w-screen flex flex-col items-center"
    >
      <div
        class="
          bg-darkgreen
          text-white
          rounded-3xl
          flex flex-col
          items-center
          p-3
          w-5/6
        "
      >
        <button @click="addToHomeScreen" class="w-full flex justify-end">
          <font-awesome-icon :icon="['fas', 'times-circle']" size="2x" />
        </button>
        <img
          src="@/assets/logo.png"
          class="h-16 w-16 rounded-xl bg-white p-1"
        />
        <h1 class="font-bold text-3xl m-4">Install chat-demo</h1>
        <p class="text-center text-lightgreen">
          Install this application on your home screen for quick and easy access
          when you're on the go.
        </p>
        <div class="my-3">
          Just tap<font-awesome-icon
            :icon="['far', 'square']"
            transform="down-3"
            class="ml-2 text-blue-400"
          /><font-awesome-icon
            :icon="['fas', 'long-arrow-alt-up']"
            transform="up-3 left-11"
            class="text-blue-400"
          />then 'Add to Home Screen'
        </div>
      </div>
      <div class="triangle" />
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/messaging"

export default {
  components: {
    Loading,
  },
  data() {
    return {
      loading: true,
      uid: "",
      addedToHomeScreen: true,
    }
  },
  methods: {
    setFcmToken() {
      const messaging = firebase.messaging()
      // Get registration token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      messaging
        .getToken({
          vapidKey:
            "BHMmCujW0_qNIJtVWsiI5pMup6tRD2JdJexvX3mY60kaYBJ53Vr4EYGKZ7HKDGIpmzO7OLqergx8gTD20nSajMM",
        })
        .then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            console.log("Your currentToken is " + currentToken)
            firebase.database().ref("users").child(this.uid).update({
              fcmToken: currentToken,
            })
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            )
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err)
        })
    },
    setUser() {
      firebase
        .database()
        .ref("users")
        .child(this.uid)
        .on("value", (snapshot) => {
          this.$store.commit("setCurrentUser", snapshot.val())
        })
    },
    setChannels() {
      const self = this
      let channels = []
      firebase
        .database()
        .ref("channel")
        .on("child_added", (snapshot) => {
          if (snapshot.val().users.includes(this.uid)) {
            let channel = snapshot.val()
            let users = []
            firebase
              .database()
              .ref("users")
              .once("child_added", function (snap) {
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
      firebase
        .database()
        .ref("channel")
        .on("child_changed", (snapshot) => {
          let channels = this.$store.state.channels.filter(
            (item) => item.id !== snapshot.val().id
          )
          let changedChannel = this.$store.state.channels.filter(
            (item) => item.id === snapshot.val().id
          )
          changedChannel[0].updatedAt = snapshot.val().updatedAt
          changedChannel[0].newestMessage = snapshot.val().newestMessage
          changedChannel[0].newMessagesCounts[this.uid] =
            snapshot.val().newMessagesCounts[this.uid]
          channels.push(changedChannel)
        })
      this.$store.commit("setChannels", channels)
    },
    setUsers() {
      const self = this
      let users = []
      firebase
        .database()
        .ref("users")
        .on("child_added", (snapshot) => {
          let user = snapshot.val()
          user.status = "offline"

          if (self.uid != user.uid) {
            users.push(user)
          }
        })
      console
      this.$store.commit("setUsers", users)
    },
    setConnected() {
      firebase
        .database()
        .ref(".info/connected")
        .on("value", (snapshot) => {
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
      firebase
        .database()
        .ref("connections")
        .on("child_added", (snapshot) => {
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
      firebase
        .database()
        .ref("connections")
        .on("child_removed", (snapshot) => {
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
    addToHomeScreen() {
      this.addedToHomeScreen = true
      firebase.database().ref("users").child(this.uid).update({
        addedToHomeScreen: true,
      })
    },
  },
  created() {
    const self = this
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid
        if (matchMedia("(max-width: 640px)").matches) {
          firebase
            .database()
            .ref("users")
            .child(user.uid)
            .get()
            .then(function (snapshot) {
              self.addedToHomeScreen = snapshot.val().addedToHomeScreen
            })
        }
        if (firebase.messaging.isSupported()) {
          this.setFcmToken()
        }
        this.setUser()
        this.setChannels()
        this.setUsers()
        this.setConnected()
        this.setConnectionAdded()
        this.setConnectionRemoved()
      }
    })
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
    }, 1000)
  },
  beforeDestroy() {
    firebase.database().ref("channel").off()
    firebase.database().ref("users").off()
    firebase.database().ref(".info/connected").off()
    firebase.database().ref("connections").off()
  },
}
</script>

<style lang="scss">
body {
  overflow: hidden;
}
.router-link-exact-active {
  color: #3ed598;
}
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
.triangle {
  border-top: 20px solid #286053;
  border-right: 20px solid transparent;
  border-left: 20px solid transparent;
}
</style>
