<template>
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-md row">

      <q-input
        v-if="!esEdicion"
        v-model="formulario.consecutivo"
        label="Consecutivo de Solicitud aprobada*"
        readonly
      />

              <div class="q-pa-md">
                <div class="q-gutter-md">
                  <q-time v-model="formulario.horaInicio" />
                </div>
              </div>

              <div class="q-pa-md">
                <div class="q-gutter-md">
                  <q-time v-model="formulario.horaFin" />
                </div>
              </div>

              <q-input
                filled
                type="number"
                v-model.trim="formulario.distanciaRecorrida"
                label="Distancia recorrida (metros)"
                :dense="dense"
              />

              <q-input filled v-model="formulario.alturaMaxima" label="Altura máxima (m)" />

              <q-select
                filled
                v-model="formulario.incidentes"
                label="Incidentes en el vuelo"
                :options="incidentesOptions"
                style="width: 300px"
                class="q-mb-md"
              />

              <q-select
                filled
                v-model="formulario.propositoAlcanzado"
                label="Propósito alcanzado?"
                :options="propositoAlcanzadoOptions"
                style="width: 300px"
                class="q-mb-md"
              />

              <q-input filled v-model="formulario.observacionesVuelo" label="Observaciones:" />

<div class="q-pa-md">
  <q-file
    label="Seleccionar archivos"
    filled
    multiple
    v-model="archivosSeleccionados"
    @update:model-value="manejarSeleccionArchivos"
    accept="image/*, application/pdf, .doc, .docx, .xls, .xlsx, .kml, .kmz"
    clearable
    style="max-width: 300px"
  />
  
  <div class="q-mt-md">
    <q-chip
      v-for="(archivo, index) in formulario.adjuntospostvuelo"
      :key="index"
      removable
      @remove="eliminarArchivo(index)"
      class="q-ma-xs"
    >
      {{ archivo.name }}
      <q-tooltip>{{ archivo.type }} - {{ (archivo.size / 1024).toFixed(2) }} KB</q-tooltip>
    </q-chip>
  </div>
</div>

      </div>
    </div>
    
    <q-card-actions align="right">
      <q-btn
        @click="guardar"
        color="red"
        class="text-white"
        :loading="usePostvuelo.loading"
      >
        {{ esEdicion ? 'Actualizar' : 'Agregar' }}
      </q-btn>
        <template v-slot:loading>
        <q-spinner color="primary" size="1em" />
       </template>
      <q-btn label="Cerrar" color="black" outline @click="$emit('cancelar')" />
    </q-card-actions>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStorePostvuelos } from '../stores/postvuelos'

const props = defineProps({
  datos: {
    type: Object,
    default: () => ({})
  },
  esEdicion: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['guardar', 'cancelar']);
const archivosSeleccionados = ref(null);
const usePostvuelo = useStorePostvuelos()
const cargando = ref(false);
const formulario = ref({
consecutivo: '',
"consecutivo-solicitud": '',
horaInicio: '',
horaFin: '',
distanciaRecorrida: '',
alturaMaxima: '',
incidentes: '',
propositoAlcanzado: '',
observacionesVuelo: '',
adjuntospostvuelo: []
});

const incidentesOptions = ['si', 'no']

const propositoAlcanzadoOptions = ['si', 'no']

watch(() => props.datos, (newData) => {
  if (newData && newData.consecutivo) {
    formulario.value.consecutivo = newData.consecutivo;
  }
}, { immediate: true });

onMounted(() => {
  if (props.datos && props.datos.consecutivo) {
    formulario.value.consecutivo = props.datos.consecutivo;
  }
});

onMounted(() => {
  if (props.esEdicion && props.datos) {
    formulario.value = { 
      consecutivo: '',
      "consecutivo-solicitud": '',
      horaInicio: '',
      horaFin: '',
      distanciaRecorrida: '',
      alturaMaxima: '',
      incidentes: '',
      propositoAlcanzado: '',
      observacionesVuelo: '',
      adjuntospostvuelo: [], // Inicializar como array vacío
      ...props.datos 
    };
    
    // Asegurar que adjuntospostvuelo sea siempre un array
    if (!Array.isArray(formulario.value.adjuntospostvuelo)) {
      formulario.value.adjuntospostvuelo = [];
    }
    
    console.log("Datos cargados en formulario postvuelo:", {
      "consecutivo-solicitud": formulario.value["consecutivo-solicitud"],
      "datos originales": props.datos
    });
  } else if (props.datos && props.datos.consecutivo) {
    formulario.value.consecutivo = props.datos.consecutivo;
  }
});

function manejarSeleccionArchivos(files) {
  if (files) {
    // Asegurar que adjuntospostvuelo existe como array
    if (!formulario.value.adjuntospostvuelo) {
      formulario.value.adjuntospostvuelo = [];
    }
    
    if (Array.isArray(files)) {
      files.forEach(file => {
        const existeArchivo = formulario.value.adjuntospostvuelo.some(a => 
          a.name === file.name && a.size === file.size && a.type === file.type
        );
        
        if (!existeArchivo) {
          formulario.value.adjuntospostvuelo.push(file);
        }
      });
    } 
    else if (files instanceof File) {
      const existeArchivo = formulario.value.adjuntospostvuelo.some(a => 
        a.name === files.name && a.size === files.size && a.type === files.type
      );
      
      if (!existeArchivo) {
        formulario.value.adjuntospostvuelo.push(files);
      }
    }
  }
}

function eliminarArchivo(index) {
  formulario.value.adjuntospostvuelo.splice(index, 1);
}

onMounted(() => {
  if (props.esEdicion && props.datos) {
    formulario.value = { ...props.datos };
    
    console.log("Datos cargados en formulario postvuelo:", {
      "consecutivo-solicitud": formulario.value["consecutivo-solicitud"],
      "datos originales": props.datos
    });
  }
});


async function guardar() {
  cargando.value = true;
  try {
    const formData = new FormData();
    
    for (const key in formulario.value) {
      if (key !== 'adjuntospostvuelo') {
        formData.append(key, formulario.value[key]);
        console.log(`Agregando campo ${key}: ${formulario.value[key]}`);
      }
    }
    
    if (formulario.value.adjuntospostvuelo && formulario.value.adjuntospostvuelo.length > 0) {
      formulario.value.adjuntospostvuelo.forEach((file, index) => {
        formData.append('archivos', file);
        console.log(`Adjuntando archivo #${index + 1}: ${file.name}`);
      });
    }
    
    formData.append('tipoRegistro', 'postvuelos');
    
    // CAMBIO: Solo emitir el evento con FormData, sin llamar al store
    if (props.esEdicion) {
      const consecutivoSolicitud = formulario.value["consecutivo-solicitud"];
      console.log("Editando postvuelo con consecutivo-solicitud:", consecutivoSolicitud);
      
      emit('guardar', {
        formData: formData, // Enviamos el FormData
        consecutivo: formulario.value.consecutivo,
        "consecutivo-solicitud": consecutivoSolicitud,
        accion: 'editar',
        tipoRegistro: 'postvuelos'
      });
    } else {
      emit('guardar', {
        formData: formData, // Enviamos el FormData
        consecutivo: formulario.value.consecutivo,
        accion: 'crear',
        tipoRegistro: 'postvuelos'
      });
    }
    
  } catch (error) {
    console.error('Error al preparar datos:', error);
    emit('guardar', {
      exito: false,
      mensaje: `Error al preparar datos del postvuelo`,
      error: error.message
    });
  } finally {
    cargando.value = false;
  }
}

</script>