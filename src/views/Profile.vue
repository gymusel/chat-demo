<template>
  <div class="flex">
    <ProfileNav v-on:profile="showProfile" v-on:optionOne="showOptionOne" class="w-64 py-3 border-r border-gray-700" />
    
    <div v-show="isProfileVisible" class="flex-grow flex flex-col justify-between p-6">
      <div class="h-48 mb-6 flex items-center justify-around rounded-2xl bg-gray-700">
        <button @click="showEditProfile" class="hover:text-lightgreen focus:outline-none"><font-awesome-icon :icon="['fas', 'cog']" size="2x" /></button>
        <div class="flex flex-col items-center justify-around">
          <img :src="$store.state.user.photoURL" v-if="$store.state.user.photoURL" class="h-28 w-28 rounded-full" />
          <img src="@/assets/logo.png" v-else class="h-28 w-28 rounded-full" />
          <div class="relative inset-x-10 -inset-y-8 h-8 w-8 rounded-full bg-white flex items-center justify-center">
            <div class="relative h-5 w-5 rounded-full bg-red-600" />
          </div>
          <h1 class="font-bold text-3xl -m-5">{{ $store.state.user.displayName }}</h1>
        </div>
        <button @click="signOut" class="hover:text-lightred focus:outline-none"><font-awesome-icon :icon="['fas', 'power-off']" size="2x" /></button>
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

    <form @submit.prevent="updateProfile" v-show="isEditProfileVisible" class="flex-grow flex flex-col justify-between p-6">
      <div class="h-48 mb-6 flex items-center justify-around rounded-2xl bg-gray-700">
        <button @click="showProfile" class="hover:text-lightred focus:outline-none"><font-awesome-icon :icon="['fas', 'undo-alt']" size="2x" /></button>
        <div class="flex flex-col items-center justify-around">
          <img :src="$store.state.user.photoURL" v-if="$store.state.user.photoURL" class="h-28 w-28 rounded-full" />
          <img src="@/assets/logo.png" v-else class="h-28 w-28 rounded-full" />
          <div class="relative inset-x-10 -inset-y-8 h-8 w-8 rounded-full bg-white flex items-center justify-center">
            <div class="relative h-5 w-5 rounded-full bg-red-600" />
          </div>
          <input type="displayName" v-model="displayName" placeholder="ユーザーネーム" class="font-bold text-3xl -m-5 px-2 rounded bg-gray-600 max-w-xs" />
        </div>
        <button type="submit" class="hover:text-lightgreen focus:outline-none"><font-awesome-icon :icon="['far', 'save']" size="2x" /></button>
      </div>
      <div class="flex justify-between flex-grow">
        <div class="w-48% flex flex-col justify-between">
          <div class="p-3 w-full flex flex-col rounded-2xl bg-darkgreen">
            <div class="mb-3 flex items-center">
              <div class="mr-2 h-12 w-12 flex items-center justify-center rounded-lg bg-lightgreen">
                <font-awesome-icon :icon="['fas', 'people-arrows']" size="2x" />
              </div>
              <h1 class="font-bold text-xl">Language Exchange</h1>
            </div>
            <div class="flex-grow flex flex-col items-center">
              <languages-dropdown :selected="nativeLang1" v-on:change="nativeLangSelected" btn-bg-color="#3ED598" class="text-black max-h-10" />
              <font-awesome-icon :icon="['fas', 'exchange-alt']" size="2x" rotation="90" class="m-2" />
              <languages-dropdown :selected="learningLang1" v-on:change="learningLangSelected" btn-bg-color="#3ED598" class="text-black max-h-10" />
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
              <button @click="showHobbiesModal" class="mx-2 hover:text-lightred focus:outline-none">
                <font-awesome-icon :icon="['fas', 'plus-circle']" size="2x" />
              </button>
              <!-- modal -->
              <div v-show="hobbiesModal" @click="closeHobbiesModal" class="z-20 fixed top-0 left-0 h-full w-full flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5)">
                <div @click.stop class="w-64 h-5/6 p-3 rounded-2xl bg-gray-800 overflow-y-auto">
                  <div class="mb-2 flex items-center">
                    <div class="mr-2 h-12 w-12 flex items-center justify-center rounded-lg bg-lightred">
                      <font-awesome-icon :icon="['fas', 'icons']" size="2x" />
                    </div>
                    <h1 class="font-bold text-xl">Edit Hobbies</h1>
                  </div>
                  <div class="flex items-center flex-wrap">
                    <button v-for="hobby in hobbiesOptions" :key="hobby" @click="toggleHobby(hobby)" v-bind:class="{ active: hobbies.includes(hobby) }" class="m-2 px-2 rounded-2xl bg-darkred hover:bg-lightred focus:outline-none">{{ hobby }}</button>
                  </div>
                </div>
              </div>
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
          <textarea v-model="selfIntroduction" placeholder="Put self introduction here!" class="flex-grow w-full p-2 resize-none bg-darkyellow" />
        </div>
      </div>
    </form>
    
    <div v-show="isOptionOneVisible">
      option one
    </div>

  </div>
</template>

<script>
import ProfileNav from "../components/ProfileNav.vue"
import LanguagesDropdown from 'vue-languages-dropdown'
import firebase from "firebase/app";
import "firebase/auth";

export default {
  components: {
    ProfileNav,
    'languages-dropdown' : LanguagesDropdown
  },
  data() {
    return {
      isProfileVisible: true,
      isEditProfileVisible: false,
      user: {},
      userRef: {},
      displayName: "",
      country: "",
      photoURL: "",
      nativeLang1: "ja",
      learningLang1: "en",
      hobbies: [],
      hobbiesModal: false,
      hobbiesOptions: ["Art", "Badminton", "Baseball", "Basketball", "Beatbox", "Climbing", "Comics", "Cooking", "Cosplay", "Dancing", "Dramas", "Drawing", "Gaming", "Gym", "Gymnastics", "Hiking", "HipHop", "Jazz", "Judo", "Movie", "Music", "Reading", "R&B", "Singing", "Soccer", "Swimming", "Tennis", "Traveling", "Volleyball", "Wine"],
      selfIntroduction: "",
      isOptionOneVisible: false,
    }
  },
  created() {
    const self = this
    this.user = firebase.auth().currentUser
    this.userRef = firebase.database().ref("users").child(this.user.uid)
    this.userRef.get().then(function(snapshot) {
      self.displayName = snapshot.val().displayName
      self.nativeLang1 = snapshot.val().nativeLang1
      self.learningLang1 = snapshot.val().learningLang1
      self.hobbies = snapshot.val().hobbies
      self.selfIntroduction = snapshot.val().selfIntroduction
    })
  },
  methods: {
    showProfile() {
      this.isProfileVisible = true
      this.isEditProfileVisible = false
      this.isOptionOneVisible = false
    },
    showEditProfile() {
      this.isProfileVisible = false
      this.isEditProfileVisible = true
      this.isOptionOneVisible = false
    },
    nativeLangSelected(data) {
      this.nativeLang1 = data.code
    },
    learningLangSelected(data) {
      this.learningLang1 = data.code
    },
    showHobbiesModal() {
      this.hobbiesModal = true
    },
    closeHobbiesModal() {
      this.hobbiesModal = false
    },
    toggleHobby(hobby) {
      if (this.hobbies.includes(hobby)) {
        this.hobbies = this.hobbies.filter(
          (item) => item !== hobby
        )
      } else {
        this.hobbies.push(hobby)
      }
      console.log(this.hobbies)
    },
    updateProfile() {
      this.user.updateProfile({
        displayName: this.displayName,
      })

      this.userRef.update({
        displayName: this.displayName,
        nativeLang1: this.nativeLang1,
        learningLang1: this.learningLang1,
        hobbies: this.hobbies,
        selfIntroduction: this.selfIntroduction,
      })

      // if (this.photoURL) {
      //   const storageRef = firebase.storage().ref(`profileImages/${this.user.uid}`)
      //   const uploadTask = storageRef.put(this.photoURL)
      //   uploadTask.on('state_changed', 
      //     snapshot => {
      //       const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //       this.fileLoading = percentage
      //     },
      //     err => {
      //       console.log(err)
      //       this['flash/setFlash']({
      //         message: 'ファイルのアップロードに失敗しました。',
      //         type: 'error',
      //       })
      //     },
      //     () => {
      //       uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
      //         this.user.updateProfile({
      //           photoURL: downloadURL
      //         })
      //         this.userRef.update({
      //           photoURL: downloadURL
      //         })
      //         this.$store.commit("updatePhotoURL", downloadURL)
      //       })
      //     }
      //   )
      // }

      this.$store.commit("updateUser", this.displayName, this.nativeLang1, this.learningLang1, this.hobbies, this.selfIntroduction)
    },
    showOptionOne() {
      this.isProfileVisible = false
      this.isEditProfileVisible = false
      this.isOptionOneVisible = true
    },
    signOut() {
      firebase.database().ref("connections").child(this.$store.state.connection_key).remove()
      firebase.auth().signOut()
      this.$store.commit("resetStates")
      this.$router.push("/signin")
    },
  }
}
</script>

<style scoped>
.active {
  background-color: #FF565E;
}
</style>