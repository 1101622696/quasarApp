<template>
  <div>
    <q-list bordered padding>
      <q-item
        v-for="registro in registros"
        :key="registro.id"
        clickable
        @click="verDetalles(registro.id, registro.datosOriginales)"
      >
        <q-item-section>
          <div class="row items-center q-mb-xs">
            <div class="progress-indicator q-mr-md">
              <div class="progress-line" :class="{ 'completed': tieneEtapa(registro, 'solicitud') }"></div>
              <div class="progress-line" :class="{ 'completed': tieneEtapa(registro, 'prevuelo') }"></div>
              <div class="progress-line" :class="{ 'completed': tieneEtapa(registro, 'postvuelo') }"></div>
            </div>
            <q-item-label>{{ registro.empresa }}</q-item-label>
          </div>
          <q-item-label caption>{{ tipoRegistroLabel }} {{ registro.id }}</q-item-label>
          <q-item-label caption v-if="registro.piloto">{{ registro.piloto }}</q-item-label>
          
          <q-item-label caption class="text-bold q-mt-xs" :class="getEstadoProcesoClass(registro)">
            {{ getEstadoProceso(registro) }}
          </q-item-label>
        </q-item-section>
        
        <q-item-section side>
          <q-badge :color="getEstadoColor(registro.estado)">{{ registro.estado }}</q-badge>

        </q-item-section>
      </q-item>
    </q-list>
    

<VistaDetalle
  v-model:mostrar="mostrarDetalles"
  :registro="registroSeleccionado"
  :tipoRegistro="tipoRegistro"
  :perfilUsuario="perfilUsuario"
  @editar="abrirEdicion"
  @aprobar="aprobarRegistro"
  @cancelar="cancelarRegistro"
  @ir-prevuelo="irAPrevuelo"
  @ir-postvuelo="irAPostvuelo"
  @aprobar-directo="aprobarDirecto"
  @denegar-directo="denegarDirecto"
  @cancelar-directo="cancelarDirecto"
/>

    
    <FormularioEdicion
      v-model:mostrar="mostrarFormulario"
      :tipoRegistro="tipoRegistro"
      :accion="accionFormulario"
      :datos="datosFormulario"
      @guardar="guardarFormulario"
    />

  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import VistaDetalle from './VistaDetalle.vue';
import FormularioEdicion from './FormularioEdicion.vue';

const props = defineProps({
  registros: {
    type: Array,
    required: true
  },
  tipoRegistro: {
    type: String,
    required: true,
  },
  perfilUsuario: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['ver-detalles', 'editar', 'aprobar-registro', 'cancelar-registro', 'guardar-formulario', 'cambio-tab', 'aprobar-directo', 'denegar-directo', 'cancelar-directo']);
const mostrarDetalles = ref(false);
const mostrarFormulario = ref(false);
const registroSeleccionado = ref(null);
const datosFormulario = ref({});
const accionFormulario = ref('crear');

const tipoRegistroLabel = computed(() => {
  const labels = {
    'solicitudes': 'Solicitud',
    'prevuelos': 'Prevuelo',
    'postvuelos': 'Postvuelo'
  };
  return labels[props.tipoRegistro] || props.tipoRegistro;
});

function getEstadoColor(estado) {
  const colores = {
    'Aprobada': 'positive',
    'Aprobado': 'positive',
    'Pendiente': 'warning',
    'En proceso': 'info',
  };
  return colores[estado] || 'grey';
}

function tieneEtapa(registro, etapa) {
  if (etapa === 'solicitud') {
    return true; 
  } else if (etapa === 'prevuelo') {
    return registro.datosOriginales && registro.datosOriginales.prevueloAprobado;
  } else if (etapa === 'postvuelo') {
    return registro.datosOriginales && registro.datosOriginales.postvueloAprobado;
  }
  return false;
}

function getEstadoProceso(registro) {
  if (registro.estado === 'Cancelado' || (registro.datosOriginales && registro.datosOriginales.estado === 'Cancelado')) {
    return 'Cancelado';
  }
  
  if (registro.datosOriginales && registro.datosOriginales.estadoProceso) {
    return registro.datosOriginales.estadoProceso;
  }
  
  if (tieneEtapa(registro, 'solicitud') && tieneEtapa(registro, 'prevuelo') && tieneEtapa(registro, 'postvuelo')) {
    return 'Proceso Completado';
  } else if (tieneEtapa(registro, 'solicitud') && tieneEtapa(registro, 'prevuelo')) {
    return 'Falta por aprobar postvuelo';
  } else if (tieneEtapa(registro, 'solicitud') && !tieneEtapa(registro, 'prevuelo')) {
    return 'Falta realizar prevuelo';
  } else if (registro.estado === 'Aprobada' || registro.estado === 'Aprobado') {
    return 'Solicitud aprobada, pendiente de prevuelo';
  } else {
    return 'Pendiente de aprobación';
  }
}

function getEstadoProcesoClass(registro) {
  const estado = getEstadoProceso(registro);
  
  if (estado === 'Cancelado') {
    return 'text-negative';
  } else if (estado === 'Proceso Completado') {
    return 'text-positive';
  } else if (estado === 'Falta por aprobar postvuelo' || estado === 'Solicitud aprobada, pendiente de prevuelo') {
    return 'text-warning';
  } else {
    return 'text-info';
  }
}

function verDetalles(id, datosOriginales) {
  const registro = props.registros.find(r => r.id === id) || {};
  registroSeleccionado.value = {
    ...registro,
    datosOriginales: datosOriginales.datosOriginales || datosOriginales
  };
  mostrarDetalles.value = true;
}

  function aprobarRegistro(registro) {
    registroSeleccionado.value = registro;
    emit('aprobar-registro', registro);
  }

  function cancelarRegistro(registro) {
    registroSeleccionado.value = registro;
    emit('cancelar-registro', registro);
  }

function irAPrevuelo(id) {
  const solicitud = props.registros.find(r => r.id === id);
  
  if (solicitud) {
    datosFormulario.value = { 
      consecutivo: solicitud.id || solicitud.consecutivo, 
      solicitudId: id,
      tipoRegistro: 'prevuelos'  
    };
    
    accionFormulario.value = 'crear';
    mostrarFormulario.value = true;
    emit('ir-prevuelo', id, datosFormulario.value);
  } else {
    console.error('No se encontró la solicitud con ID:', id);
  }
}

function irAPostvuelo(id) {
  const prevuelo = props.registros.find(r => r.id === id);
  
  if (prevuelo) {
    datosFormulario.value = { 
      consecutivo: prevuelo.id || prevuelo.consecutivo, 
      prevueloId: id,
      tipoRegistro: 'postvuelos'  
    };
    
    accionFormulario.value = 'crear';
    mostrarFormulario.value = true;
    emit('ir-postvuelo', id, datosFormulario.value);
  } else {
    console.error('No se encontró el prevuelo con ID:', id);
  }
}

// function abrirEdicion(registro) {
//   const datosOriginales = registro.datosOriginales || registro;
  
//   if (datosOriginales.estado === 'Aprobado' || 
//       datosOriginales.prevueloAprobado === true ||
//       datosOriginales.postvueloAprobado === true) {
//     console.error('No se puede editar un registro ya aprobado');
//     return;
//   }
  
//   registroSeleccionado.value = registro;
//   datosFormulario.value = datosOriginales;
//   accionFormulario.value = 'editar';
//   mostrarFormulario.value = true;
//   emit('editar', registro);
// }


function abrirEdicion(registro) {
  const datosOriginales = registro.datosOriginales || registro;
  
  // Modificar la lógica para permitir editar postvuelos pendientes
  if (props.tipoRegistro === 'postvuelos') {
    // Para postvuelos, solo bloquear si está aprobado el postvuelo
    if (datosOriginales.postvueloAprobado === true) {
      console.error('No se puede editar un postvuelo ya aprobado');
      return;
    }
  } else if (props.tipoRegistro === 'prevuelos') {
    // Para prevuelos, solo bloquear si está aprobado el prevuelo
    if (datosOriginales.prevueloAprobado === true) {
      console.error('No se puede editar un prevuelo ya aprobado');
      return;
    }
  } else {
    // Para solicitudes, solo bloquear si está aprobada la solicitud
    if (datosOriginales.estado === 'Aprobado' || datosOriginales.estado === 'Aprobada') {
      console.error('No se puede editar una solicitud ya aprobada');
      return;
    }
  }
  
  registroSeleccionado.value = registro;
  datosFormulario.value = datosOriginales;
  accionFormulario.value = 'editar';
  mostrarFormulario.value = true;
  emit('editar', registro);
}

function guardarFormulario(data) {
  emit('guardar-formulario', data);
}

function aprobarDirecto(data) {
  emit('aprobar-directo', data);
}

function denegarDirecto(data) {
  emit('denegar-directo', data);
}
function cancelarDirecto(data) {
  emit('cancelar-directo', data);
}
</script>

<style scoped>
.progress-indicator {
  display: flex;
  align-items: center;
}

.progress-line {
  width: 15px;
  height: 3px;
  background-color: #e0e0e0;
  margin-right: 2px;
}

.progress-line.completed {
  background-color: #21BA45;
}
</style>