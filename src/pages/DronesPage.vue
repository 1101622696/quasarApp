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
          
        <div class="col-12 col-md-auto" v-if="tipoLista !== 'todos' && !filtroActual.esFiltroTexto">
          <q-btn-toggle
            v-model="ordenActual"
            toggle-color="primary"
            :options="opcionesOrdenamiento"
            @update:model-value="cargarDrones"
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
          v-for="drone in drones" 
          :key="drone.numeroserie"
          clickable
          @click="verDetalles(drone.numeroserie)"
        >
          <q-item-section>
            <q-item-label>{{ drone.marca }} - {{ drone.numeroserie }}</q-item-label>
            <q-item-label caption v-if="drone.valorFiltro !== undefined">
              {{ obtenerEtiquetaValor(drone.valorFiltro) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <div>
<q-dialog v-model="mostrarDetalles" persistent>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Detalles del dron</div>
    </q-card-section>

    <q-card-section class="q-pt-none" v-if="detallesDron">
      <div class="q-pa-md">
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">numero de serie:</div>
          <div class="col-8">{{ detallesDron.numeroserie }}</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">marca:</div>
          <div class="col-8">{{ detallesDron.marca }}</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">modelo:</div>
          <div class="col-8">{{ detallesDron.modelo }}</div>
        </div>
       <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">peso:</div>
          <div class="col-8">{{ detallesDron.peso }}</div>
        </div>
         <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">dimensiones:</div>
          <div class="col-8">{{ detallesDron.dimensiones }}</div>
        </div>
       <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">autonomia vuelo:</div>
          <div class="col-8">{{ detallesDron.autonomiavuelo }}</div>
        </div>
               <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">altura maxima:</div>
          <div class="col-8">{{ detallesDron.alturamaxima }}</div>
        </div>
               <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">velocidad maxima:</div>
          <div class="col-8">{{ detallesDron.velocidadmaxima }}</div>
        </div>
               <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">fecha de compra:</div>
          <div class="col-8">{{ detallesDron.fechacompra }}</div>
        </div>
               <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">capacidad de bateria:</div>
          <div class="col-8">{{ detallesDron.capacidadbateria }}</div>
        </div>
       <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">tipo de camaras sensores:</div>
          <div class="col-8">{{ detallesDron.tipocamarassensores }}</div>
        </div>
       <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">fecha de creacion:</div>
          <div class="col-8">{{ detallesDron.fechacreacion }}</div>
        </div>
         <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">estado:</div>
          <div class="col-8">{{ detallesDron.estado }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">fecha de poliza:</div>
          <div class="col-8">{{ detallesDron.fechapoliza }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">distancia acumulada:</div>
          <div class="col-8">{{ detallesDron.distanciaacumulada }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">vuelos realizados:</div>
          <div class="col-8">{{ detallesDron.vuelosrealizados }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">contrato dron:</div>
          <div class="col-8">{{ detallesDron.contratodron }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">ubicacion del dron:</div>
          <div class="col-8">{{ detallesDron.ubicaciondron }}</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">ocupado:</div>
          <div class="col-8">{{ detallesDron.ocupadodron }}</div>
        </div>
      </div>
      <div class="row q-mb-md">
            <div class="col-4 text-weight-bold">Activación:</div>
            <div class="col-8">
              <q-toggle
                v-model="isActive"
                :color="detallesDron.estado === 'Activo' ? 'grey' : 'primary'"
                @update:model-value="cambiarEstado"
              />
            </div>
        </div>
      <q-card-actions align="right">
        <q-btn color="primary" icon="edit" label="Editar" @click="editar(detallesDron)" />
        <q-btn color="secondary" icon="download" label="Descargar PDF1" @click="descargarPDF" />
      </q-card-actions>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cerrar" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>

      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #ffffff; margin-bottom: 20px">
            <div class="text-h6 text-black">
              {{ accion == 1 ? 'Agregar Dron' : 'Editar Dron' }}
            </div>
          </q-card-section>

          <div class="q-pa-md">
            <div class="q-gutter-md row">
              <q-input
                class="input"
                filled
                v-model.trim="numeroSerie"
                label="Número de serie"
                :dense="dense"
              />
              <q-input class="input" filled v-model.trim="marca" label="marca" :dense="dense" />
              <q-input
                class="input"
                filled
                v-model.trim="modelo"
                label="Modelo/versión del dron"
                :dense="dense"
              />
              <q-input
                class="input"
                filled
                v-model.trim="peso"
                label="Peso (en gramos)"
                :dense="dense"
              />
              <q-input
                class="input"
                filled
                v-model.trim="dimensiones"
                label="dimensiones"
                :dense="dense"
              />
              <q-input
                class="input"
                filled
                v-model.trim="autonomiavuelo"
                label="autonomia de vuelo"
                :dense="dense"
              />
              <q-input
                class="input"
                filled
                v-model.trim="alturaMaxima"
                label="Altura máxima de vuelo(metros)"
                :dense="dense"
              />
              <q-input
                class="input"
                filled
                v-model.trim="velocidadMaxima"
                label="Velocidad máxima(m/s)"
                :dense="dense"
              />

              <div class="q-pa-md">
                <div class="q-gutter-md row items-start">
                  <q-date v-model="fechaCompra" />
                </div>
              </div>

              <q-input
                class="input"
                filled
                v-model.trim="capacidadBateria"
                label="Capacidad de la batería(mAh)"
                :dense="dense"
              />

              <q-select
                filled
                v-model="ubicaciondron"
                label="Ubicación del dron"
                :options="ubicaciondronOptions"
                style="width: 300px"
                class="q-mb-md"
              />

              <q-select
                filled
                v-model="contratodron"
                label="Seleccione el contrato"
                :options="contratodronOptions"
                style="width: 300px"
                class="q-mb-md"
              />

              <q-select
                filled
                v-model="ocupadodron"
                label="Está ocupado el dron?"
                :options="ocupadodronOptions"
                style="width: 300px"
                class="q-mb-md"
                v-if="accion === 2"
              />

              <q-input filled v-model="tipoCamarasSensores" label="Observaciones:" />

              <div class="q-pa-md">
                <div class="q-gutter-md row items-start">
                  <q-date v-model="fechapoliza" />
                </div>
              </div>

<div class="q-pa-md">
  <q-file
    label="Seleccionar archivos"
    filled
    multiple
    @update:model-value="manejarSeleccionArchivos"
    accept="image/*, application/pdf, .doc, .docx, .xls, .xlsx, .kml, .kmz"
    clearable
    style="max-width: 300px"
  />
  
  <div class="q-mt-md">
    <q-chip
      v-for="(archivo, index) in adjuntos3"
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
              @click="guardar()"
              v-if="accion === 1"
              color="red"
              class="text-white"
              :loading="useDron.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
                    <q-btn
              @click="editarDron()"
              v-else
              color="red"
              class="text-white"
              :loading="useDron.loading"
              >Actualizar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <q-btn color="primary" :label="'Agregar Dron'" class="q-mt-md" @click="abrir" />

  </q-page>
</template>

<script setup>
// import { ref, onMounted } from 'vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStoreDrones } from '../stores/drones.js'
import { TIPOS_FILTRO, CONFIG_FILTROS } from '../composables/filtros';

import { jsPDF } from 'jspdf'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { Capacitor } from '@capacitor/core'

// import { Toast } from '@capacitor/toast'

const useDron = useStoreDrones()
const alert = ref(false)
const accion = ref(1)
const $q = useQuasar()

const numeroSerie = ref('')
const marca = ref('')
const modelo = ref('')
const peso = ref('')
const dimensiones = ref('')
const autonomiavuelo = ref('')
const alturaMaxima = ref('')
const velocidadMaxima = ref('')
const fechaCompra = ref('')
const capacidadBateria = ref('')
const ubicaciondron = ref('')
const ocupadodron = ref('')
const contratodron = ref('')
const tipoCamarasSensores = ref('')
const fechapoliza = ref('')
const adjuntos3 = ref([])

const informacion=ref("")

const detallesDron = ref(null);
const mostrarDetalles = ref(false);

const ubicaciondronOptions = ['Bucaramanga', 'Bogotá']

const contratodronOptions = ['Externo', 'Sevicol']
const ocupadodronOptions = ['si', 'No']

const tipoLista = ref(TIPOS_FILTRO.TODOS);
const ordenActual = ref('desc');
const drones = ref([]);
const valorFiltroTexto = ref(null);

// Funciones para el diálogo
function abrir() {
  accion.value = 1
  alert.value = true
}

function cerrar() {
  alert.value = false
}

function manejarSeleccionArchivos(files) {
  if (files) {
    // Si es array de archivos
    if (Array.isArray(files)) {
      files.forEach(file => {
        // Verificar si el archivo ya existe en la lista (evitar duplicados)
        const existeArchivo = adjuntos3.value.some(a => 
          a.name === file.name && a.size === file.size && a.type === file.type
        );
        
        if (!existeArchivo) {
          adjuntos3.value.push(file);
        }
      });
    } 
    // Si es un solo archivo
    else if (files instanceof File) {
      const existeArchivo = adjuntos3.value.some(a => 
        a.name === files.name && a.size === files.size && a.type === files.type
      );
      
      if (!existeArchivo) {
        adjuntos3.value.push(files);
      }
    }
  }
}

function eliminarArchivo(index) {
  adjuntos3.value.splice(index, 1);
}

async function guardar() {
  if (await validar()) {
  const formData = new FormData();
    
    // Añadir cada campo del formulario
    formData.append("numeroSerie", numeroSerie.value);
    formData.append("marca", marca.value);
    formData.append("modelo", modelo.value);
    formData.append("peso", peso.value);
    formData.append("dimensiones", dimensiones.value);
    formData.append("autonomiavuelo", autonomiavuelo.value);
    formData.append("alturaMaxima", alturaMaxima.value);
    formData.append("velocidadMaxima", velocidadMaxima.value);
    formData.append("fechaCompra", fechaCompra.value);
    formData.append("capacidadBateria", capacidadBateria.value);
    formData.append("tipoCamarasSensores", tipoCamarasSensores.value);
    formData.append("fechapoliza", fechapoliza.value);
    formData.append("contratodron", contratodron.value);
    formData.append("ubicaciondron", ubicaciondron.value);
    formData.append("ocupadodron", "No");
    
    // Verifica si hay archivos antes de intentar agregarlos
    console.log("Archivos seleccionados:", adjuntos3.value);
    
    if (adjuntos3.value.length > 0) {
      adjuntos3.value.forEach(archivo => {
        formData.append("archivos", archivo);
      });
    }
    
    // Muestra el contenido del FormData para depuración
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    try {
      const response = await useDron.postDron(formData);
      console.log("Respuesta exitosa:", response);
      
      mostrarMensajeExito("dron agregado correctamente");
      cerrar();
      alert.value = false;
      adjuntos3.value=[]
      cargarDrones();
    } catch (error) {
      console.error("Error completo:", error);
      mostrarMensajeError("Error al guardar el dron");
    }
  }
}

function editar(dron){
  accion.value = 2
  alert.value = true

informacion.value=dron

numeroSerie.value=dron.numeroserie || '';
marca.value=dron.marca || '';
modelo.value=dron.modelo || '';
peso.value=dron.peso || '';
dimensiones.value=dron.dimensiones || '';
autonomiavuelo.value=dron.autonomiavuelo || '';
alturaMaxima.value=dron.alturamaxima || '';
velocidadMaxima.value=dron.velocidadmaxima || '';
fechaCompra.value=dron.fechaCompra || '';
capacidadBateria.value=dron.capacidadbateria || '';
ubicaciondron.value=dron.ubicaciondron || '';
contratodron.value=dron.contratodron || '';
tipoCamarasSensores.value=dron.tipocamarassensores || '';
fechapoliza.value=dron.fechapoliza || '';
ocupadodron.value=dron.ocupadodron || '';

      mostrarDetalles.value = false;
}


async function editarDron() {
  if (await validar()) {
const formData = new FormData();

    // Añadir cada campo del formulario
    formData.append("numeroSerie", numeroSerie.value);
    formData.append("marca", marca.value);
    formData.append("modelo", modelo.value);
    formData.append("peso", peso.value);
    formData.append("dimensiones", dimensiones.value);
    formData.append("autonomiavuelo", autonomiavuelo.value);
    formData.append("alturaMaxima", alturaMaxima.value);
    formData.append("velocidadMaxima", velocidadMaxima.value);
    formData.append("fechaCompra", fechaCompra.value);
    formData.append("capacidadBateria", capacidadBateria.value);
    formData.append("tipoCamarasSensores", tipoCamarasSensores.value);
    formData.append("fechapoliza", fechapoliza.value);
    formData.append("contratodron", contratodron.value);
    formData.append("ubicaciondron", ubicaciondron.value);
    formData.append("ocupadodron", ocupadodron.value);
    
    // Verifica si hay archivos antes de intentar agregarlos
    console.log("Archivos seleccionados:", adjuntos3.value);
    
    if (adjuntos3.value.length > 0) {
      adjuntos3.value.forEach(archivo => {
        formData.append("archivos", archivo);
      });
    }

        for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
     const response = await useDron.putDron(informacion.value.numeroserie, formData);
      console.log("Respuesta exitosa:", response);
      
      cerrar();
      alert.value = false;
      // listartablaDrones();
      resetearFormulario();
  }catch (error) {
      console.error("Error al actualizar el dron:", error);
    }
}
}

function resetearFormulario() {
  numeroSerie.value = '';
  marca.value = '';
  modelo.value = '';
  peso.value = '';
  dimensiones.value = null;
  accion.value = 1; 
}


async function validar() {
  let verificado = true

  if (numeroSerie.value === '') {
    mostrarMensajeError('diligencie un número de serie')
    verificado = false
  }
  if (marca.value === '') {
    mostrarMensajeError('diligencie la marca del dron')
    verificado = false
  }
  if (modelo.value === '') {
    mostrarMensajeError('diligencie el modelo')
    verificado = false
  }
  if (alturaMaxima.value === '') {
    mostrarMensajeError('diligencie la altura máxima')
    verificado = false
  }
  if (velocidadMaxima.value === '') {
    mostrarMensajeError('diligencie la velocidad máxima')
    verificado = false
  }
  if (peso.value === '') {
    mostrarMensajeError('diligencie el peso del dron')
    verificado = false
  }
  if (fechapoliza.value === '') {
    mostrarMensajeError('Seleccione la fecha póliza del dron')
    verificado = false
  }
  return verificado
}

function mostrarMensajeError(mensaje) {
  $q.notify({
    type: 'negative',
    message: mensaje,
    position: 'bottom-right',
  })
}

function mostrarMensajeExito(mensaje) {
  $q.notify({
    type: 'positive',
    message: mensaje,
    position: 'bottom-right',
  })
}

async function verDetalles(numeroserie) {
  try {
    const detalle = await useDron.obtenerdatosdron(numeroserie);
    console.log("Detalles obtenidos:", detalle);
    
    if (detalle) {
      detallesDron.value = {
          numeroserie: detalle['numeroserie']|| '',
          marca: detalle['marca']|| '',
          modelo: detalle['modelo']|| '',
          peso: detalle['peso']|| '',
          dimensiones: detalle['dimensiones'] || '', 
          autonomiavuelo: detalle['autonomiavuelo'] || '', 
          alturamaxima: detalle['alturamaxima'] || '',
          velocidadmaxima: detalle['velocidadmaxima'] || '',
          fechacompra: detalle['fechacompra'] || '',
          capacidadbateria: detalle['capacidadbateria'] || '',
          tipocamarassensores: detalle['tipocamarassensores'] || '',
          fechacreacion: detalle['fecha creacion registro'] || '',
          estado: detalle['estado-dron'] || '',
          fechapoliza: detalle['fecha de póliza'] || '',
          distanciaacumulada: detalle['distancia acumulada-dron'] || '',
          vuelosrealizados: detalle['vuelos realizados-dron'] || '',
          contratodron: detalle['contratodron'] || '',
          ubicaciondron: detalle['ubicación_dron'] || '',
          ocupadodron: detalle['ocupado_dron'] || '',
        };
      mostrarDetalles.value = true;
    } else {
      console.error('No se pudieron obtener los detalles');
    }
  } catch (error) {
    console.error('Error al obtener detalles:', error);
  }
}

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
  
  // Establece un valor predeterminado apropiado para cada tipo de filtro
  if (tipo === 'ocupacion') {
    valorFiltroTexto.value = 'si'; // Para filtrar por ocupados
  } else if (tipo === 'estado') {
    valorFiltroTexto.value = 'activo'; // Para filtrar por activos
  } else {
    valorFiltroTexto.value = null;
  }
  
  cargarDrones();
}

function actualizarValorFiltro(nuevoValor) {
  // console.log(`Cambiando valor del filtro a: ${nuevoValor}`);
  valorFiltroTexto.value = nuevoValor;
  cargarDrones();
}

function obtenerEtiquetaValor(valor) {
  // Implementa la lógica para formatear el valor según el tipo de filtro
  if (tipoLista.value === TIPOS_FILTRO.FECHA) {
    return new Date(valor).toLocaleDateString();
  } else if (tipoLista.value === TIPOS_FILTRO.TIEMPO) {
    return `${valor} min`;
  } else if (tipoLista.value === TIPOS_FILTRO.DISTANCIA) {
    return `${valor} m`;
  } else if (tipoLista.value === TIPOS_FILTRO.VUELOS) {
    return `${valor} vuelos`;
  } else if (tipoLista.value === TIPOS_FILTRO.PESO) {
    return `${valor} g`;
  } else if (tipoLista.value === TIPOS_FILTRO.VELOCIDAD) {
    return `${valor} km/h`;
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

async function cargarDrones() {
  try {
    let response;
    
    if (tipoLista.value === TIPOS_FILTRO.TODOS) {
      response = await useDron.listarDrones();
    } else if (filtroActual.value.esFiltroTexto) {
      // console.log(`Filtrando por: ${tipoLista.value}, valor: ${valorFiltroTexto.value}`);
      
      let tipoBackend = tipoLista.value;
      
      response = await useDron.listarDronesFiltrados(
        tipoBackend, 
        valorFiltroTexto.value
      );
    } else {
      const tipoOrden = filtroActual.value.campoOrden;
      response = await useDron.listarDronesOrdenados(tipoOrden, ordenActual.value);
    }
    
    if (Array.isArray(response)) {
      drones.value = response.map(item => {
        const result = {
          numeroserie: item['numeroserie'] || '',
          marca: item['marca'] || '',
        };
        
        const campoDatos = filtroActual.value?.campoDatos;
        if (campoDatos && item[campoDatos] !== undefined) {
          result.valorFiltro = item[campoDatos];
        }
        
        return result;
      });
    } else {
      console.error('Error en formato de respuesta:', response);
      drones.value = [];
    }
  } catch (error) {
    console.error(`Error al cargar drones por ${tipoLista.value}:`, error);
    drones.value = [];
  }
}

onMounted(() => {
  cargarDrones();
});


const isActive = computed({
  get: () => detallesDron.value && detallesDron.value.estado === 'Activo',
  set: () => {} 
})
const cambiarEstado = async () => {
  try {
    if (detallesDron.value.estado === 'Activo') {
      await useDron.putDesactivarDron(detallesDron.value.numeroserie)
      detallesDron.value.estado = 'Inactivo'
    } else {
      await useDron.putActivarDron(detallesDron.value.numeroserie)
      detallesDron.value.estado = 'Activo'
    }
  } catch (error) {
    console.error('Error al cambiar estado del dron:', error)
  }
}

const arrayBufferToBase64 = (buffer) => {
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
};

const descargarPDF = async () => {
  try {
    console.log('Iniciando descarga de PDF...');
    console.log('Plataforma actual:', Capacitor.getPlatform());
    
    const doc = new jsPDF();

    // Configurar el PDF
    doc.setFontSize(18);
    doc.text('Detalles del Dron', 105, 15, { align: 'center' });

    // Aquí asumimos que detallesDron está definido en tu componente
    if (typeof detallesDron.value !== 'undefined' && detallesDron.value) {
      doc.setFontSize(12);
      let y = 30;
      Object.entries(detallesDron.value).forEach(([key, value]) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        doc.text(`${formattedKey}: ${value}`, 20, y);
        y += 10;
      });
    } else {
      // Datos de ejemplo si detallesDron no está disponible
      doc.setFontSize(12);
      doc.text('No se encontraron detalles del Dron', 20, 30);
    }

    // Para navegador web
    if (Capacitor.getPlatform() === 'web') {
      doc.save(`Dron_Detalle.pdf`);
      mostrarMensajeExito("PDF generado correctamente");
      return;
    }

    // Para dispositivos móviles (Android/iOS)
    const pdfOutput = doc.output('arraybuffer');
    const base64Data = arrayBufferToBase64(pdfOutput);
    const fileName = `Dron_Detalle.pdf`;
    
    console.log('Generando PDF para dispositivo móvil...');
    
    try {
      // Primero verificamos si el directorio existe o lo creamos
      try {
        await Filesystem.mkdir({
          path: 'pdfs',
          directory: Directory.Documents,
          recursive: true
        });
        console.log('Directorio creado o ya existente');
      } catch (dirError) {
        console.log('Error al crear directorio o ya existe:', dirError);
        // Continuamos aunque falle la creación del directorio
      }
      
      // Guardar el archivo en el dispositivo
      const result = await Filesystem.writeFile({
        path: `pdfs/${fileName}`,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true
      });
      
      console.log('Archivo guardado con éxito:', result);
      
      // Obtener la URI del archivo para compartir
      const fileInfo = await Filesystem.getUri({
        path: `pdfs/${fileName}`,
        directory: Directory.Documents
      });
      
      console.log('URI del archivo:', fileInfo.uri);
      
      // Compartir el archivo
      await Share.share({
        title: 'PDF Generado',
        text: 'Detalles del dron',
        url: fileInfo.uri,
        dialogTitle: 'Compartir PDF'
      });
      
      mostrarMensajeExito("PDF generado y listo para compartir");
    } catch (fileError) {
      console.error('Error al guardar o compartir archivo:', fileError);
      // Loguear más detalles para depuración
      if (fileError.message) console.error('Mensaje de error:', fileError.message);
      if (fileError.stack) console.error('Stack de error:', fileError.stack);
      
      mostrarMensajeError(`Error al guardar el PDF: ${fileError.message || 'Error desconocido'}`);
    }
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    mostrarMensajeError(`Error al generar el PDF: ${error.message || 'Error desconocido'}`);
  }
};

defineOptions({
  name: 'DronesPage',
})
</script>
