<template>
  <div class="q-mt-sm">
<q-btn-dropdown v-if="mostrarOpciones" flat dense icon="more_vert" color="grey-8">
  <q-list>
    <!-- JEFE PILOTO - Aprobar Solicitudes -->
    <q-item clickable v-close-popup @click="abrirDialogoAprobacion" 
            v-if="esJefePiloto && estadoGeneral === 'Solicitud Pendiente'">
      <q-item-section>
        <q-item-label>Aprobar Solicitud</q-item-label>
      </q-item-section>
    </q-item>

        <!-- JEFE PILOTO - Aprobar Solicitudes -->
    <q-item clickable v-close-popup @click="abrirDialogoAprobacion" 
            v-if="esJefePiloto && estadoGeneral === 'Solicitud en Espera'">
      <q-item-section>
        <q-item-label>Aprobar Solicitud</q-item-label>
      </q-item-section>
    </q-item>

            <!-- JEFE PILOTO - Aprobar Solicitudes -->
    <q-item clickable v-close-popup @click="denegarRegistro" 
            v-if="esJefePiloto && estadoGeneral === 'Solicitud en Espera'">
      <q-item-section>
        <q-item-label>Denegar Solicitud</q-item-label>
      </q-item-section>
    </q-item>

    <!-- JEFE PILOTO - Denegar Solicitudes -->
    <q-item clickable v-close-popup @click="denegarRegistro" 
            v-if="esJefePiloto && estadoGeneral === 'Solicitud Pendiente'">
      <q-item-section>
        <q-item-label>Denegar Solicitud</q-item-label>
      </q-item-section>
    </q-item>

        <!-- JEFE PILOTO - Enespera Solicitudes -->
    <q-item clickable v-close-popup @click="enesperaRegistro" 
            v-if="esJefePiloto && estadoGeneral === 'Solicitud Pendiente'">
      <q-item-section>
        <q-item-label>En Espera Solicitud</q-item-label>
      </q-item-section>
    </q-item>

    <!-- JEFE PILOTO - Aprobar Prevuelos -->
    <q-item clickable v-close-popup @click="abrirDialogoAprobacion" 
            v-if="esJefePiloto && estadoGeneral === 'Prevuelo Pendiente'">
      <q-item-section>
        <q-item-label>Aprobar Prevuelo</q-item-label>
      </q-item-section>
    </q-item>

    <!-- JEFE PILOTO - Denegar Prevuelos -->
    <q-item clickable v-close-popup @click="denegarRegistro" 
            v-if="esJefePiloto && estadoGeneral === 'Prevuelo Pendiente'">
      <q-item-section>
        <q-item-label>Denegar Prevuelo</q-item-label>
      </q-item-section>
    </q-item>

    <!-- JEFE PILOTO - Aprobar Postvuelos -->
    <q-item clickable v-close-popup @click="abrirDialogoAprobacion" 
            v-if="esJefePiloto && estadoGeneral === 'Postvuelo Pendiente'">
      <q-item-section>
        <q-item-label>Aprobar Postvuelo</q-item-label>
      </q-item-section>
    </q-item>

    <!-- JEFE PILOTO - Denegar Postvuelos -->
    <q-item clickable v-close-popup @click="denegarRegistro" 
            v-if="esJefePiloto && estadoGeneral === 'Postvuelo Pendiente'">
      <q-item-section>
        <q-item-label>Denegar Postvuelo</q-item-label>
      </q-item-section>
    </q-item>

    <!-- PILOTO/CREADOR - Ir a Prevuelo -->
    <q-item clickable v-close-popup @click="$emit('ir-prevuelo', registro.consecutivo)" 
            v-if="puedeIrAPrevuelo">
      <q-item-section>
        <q-item-label>Iniciar Prevuelo</q-item-label>
      </q-item-section>
    </q-item>

    <!-- PILOTO/CREADOR - Ir a Postvuelo -->
    <q-item clickable v-close-popup @click="$emit('ir-postvuelo', registro.consecutivo)" 
            v-if="puedeIrAPostvuelo">
      <q-item-section>
        <q-item-label>Iniciar Postvuelo</q-item-label>
      </q-item-section>
    </q-item>

    <!-- EDITAR - Para creador o jefe -->
    <q-item clickable v-close-popup @click="$emit('editar', registro)" 
            v-if="puedeEditar">
      <q-item-section>
        <q-item-label>Editar {{ tipoRegistroActual }}</q-item-label>
      </q-item-section>
    </q-item>

    <!-- CANCELAR - Solo creador -->
    <q-item clickable v-close-popup @click="abrirDialogoCancelacion" 
            v-if="puedeCancelar">
      <q-item-section>
        <q-item-label>Cancelar {{ tipoRegistroActual }}</q-item-label>
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
            :consecutivo="props.registro.consecutivo" 
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
            :consecutivo="props.registro.consecutivo" 
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
import { ref, computed, defineProps, defineEmits, onMounted, watch } from 'vue';
import AprobarForm from './AprobarForm.vue';
import CancelarForm from './CancelarForm.vue';
import { useStoreUsuarios } from '../stores/usuarios'
import { useStoreSolicitudes } from '../stores/solicitudes'

const useUsuario = useStoreUsuarios()
const useSolicitud = useStoreSolicitudes()

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

const emit = defineEmits(['editar', 'aprobar', 'ir-prevuelo', 'ir-postvuelo', 'aprobacion-completada', 'cancelarSolicitud', 'aprobar-directo', 'denegar-directo', 'enespera-directo']);
const mostrarAprobacion = ref(false);
const mostrarCancelacion = ref(false);
const cargandoEstado = ref(false)
const estadoActual = ref('Desconocido')

const esJefePiloto = computed(() => {
  return props.perfilUsuario.toLowerCase() === 'jefepiloto';
});

function abrirDialogoAprobacion() {
  const estado = estadoGeneral.value;
  
  if (estado === 'Solicitud Pendiente') {
    mostrarAprobacion.value = true;
  } else if (estado === 'Prevuelo Pendiente') {
    emit('aprobar-directo', {
      consecutivo: props.registro.consecutivo,  
      tipo: 'prevuelos',
      accion: 'aprobar'
    });
  } else if (estado === 'Postvuelo Pendiente') {
    emit('aprobar-directo', {
      consecutivo: props.registro.consecutivo,  
      tipo: 'postvuelos', 
      accion: 'aprobar'
    });
  }
  console.log('consecutivo en abrir', props.registro.consecutivo); 
}

function denegarRegistro() {
  const estado = estadoGeneral.value;
  let tipo = 'solicitudes';
  
  if (estado === 'Prevuelo Pendiente') {
    tipo = 'prevuelos';
  } else if (estado === 'Postvuelo Pendiente') {
    tipo = 'postvuelos';
  }
  
  emit('denegar-directo', {
    consecutivo: props.registro.consecutivo,  
    tipo: tipo,
    accion: 'denegar'
  });
}

function enesperaRegistro() {
  const estado = estadoGeneral.value;
  let tipo = 'solicitudes';
  
  if (estado === 'Solicitud Pendiente') {
    tipo = 'solicitudes';
  } 
  
  emit('enespera-directo', {
    consecutivo: props.registro.consecutivo,  
    tipo: tipo,
    accion: 'enespera'
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

onMounted(async () => {
  if (props.registro?.consecutivo) {
    await obtenerEstadoDelConsecutivo(props.registro.consecutivo)
  }
})

const obtenerEstadoDelConsecutivo = async (consecutivo) => {
  if (!consecutivo) return
  console.log(consecutivo);
  
  cargandoEstado.value = true
  try {
    const response = await useSolicitud.obtenerEstadoConsecutivo(consecutivo)
    console.log('Respuesta estado desde store AccionesRegistro:', response)
    
    if (response?.ok && response?.solicitud) {
      estadoActual.value = response.solicitud.estadoGeneral
      console.log('Estado actualizado:', estadoActual.value)
    } else {
      console.warn('Respuesta sin datos válidos:', response)
      estadoActual.value = 'Error'
    }
    
    return response
  } catch (error) {
    console.error('Error al obtener estado del consecutivo:', error)
    estadoActual.value = 'Error'
    return null
  } finally {
    cargandoEstado.value = false
  }
}

watch(() => props.registro?.consecutivo, async (nuevoConsecutivo, anteriorConsecutivo) => {
  if (nuevoConsecutivo && nuevoConsecutivo !== anteriorConsecutivo) {
    await obtenerEstadoDelConsecutivo(nuevoConsecutivo)
  }
}, { immediate: false })

const emailUsuario = useUsuario.correo || localStorage.getItem('email')

const jefeActuaComoPiloto = computed(() => {
  const datosOriginales = props.registro.datosOriginales || props.registro;
  const emailUsuario = useUsuario.correo || localStorage.getItem('email');
  
  // Un jefe actúa como piloto si es jefe y está asignado como piloto en la solicitud
  return esJefePiloto.value && (
    emailUsuario === datosOriginales.piloto ||
    datosOriginales.piloto === 'Anderson Pinto' 
  );
});

const estadoGeneral = computed(() => {
  if (estadoActual.value !== 'Desconocido') {
    return estadoActual.value;
  }
  const datosOriginales = props.registro.datosOriginales || props.registro;
  return datosOriginales.estadoGeneral || 'Desconocido';
});

const tipoRegistroActual = computed(() => {
  const labels = {
    'solicitudes': 'Solicitud',
    'prevuelos': 'Prevuelo', 
    'postvuelos': 'Postvuelo'
  };
  return labels[props.tipoRegistro] || 'Registro';
});

const esCreadorRegistro = computed(() => {
  const registro = props.registro;
  const datosOriginales = registro.datosOriginales || registro;
  const emailUsuario = useUsuario.correo || localStorage.getItem('email');
  
  console.log('Verificando creador:', {
    emailUsuario,
    datosOriginales,
    usuario: datosOriginales.usuario || datosOriginales.useremail || datosOriginales['correo de usuario'],
  });
  
  return emailUsuario === datosOriginales.usuario || 
         emailUsuario === datosOriginales.useremail ||
         emailUsuario === datosOriginales.email ||
         emailUsuario === datosOriginales.correodelcoordinador ||
         emailUsuario === datosOriginales['correo de usuario'];
});

const puedeEditar = computed(() => {
  const estadosEditables = [
    'Solicitud Pendiente', 
    'Solicitud en Espera',
    'Prevuelo Pendiente',
    'Postvuelo Pendiente'
  ];
  
  const tienePermisos = esJefePiloto.value || esCreadorRegistro.value;
  
  return tienePermisos && estadosEditables.includes(estadoGeneral.value);
});

const puedeCancelar = computed(() => {
  const estadosCancelables = [
    'Solicitud Pendiente',
    'Solicitud en Espera', 
    'Prevuelo no iniciado',
    'Prevuelo Pendiente',
    'Postvuelo no iniciado',
  ];
  
  return esCreadorRegistro.value && estadosCancelables.includes(estadoGeneral.value);
});

const puedeIrAPrevuelo = computed(() => {
  const esPilotoOCreador = esCreadorRegistro.value || jefeActuaComoPiloto.value;
  return esPilotoOCreador && estadoGeneral.value === 'Prevuelo no iniciado';
});

const puedeIrAPostvuelo = computed(() => {
  const esPilotoOCreador = esCreadorRegistro.value || jefeActuaComoPiloto.value;
  return esPilotoOCreador && estadoGeneral.value === 'Sin Postvuelo';
});

const mostrarOpciones = computed(() => {
  // No mostrar si está cargando el estado
  if (cargandoEstado.value) return false;
  
  // No mostrar si está completado o cancelado
  const estadosFinales = ['Completado', 'Cancelado'];
  if (estadosFinales.includes(estadoGeneral.value)) return false;
  
  // Mostrar si tiene algún permiso
  return esJefePiloto.value ||
         esCreadorRegistro.value ||
         puedeIrAPrevuelo.value ||
         puedeIrAPostvuelo.value ||
         puedeEditar.value ||
         puedeCancelar.value;
});

console.log('AccionesRegistro - Estado desde store:', {
  consecutivo: props.registro?.consecutivo,
  tipoRegistro: props.tipoRegistro,
  estadoGeneral: estadoGeneral.value,
  estadoActual: estadoActual.value,
  cargandoEstado: cargandoEstado.value,
  perfilUsuario: props.perfilUsuario,
  emailUsuario: emailUsuario,
  esCreador: esCreadorRegistro.value,
  esJefePiloto: esJefePiloto.value,
  jefeActuaComoPiloto: jefeActuaComoPiloto.value,
  puedeIrAPrevuelo: puedeIrAPrevuelo.value,
  puedeIrAPostvuelo: puedeIrAPostvuelo.value,
  puedeEditar: puedeEditar.value,
  puedeCancelar: puedeCancelar.value,
  mostrarOpciones: mostrarOpciones.value
});

</script>

<style scoped>
.botones-acciones {
  display: flex;
  gap: 4px;
}
</style>