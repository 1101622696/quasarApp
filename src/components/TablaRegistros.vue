<template>
  <div>
    <q-list bordered padding>
      <q-item
        v-for="registro in registros"
        :key="registro.consecutivo"
        class="q-mb-md"
      >
        <q-item-section>
          <q-card flat bordered class="full-width">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div>
                  <q-item-label class="text-h6">{{ registro.consecutivo }}</q-item-label>
                  <q-item-label caption>{{ registro.cliente }}</q-item-label>
                  <q-item-label caption v-if="registro.piloto">Piloto: {{ registro.piloto }}</q-item-label>
                  <q-item-label caption v-if="registro.fecha">Fecha: {{ registro.fecha }}</q-item-label>
                </div>
                <div>
                  <q-badge :color="getEstadoGeneralColor(registro.estadoGeneral)">
                    {{ registro.estadoGeneral }}
                  </q-badge>
                </div>
              </div>

              <div class="row q-gutter-sm">
                <q-btn
                  :color="getEstadoColor(registro.estadoSolicitud)"
                  :text-color="getTextColor(registro.estadoSolicitud)"
                  :outline="isOutlined(registro.estadoSolicitud)"
                  @click="verDetalles(registro.consecutivo, 'solicitudes')"
                  class="col"
                >
                  <div class="column items-center">
                    <q-icon name="description" size="sm" />
                    <div class="text-caption">Solicitud</div>
                    <div class="text-caption text-bold">{{ registro.estadoSolicitud }}</div>
                  </div>
                </q-btn>

                <q-btn
                  :color="getEstadoColor(registro.estadoPrevuelo)"
                  :text-color="getTextColor(registro.estadoPrevuelo)"
                  :outline="isOutlined(registro.estadoPrevuelo)"
                  @click="verDetalles(registro.consecutivo, 'prevuelos')"
                  class="col"
                >
                  <div class="column items-center">
                    <q-icon name="flight_takeoff" size="sm" />
                    <div class="text-caption">Prevuelo</div>
                    <div class="text-caption text-bold">{{ registro.estadoPrevuelo }}</div>
                  </div>
                </q-btn>

                <q-btn
                  :color="getEstadoColor(registro.estadoPostVuelo)"
                  :text-color="getTextColor(registro.estadoPostVuelo)"
                  :outline="isOutlined(registro.estadoPostVuelo)"
                  @click="verDetalles(registro.consecutivo, 'postvuelos')"
                  class="col"
                >
                  <div class="column items-center">
                    <q-icon name="flight_land" size="sm" />
                    <div class="text-caption">Postvuelo</div>
                    <div class="text-caption text-bold">{{ registro.estadoPostVuelo }}</div>
                  </div>
                </q-btn>
              </div>

              <div class="row justify-end q-mt-sm">
                <AccionesRegistro 
                  :registro="registro" 
                  :tipoRegistro="tipoProcesoActivo"
                  :perfilUsuario="perfilUsuario"
                  @editar="abrirEdicion"
                  @aprobar="aprobarRegistro"
                  @cancelar="cancelarRegistro"
                  @ir-prevuelo="irAPrevuelo"
                  @ir-postvuelo="irAPostvuelo"
                  @aprobar-directo="aprobarDirecto"
                  @denegar-directo="denegarDirecto"
                  @cancelar-directo="cancelarDirecto"
                  @enespera-directo="enesperaDirecto"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-item-section>
      </q-item>
    </q-list>

    <VistaDetalle
      v-model:mostrar="mostrarDetalles"
      :registro="registroSeleccionado"
      :tipoRegistro="tipoProcesoSeleccionado"
      :perfilUsuario="perfilUsuario"
      @editar="abrirEdicion"
      @aprobar="aprobarRegistro"
      @cancelar="cancelarRegistro"
      @ir-prevuelo="irAPrevuelo"
      @ir-postvuelo="irAPostvuelo"
      @aprobar-directo="aprobarDirecto"
      @denegar-directo="denegarDirecto"
      @cancelar-directo="cancelarDirecto"
      @enespera-directo="enesperaDirecto"
    />

    <FormularioEdicion
      v-model:mostrar="mostrarFormulario"
      :tipoRegistro="tipoFormulario"
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

import { useStorePrevuelos } from '../stores/prevuelos'
import { useStorePostvuelos } from '../stores/postvuelos'
import { useStoreSolicitudes } from '../stores/solicitudes'

const usePrevuelo = useStorePrevuelos()
const usePostvuelo = useStorePostvuelos()
const useSolicitud = useStoreSolicitudes()

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

const emit = defineEmits(['ver-detalles', 'editar', 'aprobar-registro', 'cancelar-registro', 'guardar-formulario', 'cambio-tab', 'aprobar-directo', 'denegar-directo', 'cancelar-directo', 'enespera-directo']);

const mostrarDetalles = ref(false)
const mostrarFormulario = ref(false)
const registroSeleccionado = ref(null)
const tipoProcesoSeleccionado = ref('solicitudes')
const tipoProcesoActivo = ref('solicitudes')
const datosFormulario = ref({})
const accionFormulario = ref('crear')

const tipoFormulario = computed(() => {
  if (datosFormulario.value?.tipoRegistro) {
    return datosFormulario.value.tipoRegistro;
  }
  if (registroSeleccionado.value?.tipoRegistro) {
    return registroSeleccionado.value.tipoRegistro;
  }
  return props.tipoRegistro || 'solicitudes';
});

function getEstadoColor(estado) {
  const colores = {
    'Aprobado': 'positive',
    'Pendiente': 'warning', 
    'No iniciado': 'grey-4',
    'Cancelado': 'negative',
    'Completado': 'positive',
    'En proceso': 'info'
  }
  return colores[estado] || 'grey-4'
}

function getTextColor(estado) {
  const textColors = {
    'No iniciado': 'grey-8',
    'Aprobado': 'white',
    'Pendiente': 'white',
    'Cancelado': 'white',
    'Completado': 'white',
    'En proceso': 'white'
  }
  return textColors[estado] || 'grey-8'
}

function isOutlined(estado) {
  return estado === 'No iniciado'
}

function getEstadoGeneralColor(estadoGeneral) {
  if (estadoGeneral.includes('Pendiente')) return 'warning'
  if (estadoGeneral.includes('no iniciado')) return 'grey'
  if (estadoGeneral.includes('Completado')) return 'positive'
  if (estadoGeneral.includes('Cancelado')) return 'negative'
  return 'info'
}

async function verDetalles(consecutivo, tipoProceso) {
  try {
    tipoProcesoSeleccionado.value = tipoProceso;
    
    const registro = props.registros.find(r => r.consecutivo === consecutivo);
    if (registro) {
      const detallesCompletos = await new Promise((resolve) => {
        emit('ver-detalles', consecutivo, tipoProceso);
        
        setTimeout(async () => {
          let resultado;
          switch (tipoProceso) {
            case 'solicitudes':
              resultado = await useSolicitud.obtenerdatodessolicitud(consecutivo);
              break;
            case 'prevuelos':
              resultado = await usePrevuelo.obtenerdatodeprevuelo(consecutivo);
              break;
            case 'postvuelos':
              resultado = await usePostvuelo.obtenerdatodepostvuelo(consecutivo);
              break;
          }
          resolve(resultado);
        }, 100);
      });
      
      console.log('Detalles completos obtenidos:', detallesCompletos);
      
      registroSeleccionado.value = {
        consecutivo: registro.consecutivo,
        datosOriginales: detallesCompletos,
        tipoRegistro: tipoProceso,
        ...registro 
      };
      
      console.log('Registro seleccionado final:', {
  consecutivo: registroSeleccionado.value.consecutivo,
  tipoRegistro: registroSeleccionado.value.tipoRegistro,
  datosOriginales: registroSeleccionado.value.datosOriginales,
  registroCompleto: registroSeleccionado.value
});

      mostrarDetalles.value = true;
    }
  } catch (error) {
    console.error('Error al ver detalles:', error);
  }
}

  function aprobarRegistro(registro) {
    registroSeleccionado.value = registro;
    emit('aprobar-registro', registro);
  }

  function cancelarRegistro(registro) {
    registroSeleccionado.value = registro;
    emit('cancelar-registro', registro);
  }

function irAPrevuelo(consecutivo) {
  const solicitud = props.registros.find(r => r.consecutivo === consecutivo);
  
  if (solicitud) {
    datosFormulario.value = { 
      consecutivo: consecutivo,
      solicitudId: consecutivo,
      tipoRegistro: 'prevuelos'  
    };
    
    accionFormulario.value = 'crear';
    tipoFormulario.value = 'prevuelos'; 
    mostrarFormulario.value = true;
    emit('ir-prevuelo', consecutivo, datosFormulario.value);
  } else {
    console.error('No se encontró la solicitud con consecutivo:', consecutivo);
  }
}

function irAPostvuelo(consecutivo) {
  const prevuelo = props.registros.find(r => r.consecutivo === consecutivo);
  
  if (prevuelo) {
    datosFormulario.value = { 
      consecutivo: consecutivo, 
      prevueloId: consecutivo,
      tipoRegistro: 'postvuelos'  
    };
    
    accionFormulario.value = 'crear';
    tipoFormulario.value = 'postvuelos'; 
    mostrarFormulario.value = true;
    emit('ir-postvuelo', consecutivo, datosFormulario.value);
  } else {
    console.error('No se encontró el prevuelo con consecutivo:', consecutivo);
  }
}

function abrirEdicion(registro) {
  const datosOriginales = registro.datosOriginales || registro;
  
  if (props.tipoRegistro === 'postvuelos') {
    if (datosOriginales.postvueloAprobado === true) {
      console.error('No se puede editar un postvuelo ya aprobado');
      return;
    }
  } else if (props.tipoRegistro === 'prevuelos') {
    if (datosOriginales.prevueloAprobado === true) {
      console.error('No se puede editar un prevuelo ya aprobado');
      return;
    }
  } else {
    if (datosOriginales.estado === 'Aprobado' || datosOriginales.estado === 'Aprobada') {
      console.error('No se puede editar una solicitud ya aprobada');
      return;
    }
  }
  
  registroSeleccionado.value = registro;
  datosFormulario.value = datosOriginales;
  accionFormulario.value = 'editar';
  
  tipoFormulario.value = registro.tipoRegistro || props.tipoRegistro;
  
  console.log('abrirEdicion - tipoFormulario.value:', tipoFormulario.value);
  
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

function enesperaDirecto(data) {
  console.log('enesperaDirecto en TablaRegistros:', data); // Para debug
  emit('enespera-directo', data);
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