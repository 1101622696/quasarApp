<template>
  <div class="botones-acciones">
    <q-page padding>
      
      <q-input
        v-model="notas"
        label="Motivo"
        type="textarea"
        standout
        rows="3"
        style="margin-bottom: 20px"
        hint="Diligencie el motivo por el cual va a cancelar la solicitud"
      />
      
      <div class="row justify-end q-mt-md">
        <q-btn 
          color="negative" 
          class="q-mr-md" 
          icon="las la-undo"
          @click="$emit('cancelar')" 
        />
        <q-btn 
          color="primary" 
          label="Cancelar Solicitud" 
          @click="cancelarSolicitud" 
          :loading="useSolicitud.loading" 
        />

      </div>
    </q-page>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useStoreSolicitudes } from '../stores/solicitudes';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const useSolicitud = useStoreSolicitudes();

const props = defineProps({
  consecutivo: {
    type: String,
    required: true
  },
  registroSolicitud: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['cancelar', 'aprobacion-completada', 'solicitud-cancelada', 'solicitud-denegada']);

const notas = ref('');

async function cancelarSolicitud() {
  if (await validar()) {
    const todo = {
   
      notas: notas.value,
    }

    try {
        let response = await useSolicitud.putCancelarSolicitud(
        props.consecutivo,
      todo.value
    );
    
    if (response.status === 200) {
      emit('solicitud-cancelada', {
        consecutivo: props.consecutivo,
        codigo: response.data.codigo,
      });

    }
  } catch (error) {
    console.error("Error al cancelar la solicitud:", error);
  }
  }
}

async function validar() {
  let verificado = true

  if (notas.value === '') {
    mostrarMensajeError('Obligatorio diligenciar las notas')
    verificado = false
  }

  return verificado
}

function mostrarMensajeError(mensaje) {
    $q.notify({
        type: "negative",
        message: mensaje,
        position: "bottom-right",
    });
}
</script>