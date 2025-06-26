<template>
  <q-dialog v-model="mostrarDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Detalles de {{ tipoRegistroLabel }}</div>
      </q-card-section>
      
      <q-card-section class="q-pt-none" v-if="detalles">

<div class="row q-mb-md" v-for="(valor, campo) in camposFiltrados" :key="campo">
  <div class="col-4 text-weight-bold">{{ formatearCampo(campo) }}:</div>
  <div class="col-8" :class="resaltarValor(campo, valor)">
    {{ valor }}</div>
</div>
 
        <div class="q-px-md">
  <AccionesRegistro 
    :registro="registro" 
    :tipoRegistro="tipoRegistro"
    :perfilUsuario="perfilUsuario"
    @editar="$emit('editar', registro)" 
    @aprobar="$emit('aprobar', registro.consecutivo)"
    @cancelar="$emit('cancelar', registro.consecutivo)"
    @ir-prevuelo="$emit('ir-prevuelo', registro.consecutivo)"
    @ir-postvuelo="$emit('ir-postvuelo', registro.consecutivo)"
    @aprobar-directo="$emit('aprobar-directo', $event)"
    @denegar-directo="$emit('denegar-directo', $event)"
    @cancelarSolicitud="$emit('cancelar-directo', $event)"
    @enespera-directo="$emit('enespera-directo', $event)"
  />

        </div>
      </q-card-section>
      
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import AccionesRegistro from './AccionesRegistro.vue';

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
  },
  mostrar: {
    type: Boolean,
    default: false
  },
  soloLectura: { 
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:mostrar', 'editar', 'aprobar', 'cancelar', 'ir-prevuelo', 'ir-postvuelo', 'aprobar-directo', 'denegar-directo', 'cancelar-directo', 'enespera-directo']);

const mostrarDialog = computed({
  get: () => props.mostrar,
  set: (value) => emit('update:mostrar', value)
});

const detalles = computed(() => {
  const datos = props.registro.datosOriginales || props.registro;
  console.log('VistaDetalle - datos a mostrar:', datos);
  return datos;
});

const tipoRegistroLabel = computed(() => {
  const labels = {
    'solicitudes': 'la Solicitud',
    'prevuelos': 'el Prevuelo',
    'postvuelos': 'el Postvuelo'
  };
  return labels[props.tipoRegistro] || props.tipoRegistro;
});

const camposFiltrados = computed(() => {
  const resultado = {};
  if (!detalles.value) return resultado;

  // Campos básicos que siempre se excluyen
  const camposBasicosExcluidos = [
    'datosOriginales', 'id', '_id', '__v', 'tipoRegistro'
  ];

  const todosExcluidos = [...camposBasicosExcluidos];

  Object.entries(detalles.value).forEach(([clave, valor]) => {
    if (!todosExcluidos.includes(clave) && typeof valor !== 'object') {
      resultado[clave] = valor;
    }
  });

  return resultado;
});

function formatearCampo(campo) {
  const etiquetas = etiquetasPorTipo[props.tipoRegistro] || {};
  if (etiquetas[campo]) {
    return etiquetas[campo];
  }

  return campo
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/datosOriginales/g, '')
    .trim();
}

function resaltarValor(campo, valor) {
  if (typeof valor === 'string' && valor.trim().toLowerCase() === 'no') {
    return 'text-negative'; 
  } else 
  return '';
}

const etiquetasPorTipo = {
  solicitudes: {
    nombre_completo: 'Piloto Responsable',
    empresa: 'Empresa Solicitante',
    estado: 'Estado de la Solicitud',
    tipodecontactovisualconlaua: 'tipo de contaco visual con la ua',
    tipodeoperacionaerea: 'Tipo de operación aérea',
    detalles_cronograma: 'Detalles',
    justificacionvueloespecial: 'Justificacion del vuelo especial',
    poligononombre: 'Nombre del poligono',
    tramolinealnombre: 'Nombre del tramo lineal',
    circuferenciaencoordenadayradionombre: 'Nombre y radio de circunferencia',
    nombredelcoordinador: 'Solicita',
    correodelcoordinador: 'Correo del solicitante',
    estadoProceso: 'Fase del Proceso',
    sucursale_puesto: 'Sucursal/Puesto',
    zonadelvuelo: 'Zona del vuelo',
    areadelvuelo: 'Area del vuelo',
    clasificaciondezona: 'Clasificacion de la zona',
    observacioensdelazona: 'Observaciones',
    duracionsolicitud: 'Duracion estimada',
  
  },
  prevuelos: {
    useremail: 'Correo del usuario',
    solicitudesaprobadas: 'Consecutivo',
    "modelo-dron": 'Aeronave',
    autorizacion: 'Cliente',
    item1: 'Espacio Aéreo (Sin restricción o vuelo autorizado)',
    item2: 'Espacio Aéreo (Identificar obstrucciones cerca del patrón de vuelo)',
    item3: 'Meteorología (Visibilidad ≥ 3 millas, Viento ≤ 38km/h, Sin lluvia)',
    item4: 'Estructura/Hélices UAS (Sin defectos estructurales visibles)',
    item5: 'Batería/s UAS (Suficientes para el vuelo, ≥ 80%)',
    item6: 'atería del dispositivo de pantalla (≥ 80%)',
    item7: 'Tarjetas de Memoria (Instaladas, suficiente espacio)',
    item8: 'Observador (Presente, briefing completo)',
    item9: 'Bloqueo del Gimbal de la cámara (Removido)',
    item10: 'Dispositivo de Pantalla (Encendido)',
    item11: 'Control Remoto (Encendido):',
    item12: 'UAS (Encendido):',
    item13: 'Luces de estado del UAS (Flashing VERDE)',
    item14: 'Chequeo de Cámara (Vista normal de cámara FPV)',
    item15: 'Calibración Rumbo/Compass (Compass calibrado para la ubicación actual)',
    item16: 'Límites de vuelo programados (Altitud. <=120 metros, Distancia. <=500/750)',
    item17: 'Flight Mode Set to GPS (Modo del control en “P”,estatus en pantalla VERDE-RTF)',
    item18: 'Ubicación de despegue (Libre de obstáculos >=8 metros de radio)',
    item19: 'Inicio de motores de la UA (Los motores deben iniciar en mínimas RPM’s sin sonidos anormales)',
    item20: 'Home Point (Establecer el Home Point)',
    item21: 'Control de Desplazamiento (Controles de vuelo y del Gimbal con respuesta normal)',
    item22: 'Telemetría de vuelo (Telemetría normal (Bat, Alt, Dist., etc.))',

  },
  postvuelos: {
    proposito_post: 'Popósito',
    empresa_post: 'Cliente',
  }
};

</script>