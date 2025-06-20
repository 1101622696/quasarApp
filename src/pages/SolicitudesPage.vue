<template>
  <q-page padding>
    
    <q-btn color="primary" label="Crear solicitud" @click="mostrarFormulario = true" class="q-mt-md" />
    
    <q-dialog v-model="mostrarFormulario">
      <q-card style="width: 700px">
        <q-card-section>
          <div class="text-h6">{{ esEdicion ? 'Editar' : 'Crear' }} Solicitud</div>
        </q-card-section>
        
        <SolicitudForm 
          :datos="datosSolicitud" 
          :esEdicion="esEdicion"
          @guardar="guardarCompletado"
          @cancelar="mostrarFormulario = false"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import SolicitudForm from '../components/SolicitudForm.vue';

defineProps({
  registro: Object,
  tipoRegistro: String
})

const mostrarFormulario = ref(false);

async function guardarCompletado() {
  mostrarFormulario.value = false;
}

</script>