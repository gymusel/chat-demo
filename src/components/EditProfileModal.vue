<template>
  <div class="flex flex-col p-6">
    <h2 class="text-3xl font-black leading-loose">フロフィールを編集する</h2>
    <form @submit.prevent="updateProfile">
      <div class="mb-2">
        <input
          type="displayName"
          v-model="displayName"
          placeholder="ユーザーネーム"
          class="text-xl w-4/5 p-3 border rounded"
        />
      </div>
      <div class="mb-2">
        <input
          type="language"
          v-model="language"
          placeholder="話せる言語"
          class="text-xl w-4/5 p-3 border rounded"
        />
      </div>
      <div class="mb-2">
        <input
          type="country"
          v-model="country"
          placeholder="出身国"
          class="text-xl w-4/5 p-3 border rounded"
        />
      </div>
      <div class="mb-2">
        <label for="file" class="left-0">プロフィール画像</label>
        <input type="file" @change="uploadPhotoURL" class="text-xl w-4/5 p-3" />
      </div>
      <!-- <div v-if="errors.length">
        <ul class="my-4">
          <li v-for="(error, index) in errors" :key="index" class="font-semibold text-red-700">{{ error }}</li>
        </ul>
      </div> -->
      <button
        type="submit"
        class="text-xl w-3/5 bg-green-800 text-white py-2 rounded"
      >
        登録
      </button>
    </form>

    <button
      @click="signOut"
      class="text-xl w-3/5 bg-red-800 text-white py-2 rounded mx-auto my-10"
    >
      サインアウト
    </button>
  </div>
</template>

<script>
import firebase from "firebase/app"
import "firebase/auth"

export default {
  data() {
    return {
      user: {},
      userRef: {},
      displayName: "",
      language: "",
      country: "",
      photoURL: "",
      // errors: [],
    }
  },
  mounted() {
    const self = this
    this.user = firebase.auth().currentUser
    this.userRef = firebase.database().ref("users").child(this.user.uid)
    this.userRef.get().then(function (snapshot) {
      self.displayName = snapshot.val().displayName
      self.language = snapshot.val().language
      self.country = snapshot.val().country
    })
  },
  methods: {
    uploadPhotoURL() {
      this.photoURL = event.target.files[0]
    },
    updateProfile() {
      this.user.updateProfile({
        displayName: this.displayName,
      })

      this.userRef.update({
        displayName: this.displayName,
        language: this.language,
        country: this.country,
      })

      if (this.photoURL) {
        const storageRef = firebase
          .storage()
          .ref(`profileImages/${this.user.uid}`)
        const uploadTask = storageRef.put(this.photoURL)
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percentage =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.fileLoading = percentage
          },
          (err) => {
            console.log(err)
            this["flash/setFlash"]({
              message: "ファイルのアップロードに失敗しました。",
              type: "error",
            })
          },
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
        this.language,
        this.country
      )
      this.$emit("closeEditProfileModal")
    },
    signOut() {
      firebase
        .database()
        .ref("connections")
        .child(this.$store.state.connection_key)
        .remove()
      firebase.auth().signOut()
      this.$router.push("/signin")
    },
  },
}
</script>
