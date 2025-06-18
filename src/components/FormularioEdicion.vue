<template>
  <q-dialog v-model="mostrarDialog" persistent>
    <q-card class="form-card">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ getTitulo }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      
      <q-separator />
      
      <q-card-section class="q-pt-md">
        <component 
          :is="componenteFormulario" 
          :datos="datos" 
          :esEdicion="accion === 'editar'"
          @guardar="guardarYCerrar"
          @cancelar="cerrar"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, defineProps, defineEmits, defineAsyncComponent } from 'vue';
import SolicitudForm from './SolicitudForm.vue';
import PrevueloForm from './PrevueloForm.vue';
import PostvueloForm from './PostvueloForm.vue';

const AprobarForm = defineAsyncComponent(() => import('./AprobarForm.vue'));

const props = defineProps({
  mostrar: {
    type: Boolean,
    default: false
  },
  tipoRegistro: {
    type: String,
    required: true,
    validator: (value) => ['solicitudes', 'prevuelos', 'postvuelos'].includes(value)
  },
  accion: {
    type: String,
    default: 'crear',
  },
  datos: {
    type: Object,
    default: () => ({})
  }
});

const tipoActual = computed(() => {
  const tipo = props.datos.tipoRegistro || props.tipoRegistro;
  console.log('Tipo actual calculado:', tipo);
  return tipo;
});

const emit = defineEmits(['update:mostrar', 'guardar']);

const mostrarDialog = computed({
  get: () => props.mostrar,
  set: (value) => emit('update:mostrar', value)
});

const componenteFormulario = computed(() => {
  console.log('Determinando componente formulario:');
  console.log('- accion:', props.accion);
  console.log('- tipoRegistro prop:', props.tipoRegistro);
  console.log('- datos.tipoRegistro:', props.datos.tipoRegistro);
  console.log('- tipoActual calculado:', tipoActual.value);
  
  if (props.accion === 'aprobar') {
    console.log('-> Mostrando AprobarForm');
    return AprobarForm; 
  } else {
    if (tipoActual.value === 'solicitudes') {
      console.log('-> Mostrando SolicitudForm');
      return SolicitudForm;
    }
    if (tipoActual.value === 'prevuelos') {
      console.log('-> Mostrando PrevueloForm');
      return PrevueloForm;
    }
    if (tipoActual.value === 'postvuelos') {
      console.log('-> Mostrando PostvueloForm');
      return PostvueloForm;
    }
  }
  
  console.log('-> No se encontró componente válido');
  return null;
});
const getTitulo = computed(() => {
  const accionTexto = {
    'crear': 'Crear',
    'editar': 'Editar',
    'aprobar': 'Aprobar'
  }[props.accion] || 'Crear';
  
  const tipoTexto = {
    'solicitudes': 'Solicitud',
    'prevuelos': 'Prevuelo',
    'postvuelos': 'Postvuelo'
  }[props.tipoRegistro] || props.tipoRegistro;
  
  return `${accionTexto} ${tipoTexto}`;
});

function guardarYCerrar(data) {
  const tipoActualRegistro = tipoActual.value;
  
  emit('guardar', {
    ...data,
    accion: props.accion,
    tipoRegistro: tipoActualRegistro 
  });
  cerrar();
}

function cerrar() {
  mostrarDialog.value = false;
}
</script>

<style scoped>
.form-card {
  width: 100%;
  max-width: 800px;
}

@media (max-width: 600px) {
  .form-card {
    width: 95%;
  }
}
</style>