import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    sideMenuOpen: true
  }),
  actions: {
    toggleSideMenu() {
      this.sideMenuOpen = !this.sideMenuOpen
    }
  }
})
