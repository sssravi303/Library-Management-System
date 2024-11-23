// import Vue from 'vue'
// import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
// Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    loggedIn: false,
    role: "",
    id:"",
    user_id:"",
    bookid:"",
    word :""
  },

  mutations: {
    setLogin(state) {
      state.loggedIn = true;
    },
    logout(state) {
      state.loggedIn = false;
    },
    setUserId(state,user_id)
    {
      state.user_id=user_id;
    },
    setRole(state, role) {
      state.role = role;
    },

    setId(state,id)
    {
      state.id=id;
    },
    setBookId(state,bookid)
    {
      state.book_id=bookid;
    },
    getId(state)
    {
      return JSON.stringify({id :state.id});
    },

    setword(state,word)
    {
      state.word = word
    }
  },

  // Plugin : [
  //   createPersistedState({
  //     storage : window.localStorage,
  //   })
  // ]
});

export default store;