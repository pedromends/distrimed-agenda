import { defineStore, acceptHMRUpdate } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
    isLoggedIn: false, // Flag para indicar login
    userId: null, // ID do usuário logado
  }),

  getters: {
    doubleCount: (state) => state.counter * 2,
  },

  actions: {
    increment() {
      this.counter++
    },
    login(userId) {
      this.isLoggedIn = true
      this.userId = userId
    },
    logout() {
      this.isLoggedIn = false
      this.userId = null
      window.location.reload()
    },
    initializeState() {
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const userId = localStorage.getItem('userId')

      if (isLoggedIn && userId) {
        this.isLoggedIn = true
        this.userId = userId
      }
    },
    actions: {
      initializeState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const userId = localStorage.getItem('userId')

        if (isLoggedIn && userId) {
          this.isLoggedIn = true
          this.userId = userId
        }
      },
    },
  },
  persist: true, // Adiciona a persistência
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
}
