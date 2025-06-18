<template>
  <div class="q-mt-sm">
    <q-btn-dropdown v-if="mostrarOpciones" flat dense icon="more_vert" color="grey-8">
      <q-list>
        <q-item clickable v-close-popup @click="abrirDialogoAprobacion" 
                v-if="esJefePiloto && estadoProceso === 'Pendiente de aprobación' && !registroCompletado">
          <q-item-section>
            <q-item-label>Aprobar</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="abrirDialogoAprobacion" 
                v-if="esJefePiloto && estadoProceso === 'Prevuelo pendiente de aprobación' && !registroCompletado">
          <q-item-section>
            <q-item-label>Aprobar Prevuelo</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="denegarRegistro" 
                v-if="esJefePiloto && estadoProceso === 'Prevuelo pendiente de aprobación' && !registroCompletado">
          <q-item-section>
            <q-item-label>Denegar Prevuelo</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="abrirDialogoAprobacion" 
                v-if="esJefePiloto && estadoProceso === 'Postvuelo pendiente de aprobación' && !registroCompletado">
          <q-item-section>
            <q-item-label>Aprobar Postvuelo</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="denegarRegistro" 
                v-if="esJefePiloto && estadoProceso === 'Postvuelo pendiente de aprobación' && !registroCompletado">
          <q-item-section>
            <q-item-label>Denegar Postvuelo</q-item-label>
          </q-item-section>
        </q-item>
        
        <!-- <q-item clickable v-close-popup @click="$emit('editar', registro)" 
                v-if="!esJefePiloto && puedeEditar && !registroCompletado">
          <q-item-section>
            <q-item-label>Editar</q-item-label>
          </q-item-section>
        </q-item> -->

          <q-item clickable v-close-popup @click="$emit('editar', registro)" 
                v-if="puedeEditar && !registroCompletado">
          <q-item-section>
            <q-item-label>Editar</q-item-label>
          </q-item-section>
        </q-item>

       <!-- <q-item clickable v-close-popup @click="abrirDialogoCancelacion" 
                v-if="!esJefePiloto && props.tipoRegistro === 'solicitudes' && 
                estadoProceso.value !== 'Postvuelo pendiente de aprobación' && !registroCompletado">
          <q-item-section>
            <q-item-label>Cancelar Mision</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable v-close-popup @click="$emit('ir-prevuelo', registro.id)" 
                v-if="!esJefePiloto && estadoProceso === 'Solicitud aprobada, pendiente de prevuelo' && !registroCompletado">
          <q-item-section>
            <q-item-label>Ir a Prevuelo</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable v-close-popup @click="$emit('ir-postvuelo', registro.id)" 
                v-if="!esJefePiloto && estadoProceso === 'Prevuelo aprobado, pendiente de postvuelo' && !registroCompletado">
          <q-item-section>
            <q-item-label>Ir a Postvuelo</q-item-label>
          </q-item-section>
        </q-item> -->

              <q-item clickable v-close-popup @click="abrirDialogoCancelacion" 
                v-if="esCreadorRegistro && props.tipoRegistro === 'solicitudes' && 
                estadoProceso.value !== 'Postvuelo pendiente de aprobación' && !registroCompletado">
          <q-item-section>
            <q-item-label>Cancelar Mision</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable v-close-popup @click="$emit('ir-prevuelo', registro.id)" 
                v-if="puedeIrAPrevuelo">
          <q-item-section>
            <q-item-label>Ir a Prevuelo</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable v-close-popup @click="$emit('ir-postvuelo', registro.id)" 
                v-if="puedeIrAPostvuelo">
          <q-item-section>
            <q-item-label>Ir a Postvuelo</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-btn-dropdown>
    
    <q-dialog v-model="mostrarAprobacion">
      <q-card style="width: 700px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Aprobar Solicitud</div>
        </q-card-section>
        
        <q-card-section>
          <AprobarForm 
            :consecutivo="registro.id" 
            :registroSolicitud="registro.datosOriginales || registro"
            @cancelar="mostrarAprobacion = false"
            @aprobacion-completada="aprobacionCompletada"
            @solicitud-denegada="solicitudDenegada"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

        <q-dialog v-model="mostrarCancelacion">
      <q-card style="width: 700px; max-width: 50vw;">
        <q-card-section>
          <div class="text-h6">Cancelar la Solicitud</div>
        </q-card-section>
        
        <q-card-section>
          <CancelarForm 
            :consecutivo="registro.id" 
            :registroSolicitud="registro.datosOriginales || registro"
            @cancelar="mostrarCancelacion = false"
            @cancelarSolicitud="cancelacionCompletada"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import AprobarForm from './AprobarForm.vue';
import CancelarForm from './CancelarForm.vue';
import { useStoreUsuarios } from '../stores/usuarios'

const useUsuario = useStoreUsuarios()

const props = defineProps({
  registro: {
    type: Object,
    required: true
  },
  tipoRegistro: {
    type: String,
    required: true
  },
  perfilUsuario: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['editar', 'aprobar', 'ir-prevuelo', 'ir-postvuelo', 'aprobacion-completada', 'cancelarSolicitud', 'aprobar-directo', 'denegar-directo']);
const mostrarAprobacion = ref(false);
const mostrarCancelacion = ref(false);

const esJefePiloto = computed(() => {
  return props.perfilUsuario.toLowerCase() === 'jefepiloto';
});

console.log('AccionesRegistro - props recibidos:', {
  tipoRegistro: props.tipoRegistro,
  registro: props.registro,
  perfilUsuario: props.perfilUsuario
});

// const registroCompletado = computed(() => {
//   const registro = props.registro;
//   const datosOriginales = registro.datosOriginales || registro;
  
//   if (datosOriginales.estado === 'Cancelado' || 
//       estadoProceso.value === 'Proceso Completado') {
//     return true;
//   }
  
//   if (props.tipoRegistro === 'prevuelos' && datosOriginales.prevueloAprobado === true) {
//     return true;
//   }
  
//   if (props.tipoRegistro === 'postvuelos' && datosOriginales.postvueloAprobado === true) {
//     return true;
//   }
  
//   return false;
// });

// const puedeEditar = computed(() => {
//   return ['Pendiente de aprobación', 'Prevuelo pendiente de aprobación', 'Postvuelo pendiente de aprobación'].includes(estadoProceso.value);
// });

// const estadoProceso = computed(() => {
//   const registro = props.registro;
//   const datosOriginales = registro.datosOriginales || {};
  
//   if (datosOriginales.estado === 'Cancelado' || registro.estado === 'Cancelado') {
//     return 'Cancelado';
//   }
  
//   if (datosOriginales.estadoProceso) {
//     return datosOriginales.estadoProceso;
//   }
  
//   const tieneEtapaSolicitud = true; 
//   const tieneEtapaPrevuelo = datosOriginales.prevueloAprobado === true;
//   const tieneEtapaPostvuelo = datosOriginales.postvueloAprobado === true;
  
//   if (tieneEtapaSolicitud && tieneEtapaPrevuelo && tieneEtapaPostvuelo) {
//     return 'Proceso Completado';
//   } else if (tieneEtapaSolicitud && tieneEtapaPrevuelo && registro.tipoRegistro === 'postvuelos') {
//     return 'Prevuelo aprobado, pendiente de postvuelo';
//   } else if (tieneEtapaSolicitud && tieneEtapaPrevuelo) {
//     return 'Postvuelo pendiente de aprobacion';
//   } else if (tieneEtapaSolicitud && !tieneEtapaPrevuelo && (registro.estado === 'Aprobado' || registro.estado === 'Aprobada')) {
//     return 'Solicitud aprobada, pendiente de prevuelo';
//   } else if (tieneEtapaSolicitud && registro.tipoRegistro === 'prevuelos' && !tieneEtapaPrevuelo) {
//     return 'Prevuelo pendiente de aprobacion';
//   } else {
//     return 'Pendiente de aprobación';
//   }
// });

// const mostrarOpciones = computed(() => {
//   if (estadoProceso.value === 'Proceso Completado') return false;
  
//   if (props.registro.estado === 'Aprobado' || props.registro.estado === 'Denegado' ) {
    
//     if (estadoProceso.value === 'Solicitud aprobada, pendiente de prevuelo') return true;
    
//     if (estadoProceso.value === 'Prevuelo aprobado, pendiente de postvuelo') return true;
    
//     return false;
//   }
  
//   return true;
// });

function abrirDialogoAprobacion() {
  const tipoActual = props.registro.tipoRegistro || props.tipoRegistro;
  
  if (tipoActual === 'solicitudes') {

    mostrarAprobacion.value = true;
  } else if (tipoActual === 'prevuelos') {
    emit('aprobar-directo', {
      id: props.registro.id,
      tipo: 'prevuelos',
      accion: 'aprobar'
    });
  } else if (tipoActual === 'postvuelos') {
    emit('aprobar-directo', {
      id: props.registro.id,
      tipo: 'postvuelos',
      accion: 'aprobar'
    });
  }
}

function denegarRegistro() {
  const tipoActual = props.registro.tipoRegistro || props.tipoRegistro;
  
  emit('denegar-directo', {
    id: props.registro.id,
    tipo: tipoActual,
    accion: 'denegar'
  });
}

function aprobacionCompletada(data) {
  mostrarAprobacion.value = false;
  emit('aprobacion-completada', data);
}
function abrirDialogoCancelacion() {
  mostrarCancelacion.value = true;
}

function cancelacionCompletada(data) {
  mostrarCancelacion.value = false;
  emit('cancelar-directo', data);
}

// ------
const emailUsuario = useUsuario.correo || localStorage.getItem('email')

const esCreadorRegistro = computed(() => {
  const registro = props.registro;
  const datosOriginales = registro.datosOriginales || registro;
  
  // Comparar el email del usuario con el email del creador
  return emailUsuario === datosOriginales.usuario || 
         emailUsuario === datosOriginales.useremail;
});

// ¿El jefe piloto puede actuar como piloto en sus propios registros?
const jefeActuaComoPiloto = computed(() => {
  return esJefePiloto.value && esCreadorRegistro.value;
});

// Para debugging
console.log('AccionesRegistro - props recibidos:', {
  tipoRegistro: props.tipoRegistro,
  registro: props.registro,
  perfilUsuario: props.perfilUsuario,
  emailUsuario: emailUsuario,
  esCreador: esCreadorRegistro.value,
  jefeActuaComoPiloto: jefeActuaComoPiloto.value
});

const registroCompletado = computed(() => {
  const registro = props.registro;
  const datosOriginales = registro.datosOriginales || registro;
  
  if (datosOriginales.estado === 'Cancelado' || 
      estadoProceso.value === 'Proceso Completado') {
    return true;
  }
  
  if (props.tipoRegistro === 'prevuelos' && datosOriginales.prevueloAprobado === true) {
    return true;
  }
  
  if (props.tipoRegistro === 'postvuelos' && datosOriginales.postvueloAprobado === true) {
    return true;
  }
  
  return false;
});

const puedeEditar = computed(() => {
  // Si es el jefe piloto o el creador del registro, puede editar registros pendientes
  return (esJefePiloto.value || esCreadorRegistro.value) && 
    ['Pendiente de aprobación', 'Prevuelo pendiente de aprobación', 'Postvuelo pendiente de aprobación'].includes(estadoProceso.value);
});

// ¿Puede ir a prevuelo?
const puedeIrAPrevuelo = computed(() => {
  // El piloto regular siempre puede ir a su propio prevuelo
  // El jefe piloto solo puede ir a prevuelo si es su propio registro
  return (esCreadorRegistro.value || jefeActuaComoPiloto.value) && 
    estadoProceso.value === 'Solicitud aprobada, pendiente de prevuelo' && 
    !registroCompletado.value;
});

// ¿Puede ir a postvuelo?
const puedeIrAPostvuelo = computed(() => {
  // El piloto regular siempre puede ir a su propio postvuelo
  // El jefe piloto solo puede ir a postvuelo si es su propio registro
  return (esCreadorRegistro.value || jefeActuaComoPiloto.value) && 
    estadoProceso.value === 'Prevuelo aprobado, pendiente de postvuelo' && 
    !registroCompletado.value;
});

const estadoProceso = computed(() => {
  const registro = props.registro;
  const datosOriginales = registro.datosOriginales || {};
  
  if (datosOriginales.estado === 'Cancelado' || registro.estado === 'Cancelado') {
    return 'Cancelado';
  }
  
  if (datosOriginales.estadoProceso) {
    return datosOriginales.estadoProceso;
  }
  
  const tieneEtapaSolicitud = true; 
  const tieneEtapaPrevuelo = datosOriginales.prevueloAprobado === true;
  const tieneEtapaPostvuelo = datosOriginales.postvueloAprobado === true;
  
  if (tieneEtapaSolicitud && tieneEtapaPrevuelo && tieneEtapaPostvuelo) {
    return 'Proceso Completado';
  } else if (tieneEtapaSolicitud && tieneEtapaPrevuelo && registro.tipoRegistro === 'postvuelos') {
    return 'Prevuelo aprobado, pendiente de postvuelo';
  } else if (tieneEtapaSolicitud && tieneEtapaPrevuelo) {
    return 'Postvuelo pendiente de aprobacion';
  } else if (tieneEtapaSolicitud && !tieneEtapaPrevuelo && (registro.estado === 'Aprobado' || registro.estado === 'Aprobada')) {
    return 'Solicitud aprobada, pendiente de prevuelo';
  } else if (tieneEtapaSolicitud && registro.tipoRegistro === 'prevuelos' && !tieneEtapaPrevuelo) {
    return 'Prevuelo pendiente de aprobacion';
  } else {
    return 'Pendiente de aprobación';
  }
});

const mostrarOpciones = computed(() => {
  if (estadoProceso.value === 'Proceso Completado') return false;
  
  if (props.registro.estado === 'Aprobado' || props.registro.estado === 'Denegado' ) {
    
    if (estadoProceso.value === 'Solicitud aprobada, pendiente de prevuelo') return true;
    
    if (estadoProceso.value === 'Prevuelo aprobado, pendiente de postvuelo') return true;
    
    return false;
  }
  
  return true;
});




</script>

<style scoped>
.botones-acciones {
  display: flex;
  gap: 4px;
}
</style>