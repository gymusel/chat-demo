<template>
  <div class="h-screen flex flex-col last:justify-end">
    <button
      @click="$emit('profile')"
      class="
        w-full
        sm:w-64
        bg-gray-700
        mt-8
        h-20
        p-1
        flex
        items-center
        focus:outline-none
      "
    >
      <img
        :src="$store.state.user.photoURL"
        v-if="$store.state.user.photoURL"
        class="h-14 w-14 object-cover rounded-full p-1 mr-1"
      />
      <img
        src="@/assets/logo.png"
        v-else
        class="h-14 w-14 rounded-full p-1 mr-1"
      />
      <div class="flex flex-col items-start">
        <h1>{{ $store.state.user.displayName }}</h1>
        <p class="text-xs font-thin">{{ $store.state.user.email }}</p>
      </div>
      <font-awesome-icon
        :icon="['fas', 'chevron-right']"
        class="ml-auto mr-1 h-6 w-6 text-gray-400"
      />
    </button>

    <!-- <div class="w-full bg-gray-700 mt-6">
      <button
        @click="$emit('optionOne')"
        class="bg-gray-700 p-1 w-full flex items-center focus:outline-none"
      >
        <div class="bg-lightred h-6 w-6 rounded m-2" />
        <h1>Option one</h1>
        <font-awesome-icon
          :icon="['fas', 'chevron-right']"
          class="ml-auto mr-1 h-6 w-6 text-gray-400"
        />
      </button>
      <button
        class="
          bg-gray-700
          p-1
          w-full
          flex
          items-center
          border-t border-gray-600
          focus:outline-none
        "
      >
        <div class="bg-lightyellow h-6 w-6 rounded m-2" />
        <h1>Option two</h1>
        <font-awesome-icon
          :icon="['fas', 'chevron-right']"
          class="ml-auto mr-1 h-6 w-6 text-gray-400"
        />
      </button>
      <button
        class="
          bg-gray-700
          p-1
          w-full
          flex
          items-center
          border-t border-gray-600
          focus:outline-none
        "
      >
        <div class="bg-lightgreen h-6 w-6 rounded m-2" />
        <h1>Option three</h1>
        <font-awesome-icon
          :icon="['fas', 'chevron-right']"
          class="ml-auto mr-1 h-6 w-6 text-gray-400"
        />
      </button>
    </div> -->

    <div class="hidden lg:inline w-full bg-gray-700 mt-6">
      <div class="bg-gray-700 w-full flex flex-col items-center">
        <div class="w-full flex items-center justify-between">
          <div class="m-2 h-6 w-6 flex items-center justify-center rounded bg-lightred">
            <font-awesome-icon :icon="['fas', 'i-cursor']" size="sm" />
          </div>
          <h1>Press enter to send</h1>
          <onoff-toggle
            v-model="enterMessage"
            height="25"
            width="45"
            margin="2"
            onColor="#75C791"
            class="ml-auto mr-1"
          />
        </div>
        <p class="mb-2 font-thin text-sm">Only applicable to Chrome browser</p>
      </div>
      <!-- <div
        class="
          bg-gray-700
          p-1
          flex
          items-center
          border-t border-b border-gray-600
        "
      >
        <div class="bg-lightyellow h-6 w-6 rounded m-2" />
        <h1>Option two</h1>
        <onoff-toggle
          v-model="checkedTwo"
          height="25"
          width="45"
          margin="2"
          onColor="#75C791"
          class="ml-auto mr-1"
        />
      </div>
      <div class="bg-gray-700 p-1 flex items-center">
        <div class="bg-lightgreen h-6 w-6 rounded m-2" />
        <h1>Option three</h1>
        <onoff-toggle
          v-model="checkedThree"
          height="25"
          width="45"
          margin="2"
          onColor="#75C791"
          class="ml-auto mr-1"
        />
      </div> -->
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app"

export default {
  data() {
    return {
      uid: "",
      userRef: {},
      enterMessage: false,
    }
  },
  created() {
    const self = this
    this.uid = firebase.auth().currentUser.uid
    this.userRef = firebase.database().ref("users").child(this.uid)
    this.userRef.get().then(function (snapshot) {
      if (snapshot.val().enterMessage) {
        self.enterMessage = snapshot.val().enterMessage
      } else {
        self.enterMessage = false
      }
    })
  },
  watch: {
    enterMessage() {
      this.userRef.update({
        enterMessage: this.enterMessage,
      })
    },
  }
}
</script>
