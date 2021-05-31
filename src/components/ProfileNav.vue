<template>
  <div class="h-screen flex flex-col last:justify-end">

    <button @click="$emit('profile')" class="w-64 bg-gray-700 mt-8 h-20 p-1 flex items-center focus:outline-none">
      <img :src="$store.state.user.photoURL" v-if="$store.state.user.photoURL" class="h-14 w-14 rounded-full p-1 mr-1" />
      <img src="@/assets/logo.png" v-else class="h-14 w-14 rounded-full p-1 mr-1" />
      <div class="flex flex-col items-start">
        <h1>{{ $store.state.user.displayName }}</h1>
        <p class="text-xs font-thin">{{ $store.state.user.email }}</p>
      </div>
      <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-auto mr-1 h-6 w-6 text-gray-400" />
    </button>

    <div class="w-64 bg-gray-700 mt-6">
      <button @click="$emit('optionOne')" class="bg-gray-700 p-1 w-full flex items-center focus:outline-none">
        <div class="bg-lightred h-6 w-6 rounded m-2" />
        <h1>Option one</h1>
        <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-auto mr-1 h-6 w-6 text-gray-400" />
      </button>
      <button class="bg-gray-700 p-1 w-full flex items-center border-t border-gray-600 focus:outline-none">
        <div class="bg-lightyellow h-6 w-6 rounded m-2" />
        <h1>Option two</h1>
        <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-auto mr-1 h-6 w-6 text-gray-400" />
      </button>
      <button class="bg-gray-700 p-1 w-full flex items-center border-t border-gray-600 focus:outline-none">
        <div class="bg-lightgreen h-6 w-6 rounded m-2" />
        <h1>Option three</h1>
        <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-auto mr-1 h-6 w-6 text-gray-400" />
      </button>
    </div>

    <div class="w-64 bg-gray-700 mt-6">
      <div class="bg-gray-700 p-1 flex items-center">
        <div class="bg-lightred h-6 w-6 rounded m-2" />
        <h1>Option one</h1>
        <onoff-toggle v-model="checkedOne" height="25" width="45" margin="2" onColor="#75C791" class="ml-auto mr-1" />
      </div>
      <div class="bg-gray-700 p-1 flex items-center border-t border-b border-gray-600">
        <div class="bg-lightyellow h-6 w-6 rounded m-2" />
        <h1>Option two</h1>
        <onoff-toggle v-model="checkedTwo" height="25" width="45" margin="2" onColor="#75C791" class="ml-auto mr-1" />
      </div>
      <div class="bg-gray-700 p-1 flex items-center">
        <div class="bg-lightgreen h-6 w-6 rounded m-2" />
        <h1>Option three</h1>
        <onoff-toggle v-model="checkedThree" height="25" width="45" margin="2" onColor="#75C791" class="ml-auto mr-1" />
      </div>
    </div>

    <!-- <button @click="showEditProfileModal" class="mx-3 text-white mt-auto rounded-3xl flex items-center bg-gray-900 hover:bg-opacity-50 focus:outline-none">
      <img :src="$store.state.user.photoURL" v-if="$store.state.user.photoURL" class="h-12 w-12 rounded-full p-1" />
      <img src="@/assets/logo.png" v-else class="h-12 w-12 rounded-full p-1" />
      <p>{{ $store.state.user.displayName }}</p>
      <font-awesome-icon :icon="['fas', 'ellipsis-h']" class="opacity-25 ml-auto mr-2" />
    </button>
    <div v-show="editProfileModal" @click="closeEditProfileModal" class="z-20 fixed top-0 left-0 h-full w-full flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5)">
      <div v-on:click.stop class="z-20 bg-white text-gray-900 rounded-md flex flex-col items-center text-center"><EditProfileModal @closeEditProfileModal="closeEditProfileModal" /></div>
    </div> -->
  </div>
</template>

<script>
// import EditProfileModal from "./EditProfileModal.vue"
import firebase from "firebase/app"

export default {
  // components: {
  //   EditProfileModal,
  // },
  data() {
    return {
      uid: "",
      // editProfileModal: false,
      checkedOne: false,
      checkedTwo: false,
      checkedThree: false,
    }
  },
  methods: {
    // showEditProfileModal() {
    //   this.editProfileModal = true;
    // },
    // closeEditProfileModal() {
    //   this.editProfileModal = false;
    // },
  },
  mounted() {
    this.uid = firebase.auth().currentUser.uid
  },
}
</script>
