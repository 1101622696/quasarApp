<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Notificaciones</div>
        <div class="text-subtitle2">
          Permite que la app te envíe notificaciones importantes.
        </div>
      </q-card-section>

      <q-card-section>
        <q-banner v-if="!notificationsEnabled" class="bg-primary text-white">
          <template v-slot:avatar>
            <q-icon name="notifications" />
          </template>
          Para activar las notificaciones, necesitamos tu permiso.
          <template v-slot:action>
            <q-btn flat label="Permitir" @click="solicitarPermiso" />
          </template>
        </q-banner>

        <q-item v-else>
          <q-item-section avatar>
            <q-icon color="positive" name="check_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Notificaciones activadas</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round icon="notifications_off" @click="desactivar" />
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
// import { onMounted } from 'vue';
import { useStoreUsuarios } from '../stores/usuarios';
import useNotifications from 'src/composables/useNotifications';

const $q = useQuasar();
const usuariosStore = useStoreUsuarios();
const { inicializarNotificaciones, notificationsEnabled } = useNotifications();

const solicitarPermiso = async () => {
  if (!usuariosStore.isAuthenticated) {
    $q.notify({ message: 'Inicia sesión para activar notificaciones', color: 'negative' });
    return;
  }

  const ok = await inicializarNotificaciones();
  if (!ok) {
    $q.notify({ message: 'No se pudieron activar las notificaciones', color: 'negative' });
  }
};

const desactivar = () => {
  localStorage.removeItem('fcm-token');
  $q.notify({ message: 'Notificaciones desactivadas', color: 'info' });
};
</script>
