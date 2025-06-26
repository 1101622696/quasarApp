<template>
  <q-page class="flex column q-pa-md">

  <q-card-section>
      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-md-auto">
          <q-btn-group spread>
            <q-btn 
              v-for="(config, tipo) in filtrosConfig" 
              :key="tipo"
              :label="tipo === 'todos' ? 'Todos' : `Por ${config.titulo.split(' ').pop()}`"
              :icon="config.icono"
              :color="config.color"
              @click="cargarListaPor(tipo)"
              :outline="tipoLista !== tipo"
            />
          </q-btn-group>
        </div>
          
        <div class="col-12 col-md-auto" v-if="tipoLista !== 'todos'">
          <q-btn-toggle
            v-model="ordenActual"
            toggle-color="primary"
            :options="opcionesOrdenamiento"
            @update:model-value="cargarPostvuelos"
          />
        </div>

        <div class="col-12 col-md-auto" v-if="filtroActual.esFiltroTexto">
          <q-select
            v-model="valorFiltroTexto"
            :options="opcionesFiltroTexto"
            option-value="valor"
            option-label="etiqueta"
            dense
            outlined
            emit-value
            map-options
            @update:model-value="actualizarValorFiltro"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon :name="filtroActual.icono" :color="filtroActual.color" /> 
        {{ filtroActual.titulo }}
        <span v-if="filtroActual.esFiltroTexto && valorFiltroTexto">
          - {{ obtenerEtiquetaFiltroTexto(valorFiltroTexto) }}
        </span>
      </div>

      <q-list bordered separator>
        <q-item 
          v-for="postvuelo in postvuelos" 
          :key="postvuelo.consecutivo"
          clickable
          @click="verDetalles(postvuelo.consecutivo)"
        >
          <q-item-section>
            <q-item-label>{{ postvuelo.cliente }} - {{ postvuelo.consecutivo }} - {{ postvuelo.piloto }}</q-item-label>
            <q-item-label caption v-if="postvuelo.valorFiltro !== undefined">
              {{ obtenerEtiquetaValor(postvuelo.valorFiltro) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <VistaDetalle
  v-model:mostrar="mostrarDetalles"
  :registro="registroSeleccionado"
  :tipoRegistro="'postvuelos'"
  :soloLectura="true"
/>
    </q-card-section>

  </q-page>
</template>


<script setup>
import { useStorePostvuelos } from '../stores/postvuelos.js'
import {ref, onMounted, computed, watch} from 'vue'
import { TIPOS_FILTRO, CONFIG_FILTROS } from '../composables/filtrospo';
import VistaDetalle from 'src/components/VistaDetalle.vue'

const usePostvuelo = useStorePostvuelos();
const valorFiltroTexto = ref(null);
const tipoLista = ref(TIPOS_FILTRO.TODOS);
const ordenActual = ref('desc');
const postvuelos = ref([]);
const mostrarDetalles = ref(false)
const registroSeleccionado = ref(null)

const filtrosConfig = computed(() => CONFIG_FILTROS);

const filtroActual = computed(() => CONFIG_FILTROS[tipoLista.value]);

const opcionesOrdenamiento = computed(() => {
  if (tipoLista.value === TIPOS_FILTRO.TODOS) return [];
  
  return [
    { label: filtroActual.value.etiquetaDesc, value: 'desc' },
    { label: filtroActual.value.etiquetaAsc, value: 'asc' }
  ];
});

watch(tipoLista, (newValue) => {
  const filtro = CONFIG_FILTROS[newValue];
  if (filtro.esFiltroTexto && filtro.opcionesFiltro?.length > 0) {
    valorFiltroTexto.value = filtro.opcionesFiltro[0].valor;
  } else {
    valorFiltroTexto.value = null;
  }
});

function cargarListaPor(tipo) {
  tipoLista.value = tipo;
  ordenActual.value = 'desc';
  
 if (tipo === 'estado') {
    valorFiltroTexto.value = 'activo'; 
  } else {
    valorFiltroTexto.value = null;
  }
  
  cargarPostvuelos();
}

function actualizarValorFiltro(nuevoValor) {
  console.log(`Cambiando valor del filtro a: ${nuevoValor}`);
  valorFiltroTexto.value = nuevoValor;
  cargarPostvuelos();
}

function obtenerEtiquetaValor(valor) {
  if (tipoLista.value === TIPOS_FILTRO.FECHA) {
    return new Date(valor).toLocaleDateString();
  } else if (tipoLista.value === TIPOS_FILTRO.TIEMPO) {
    return `${valor} min`;
  } else if (tipoLista.value === TIPOS_FILTRO.DISTANCIA) {
    return `${valor} m`;
  } else if (tipoLista.value === TIPOS_FILTRO.ALTURA) {
    return `${valor} m`;
  }
  return valor;
}

function obtenerEtiquetaFiltroTexto(valor) {
  if (filtroActual.value.esFiltroTexto && filtroActual.value.opcionesFiltro) {
    const opcion = filtroActual.value.opcionesFiltro.find(opt => opt.valor === valor);
    return opcion ? opcion.etiqueta : valor;
  }
  return valor;
}

const opcionesFiltroTexto = computed(() => {
  if (tipoLista.value && filtroActual.value && filtroActual.value.esFiltroTexto) {
    return filtroActual.value.opcionesFiltro || [];
  }
  return [];
});

async function cargarPostvuelos() {
  try {
    let response;
    
    if (tipoLista.value === TIPOS_FILTRO.TODOS) {
      response = await usePostvuelo.listarPostvuelosAprobados();
   } else {
      const tipoOrden = filtroActual.value.campoOrden;
      response = await usePostvuelo.listarPostvuelosOrdenados(tipoOrden, ordenActual.value);
    }
    
    if (Array.isArray(response)) {
      postvuelos.value = response.map(item => {
        const result = {
          consecutivo: item['consecutivo-solicitud'] || '',
          cliente: item['empresa_post'] || '',
          piloto: item['piloto-postvuelo'] || '',
        };
        
        const campoDatos = filtroActual.value?.campoDatos;
        if (campoDatos && item[campoDatos] !== undefined) {
          result.valorFiltro = item[campoDatos];
        }
        
        return result;
      });
    } else {
      console.error('Error en formato de respuesta:', response);
      postvuelos.value = [];
    }
  } catch (error) {
    console.error(`Error al cargar postvuelo por ${tipoLista.value}:`, error);
    postvuelos.value = [];
  }
}

async function verDetalles(consecutivo) {
  try {
    // Obtener los datos completos del postvuelo
    const detallesCompletos = await usePostvuelo.obtenerdatodepostvuelo(consecutivo);
    
    registroSeleccionado.value = {
      consecutivo: consecutivo,
      datosOriginales: detallesCompletos,
      tipoRegistro: 'postvuelos'
    };
    
    mostrarDetalles.value = true;
  } catch (error) {
    console.error('Error al ver detalles:', error);
  }
}

onMounted(() => {
  cargarPostvuelos();
});

defineOptions({
  name: 'BitacoraPage'
})

</script>
