
import { useUiStore } from '../stores/ui'
import { storeToRefs } from 'pinia'

export default function useUI() {
  const uiStore = useUiStore()
  const { sideMenuOpen } = storeToRefs(uiStore)

  return {
    sideMenuOpen,
    toggleSideMenu: uiStore.toggleSideMenu
  }
}
