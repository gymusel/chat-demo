import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    channels: [],
    users: [],
    connection_key: "",
    connections: [],
    room: {},
    participants: [],
    room_id: "",
    messages: [],
  },
  mutations: {
    setCurrentUser(state, user) {
      state.user = user
    },
    updatePhotoURL(state, photoURL) {
      state.user.photoURL = photoURL
    },
    updateUser(state, displayName, nativeLang1, learningLang1, hobbies, selfIntroduction) {
      state.user.displayName = displayName
      state.user.nativeLang1 = nativeLang1
      state.user.learningLang1 = learningLang1
      state.user.hobbies = hobbies
      state.user.selfIntroduction = selfIntroduction
    },
    setChannels(state, channels) {
      state.channels = channels
    },
    setUsers(state, users) {
      state.users = users
    },
    setConnectionKey(state, connection_key) {
      state.connection_key = connection_key
    },
    setConnections(state, connections) {
      state.connections.push(connections)
    },
    setRoom(state, room) {
      state.room = room
    },
    setParticipants(state, participants) {
      state.participants = participants
    },
    setRoomId(state, room_id) {
      state.room_id = room_id
    },
    setMessages(state, messages) {
      state.messages = messages
    },
    resetRoom(state) {
      state.room = {}
      state.participants = []
      state.room_id = ""
      state.messages = []
    },
    resetStates(state) {
      state.user = {}
      state.channels = []
      state.users = []
      state.connection_key = ""
      state.connections = []
      state.room = {}
      state.participants = []
      state.room_id = ""
      state.messages = []
    }
  },
  actions: {},
  modules: {},
})
