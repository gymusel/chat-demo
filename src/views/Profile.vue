<template>
  <div class="flex">
    <ProfileNav
      v-on:profile="showProfile"
      v-on:optionOne="showOptionOne"
      :class="{ 'hidden sm:inline': !isNavVisible }"
      class="w-full sm:w-64 py-3 border-r border-gray-700"
    />

    <div
      v-show="isProfileVisible"
      :class="{ 'hidden sm:inline': isNavInvisible }"
      class="
        mb-24
        sm:mb-0
        xl:flex
        xl:justify-between
        flex-grow
        h-screen
        overflow-y-auto
      "
    >
      <button
        @click="toggleNavVisible"
        class="sm:hidden focus:outline-none mt-5 mx-5 flex items-center"
      >
        <font-awesome-icon :icon="['fas', 'angle-left']" size="2x" />
        <h1 class="ml-5 font-bold">Back to previous page</h1>
      </button>
      <div
        class="
          pt-5
          px-5
          xl:p-5
          xl:flex xl:flex-col
          xl:justify-between
          xl:h-screen
          xl:w-1/2
          w-full
        "
      >
        <div
          class="p-3 w-full flex flex-col items-center rounded-2xl bg-gray-700"
        >
          <div class="w-full flex justify-around">
            <button
              @click="showEditProfile"
              class="hover:text-lightgreen focus:outline-none"
            >
              <font-awesome-icon :icon="['fas', 'cog']" size="2x" />
            </button>
            <img
              :src="$store.state.user.photoURL"
              v-if="$store.state.user.photoURL"
              class="h-28 w-28 object-cover rounded-full"
            />
            <img
              src="@/assets/logo.png"
              v-else
              class="h-28 w-28 rounded-full"
            />
            <button
              @click="signOut"
              class="hover:text-lightred focus:outline-none"
            >
              <font-awesome-icon :icon="['fas', 'power-off']" size="2x" />
            </button>
          </div>
          <country-flag
            country="jp"
            rounded
            class="relative bottom-5 left-11"
          />
          <h1 class="font-bold text-3xl">
            {{ $store.state.user.displayName }}
          </h1>
        </div>
        <div
          class="
            xl:flex-grow
            p-3
            mt-5
            w-full
            flex flex-col
            rounded-2xl
            bg-darkyellow
          "
        >
          <div class="mb-2 flex items-center">
            <div
              class="
                mr-2
                h-12
                w-12
                flex
                items-center
                justify-center
                rounded-lg
                bg-lightyellow
              "
            >
              <font-awesome-icon :icon="['fas', 'bullhorn']" size="2x" />
            </div>
            <h1 class="font-bold text-xl">Self Introduction</h1>
          </div>
          <p class="flex-grow w-full p2">{{ selfIntroduction }}</p>
        </div>
      </div>
      <div
        class="
          mb-24
          sm:mb-0
          xl:flex xl:flex-col
          xl:justify-between
          xl:h-screen
          xl:w-1/2
          w-full
          p-5
        "
      >
        <div class="p-3 w-full flex flex-col rounded-2xl bg-darkgreen">
          <div class="mb-2 flex items-center">
            <div
              class="
                mr-2
                h-12
                w-12
                flex
                items-center
                justify-center
                rounded-lg
                bg-lightgreen
              "
            >
              <font-awesome-icon :icon="['fas', 'people-arrows']" size="2x" />
            </div>
            <h1 class="font-bold text-xl">Language Exchange</h1>
          </div>
          <div class="flex-grow flex items-center justify-center">
            <p>{{ nativeLang1.toUpperCase() }}</p>
            <font-awesome-icon
              :icon="['fas', 'exchange-alt']"
              size="2x"
              class="m-4"
            />
            <p>{{ learningLang1.toUpperCase() }}</p>
          </div>
        </div>
        <div
          class="
            xl:flex-grow
            p-3
            mt-5
            w-full
            flex flex-col
            rounded-2xl
            bg-darkred
          "
        >
          <div class="mb-2 flex items-center">
            <div
              class="
                mr-2
                h-12
                w-12
                flex
                items-center
                justify-center
                rounded-lg
                bg-lightred
              "
            >
              <font-awesome-icon :icon="['fas', 'icons']" size="2x" />
            </div>
            <h1 class="font-bold text-xl">Hobbies</h1>
          </div>
          <div class="flex items-center flex-wrap">
            <p
              v-for="hobby in hobbies"
              :key="hobby"
              class="m-2 px-2 rounded-2xl bg-lightred"
            >
              {{ hobby }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <form
      @submit.prevent="updateProfile"
      v-show="isEditProfileVisible"
      :class="{ 'hidden sm:inline': isNavInvisible }"
      class="
        mb-24
        sm:mb-0
        xl:flex
        xl:justify-between
        flex-grow
        h-screen
        overflow-y-auto
      "
    >
      <button
        @click="toggleNavVisible"
        class="sm:hidden focus:outline-none mt-5 mx-5 flex items-center"
      >
        <font-awesome-icon :icon="['fas', 'angle-left']" size="2x" />
        <h1 class="ml-5 font-bold">Back to previous page</h1>
      </button>
      <div
        class="
          pt-5
          px-5
          xl:p-5
          xl:flex xl:flex-col
          xl:justify-between
          xl:h-screen
          xl:w-1/2
          w-full
        "
      >
        <div
          class="p-3 w-full flex flex-col items-center rounded-2xl bg-gray-700"
        >
          <div class="w-full flex justify-around">
            <!-- <button @click="showProfile" class="hover:text-lightred focus:outline-none"><font-awesome-icon :icon="['fas', 'undo-alt']" size="2x" /></button> -->
            <label class="flex flex-col items-center hover:text-lightyellow">
              <input
                type="file"
                @change="uploadPhotoURL"
                class="absolute opacity-0 w-9"
              />
              <font-awesome-icon
                :icon="['fas', 'user-circle']"
                v-if="!file"
                size="2x"
                class="mr-2"
              />
              <font-awesome-icon
                :icon="['fas', 'user-circle']"
                v-else
                size="2x"
                class="mr-2 text-green-500"
              />
              <p v-if="file.name" v-text="file.name" class="text-green-500" />
              <p v-else>Upload user icon</p>
            </label>
            <button
              type="submit"
              class="hover:text-lightgreen focus:outline-none"
            >
              <font-awesome-icon :icon="['far', 'save']" size="2x" />
              <p>Save</p>
            </button>
          </div>
          <input
            type="displayName"
            v-model="displayName"
            placeholder="ユーザーネーム"
            class="w-full font-bold text-3xl mt-4 px-2 rounded bg-gray-600"
          />
        </div>
        <div
          class="
            xl:flex-grow
            p-3
            mt-5
            w-full
            flex flex-col
            rounded-2xl
            bg-darkyellow
          "
        >
          <div class="mb-2 flex items-center">
            <div
              class="
                mr-2
                h-12
                w-12
                flex
                items-center
                justify-center
                rounded-lg
                bg-lightyellow
              "
            >
              <font-awesome-icon :icon="['fas', 'bullhorn']" size="2x" />
            </div>
            <h1 class="font-bold text-xl">Self Introduction</h1>
          </div>
          <textarea
            v-model="selfIntroduction"
            placeholder="Put self introduction here!"
            class="flex-grow w-full p-2 resize-none bg-darkyellow"
          />
        </div>
      </div>
      <div
        class="
          mb-24
          sm:mb-0
          xl:flex xl:flex-col
          xl:justify-between
          xl:h-screen
          xl:w-1/2
          w-full
          p-5
        "
      >
        <div class="p-3 w-full flex flex-col rounded-2xl bg-darkgreen">
          <div class="mb-3 flex items-center">
            <div
              class="
                mr-2
                h-12
                w-12
                flex
                items-center
                justify-center
                rounded-lg
                bg-lightgreen
              "
            >
              <font-awesome-icon :icon="['fas', 'people-arrows']" size="2x" />
            </div>
            <h1 class="font-bold text-xl">Language Exchange</h1>
          </div>
          <div class="flex-grow flex flex-col items-center">
            <languages-dropdown
              :selected="nativeLang1"
              v-on:change="nativeLangSelected"
              btn-bg-color="#3ED598"
              class="text-black max-h-10"
            />
            <font-awesome-icon
              :icon="['fas', 'exchange-alt']"
              size="2x"
              rotation="90"
              class="m-2"
            />
            <languages-dropdown
              :selected="learningLang1"
              v-on:change="learningLangSelected"
              btn-bg-color="#3ED598"
              class="text-black max-h-10"
            />
          </div>
        </div>
        <div
          class="
            xl:flex-grow
            p-3
            mt-5
            w-full
            flex flex-col
            rounded-2xl
            bg-darkred
          "
        >
          <div class="mb-2 flex items-center">
            <div
              class="
                mr-2
                h-12
                w-12
                flex
                items-center
                justify-center
                rounded-lg
                bg-lightred
              "
            >
              <font-awesome-icon :icon="['fas', 'icons']" size="2x" />
            </div>
            <h1 class="font-bold text-xl">Hobbies</h1>
          </div>
          <div class="flex items-center flex-wrap">
            <p
              v-for="hobby in hobbies"
              :key="hobby"
              class="m-2 px-2 rounded-2xl bg-lightred"
            >
              {{ hobby }}
            </p>
            <div
              @click="showHobbiesModal"
              class="mx-2 hover:text-lightred focus:outline-none"
            >
              <font-awesome-icon :icon="['fas', 'plus-circle']" size="2x" />
            </div>
            <div
              v-show="hobbiesModal"
              @click="closeHobbiesModal"
              class="
                z-20
                fixed
                top-0
                left-0
                h-full
                w-full
                flex
                items-center
                justify-center
              "
              style="background-color: rgba(0, 0, 0, 0.5)"
            >
              <div
                @click.stop
                class="w-64 h-5/6 p-3 rounded-2xl bg-gray-800 overflow-y-auto"
              >
                <div class="mb-2 flex items-center">
                  <div
                    class="
                      mr-2
                      h-12
                      w-12
                      flex
                      items-center
                      justify-center
                      rounded-lg
                      bg-lightred
                    "
                  >
                    <font-awesome-icon :icon="['fas', 'icons']" size="2x" />
                  </div>
                  <h1 class="font-bold text-xl">Edit Hobbies</h1>
                </div>
                <div class="flex items-center flex-wrap">
                  <p
                    v-for="hobby in hobbiesOptions"
                    :key="hobby"
                    @click="toggleHobby(hobby)"
                    v-bind:class="{ active: hobbies.includes(hobby) }"
                    class="
                      m-2
                      px-2
                      rounded-2xl
                      bg-darkred
                      hover:bg-lightred
                      focus:outline-none
                    "
                  >
                    {{ hobby }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div
      v-show="isOptionOneVisible"
      :class="{ 'hidden sm:inline': isNavInvisible }"
    >
      <button
        @click="toggleNavVisible"
        class="sm:hidden focus:outline-none mt-5 mx-5 flex items-center"
      >
        <font-awesome-icon :icon="['fas', 'angle-left']" size="2x" />
        <h1 class="ml-5 font-bold">Back to previous page</h1>
      </button>
    </div>
  </div>
</template>

<script>
import ProfileNav from "../components/ProfileNav.vue"
import CountryFlag from "vue-country-flag"
import LanguagesDropdown from "vue-languages-dropdown"
import firebase from "firebase/app"
import "firebase/auth"

export default {
  components: {
    ProfileNav,
    CountryFlag,
    "languages-dropdown": LanguagesDropdown,
  },
  data() {
    return {
      isNavVisible: true,
      isNavInvisible: false,
      isProfileVisible: true,
      isEditProfileVisible: false,
      user: {},
      userRef: {},
      displayName: "",
      country: "",
      photoURL: "",
      file: "",
      nativeLang1: "ja",
      learningLang1: "en",
      hobbies: [],
      hobbiesModal: false,
      hobbiesOptions: [
        "Art",
        "Badminton",
        "Baseball",
        "Basketball",
        "Beatbox",
        "Climbing",
        "Comics",
        "Cooking",
        "Cosplay",
        "Dancing",
        "Dramas",
        "Drawing",
        "Gaming",
        "Gym",
        "Gymnastics",
        "Hiking",
        "HipHop",
        "Jazz",
        "Judo",
        "Movie",
        "Music",
        "Reading",
        "R&B",
        "Singing",
        "Soccer",
        "Swimming",
        "Tennis",
        "Traveling",
        "Volleyball",
        "Wine",
      ],
      selfIntroduction: "",
      isOptionOneVisible: false,
    }
  },
  created() {
    const self = this
    this.user = firebase.auth().currentUser
    this.userRef = firebase.database().ref("users").child(this.user.uid)
    this.userRef.get().then(function (snapshot) {
      self.displayName = snapshot.val().displayName
      self.nativeLang1 = snapshot.val().nativeLang1
      self.learningLang1 = snapshot.val().learningLang1
      self.hobbies = snapshot.val().hobbies
      self.selfIntroduction = snapshot.val().selfIntroduction
    })
  },
  mounted() {
    if (matchMedia("(max-width: 640px)").matches) {
      this.isNavInvisible = true
    }
    // this.isProfileVisible = false
  },
  methods: {
    toggleNavVisible() {
      if (matchMedia("(max-width: 640px)").matches) {
        this.isNavVisible = this.isNavInvisible = this.isNavVisible
          ? false
          : true
      }
    },
    showProfile() {
      this.toggleNavVisible()
      this.isProfileVisible = true
      this.isEditProfileVisible = false
      this.isOptionOneVisible = false
    },
    showEditProfile() {
      this.isProfileVisible = false
      this.isEditProfileVisible = true
      this.isOptionOneVisible = false
    },
    uploadPhotoURL() {
      this.file = this.photoURL = event.target.files[0]
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
        this.hobbies = this.hobbies.filter((item) => item !== hobby)
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

      if (this.file) {
        const storageRef = firebase
          .storage()
          .ref(`profileImages/${this.user.uid}`)
        const uploadTask = storageRef.put(this.file)
        uploadTask.on(
          "state_changed",
          // snapshot => {
          //   const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          //   this.fileLoading = percentage
          // },
          // err => {
          //   console.log(err)
          //   this['flash/setFlash']({
          //     message: 'ファイルのアップロードに失敗しました。',
          //     type: 'error',
          //   })
          // },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.user.updateProfile({
                photoURL: downloadURL,
              })
              this.userRef.update({
                photoURL: downloadURL,
              })
              this.$store.commit("updatePhotoURL", downloadURL)
            })
          }
        )
      }

      this.$store.commit(
        "updateUser",
        this.displayName,
        this.nativeLang1,
        this.learningLang1,
        this.hobbies,
        this.selfIntroduction
      )
      this.isProfileVisible = true
      this.isEditProfileVisible = false
    },
    showOptionOne() {
      this.toggleNavVisible()
      this.isProfileVisible = false
      this.isEditProfileVisible = false
      this.isOptionOneVisible = true
    },
    signOut() {
      firebase
        .database()
        .ref("connections")
        .child(this.$store.state.connection_key)
        .remove()
      firebase.auth().signOut()
      this.$store.commit("resetStates")
      this.$router.push("/signin")
    },
  },
}
</script>

<style scoped>
.active {
  background-color: #ff565e;
}
</style>
