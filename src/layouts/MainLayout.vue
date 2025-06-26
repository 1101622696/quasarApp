<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleSideMenu" />
        <q-toolbar-title>Sevicol Ltda</q-toolbar-title>
        <q-btn flat round dense icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="sideMenuOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Sevicol Ltda</q-item-label>
        <EssentialLink v-for="link in filteredLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// import { computed } from 'vue'
// import { linksList } from '../router/link-list.js'
// import EssentialLink from 'components/EssentialLink.vue'
// import useUI from '../composables/useUI'
// import { storeToRefs } from 'pinia'
// import { useStoreUsuarios } from '../stores/usuarios'

// import { useRouter } from 'vue-router'
// const useUsuario = useStoreUsuarios()

// const uiStore = useUI()
// const { sideMenuOpen } = storeToRefs(uiStore)
// const { toggleSideMenu } = uiStore

// const router = useRouter()

// const filteredLinks = computed(() => {
//   return linksList.filter((link) => {
//     if (!link.perfiles || link.perfiles.length === 0) return true

//     return link.perfiles.includes(useUsuario.perfile)
//   })
// })

// const logout = () => {
//   useUsuario.eliminarToken()
//   localStorage.removeItem('email')
//   router.push('/')
// }

// defineOptions({
//   name: 'MainLayout',
// })


import { computed, onMounted } from 'vue'
import { linksList } from '../router/link-list.js'
import EssentialLink from 'components/EssentialLink.vue'
import useUI from '../composables/useUI'
import { storeToRefs } from 'pinia'
import { useStoreUsuarios } from '../stores/usuarios'
import useNotifications from 'src/composables/useNotifications' 

import { useRouter } from 'vue-router'
const useUsuario = useStoreUsuarios()

const uiStore = useUI()
const { sideMenuOpen } = storeToRefs(uiStore)
const { toggleSideMenu } = uiStore

const router = useRouter()

const { inicializarNotificaciones, notificationsEnabled } = useNotifications()

const filteredLinks = computed(() => {
  return linksList.filter((link) => {
    if (!link.perfiles || link.perfiles.length === 0) return true
    return link.perfiles.includes(useUsuario.perfile)
  })
})

onMounted(async () => {
  // Solo si el usuario está autenticado
  if (useUsuario.isAuthenticated) {
    try {
      // Verificar si ya están activadas las notificaciones
      const tokenGuardado = localStorage.getItem('fcm-token');
      if (!tokenGuardado || !notificationsEnabled.value) {
        // Intentar inicializar notificaciones
        await inicializarNotificaciones();
      }
    } catch (error) {
      console.log('Error al verificar notificaciones:', error);
    }
  }
})

const logout = () => {
  useUsuario.eliminarToken()
  localStorage.removeItem('email')
  localStorage.removeItem('fcm-token') 
  router.push('/')
}

defineOptions({
  name: 'MainLayout',
})
</script>
