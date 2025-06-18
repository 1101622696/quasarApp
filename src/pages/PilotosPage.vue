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
            @update:model-value="cargarPilotos"
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
          v-for="piloto in pilotos" 
          :key="piloto.identificacion"
          clickable
          @click="verDetalles(piloto.identificacion)"
        >
          <q-item-section>
            <q-item-label>{{ piloto.nombreCompleto }} - {{ piloto.identificacion }}</q-item-label>
            <q-item-label caption v-if="piloto.valorFiltro !== undefined">
              {{ obtenerEtiquetaValor(piloto.valorFiltro) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <div>
<q-dialog v-model="mostrarDetalles" persistent>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Detalles del piloto</div>
    </q-card-section>

    <q-card-section class="q-pt-none" v-if="detallesPiloto">
      <div class="q-pa-md">
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">identificacion:</div>
          <div class="col-8">{{ detallesPiloto.identificacion }}</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">nombre Completo:</div>
          <div class="col-8">{{ detallesPiloto.nombreCompleto }}</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">primer Apellido:</div>
          <div class="col-8">{{ detallesPiloto.primerApellido }}</div>
        </div>
       <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">tipo de Documento:</div>
          <div class="col-8">{{ detallesPiloto.tipoDocumento }}</div>
        </div>
         <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">pais de Expedicion:</div>
          <div class="col-8">{{ detallesPiloto.paisExpedicion }}</div>
        </div>
       <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">ciudad de Expedicion:</div>
          <div class="col-8">{{ detallesPiloto.ciudadExpedicion }}</div>
        </div>
               <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">fecha de Expedicion:</div>
          <div class="col-8">{{ detallesPiloto.fechaExpedicion }}</div>
        </div>
               <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">pais de Nacimiento:</div>
          <div class="col-8">{{ detallesPiloto.paisNacimiento }}</div>
        </div>
               <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">ciudad de Nacimiento:</div>
          <div class="col-8">{{ detallesPiloto.ciudadNacimiento }}</div>
        </div>
               <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">fecha de Nacimiento:</div>
          <div class="col-8">{{ detallesPiloto.fechaNacimiento }}</div>
        </div>
       <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">grupo Sanguineo:</div>
          <div class="col-8">{{ detallesPiloto.grupoSanguineo }}</div>
        </div>
       <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">factorRH:</div>
          <div class="col-8">{{ detallesPiloto.factorRH }}</div>
        </div>
         <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">genero:</div>
          <div class="col-8">{{ detallesPiloto.genero }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">estado Civil:</div>
          <div class="col-8">{{ detallesPiloto.estadoCivil }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">ciudad de Origen:</div>
          <div class="col-8">{{ detallesPiloto.ciudadOrigen }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">direccion:</div>
          <div class="col-8">{{ detallesPiloto.direccion }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">telefono Movil:</div>
          <div class="col-8">{{ detallesPiloto.telefonoMovil }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">fecha de Examen:</div>
          <div class="col-8">{{ detallesPiloto.fechaExamen }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">email:</div>
          <div class="col-8">{{ detallesPiloto.email }}</div>
        </div>
                 <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">contrato del piloto:</div>
          <div class="col-8">{{ detallesPiloto.contratopiloto }}</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">link:</div>
          <div class="col-8">{{ detallesPiloto.link }}</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">fechacreacion:</div>
          <div class="col-8">{{ detallesPiloto.fechacreacion }}</div>
        </div>
         <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">tiempo acumulado:</div>
          <div class="col-8">{{ detallesPiloto.tiempoacumulado }}</div>
        </div>
       <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">distancia acumulada:</div>
          <div class="col-8">{{ detallesPiloto.distanciaacumulada }}</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">vuelos realizados:</div>
          <div class="col-8">{{ detallesPiloto.vuelosrealizados }}</div>
        </div>
       <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">estado:</div>
          <div class="col-8">{{ detallesPiloto.estado }}</div>
        </div>
      </div>
        <div class="row q-mb-md">
            <div class="col-4 text-weight-bold">Activación:</div>
            <div class="col-8">
              <q-toggle
                v-model="isActive"
                :color="detallesPiloto.estado === 'Activo' ? 'grey' : 'primary'"
                @update:model-value="cambiarEstado"
              />
            </div>
        </div>
      <q-card-actions align="right">
        <q-btn color="secondary" icon="download" label="Descargue el pdf12" @click="descargarPDF" />
        <q-btn class="option-button" @click="editar(detallesPiloto)">
              ✏️
        </q-btn>
      </q-card-actions>

    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cerrar" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>


      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #ffffff; margin-bottom: 20px"
          >
            <div class="text-h6 text-black">
              {{ accion == 1 ? "Agregar Piloto" : "Editar Piloto" }}
            </div>
          </q-card-section>
    
  <div class="q-pa-md">
    <div class="q-gutter-md row">

      <q-input filled v-model.trim="nombreCompleto" label="Nombre" :dense="dense" /> 

      <q-input filled v-model.trim="primerApellido" label="Primer Apellido" :dense="dense" />

      <q-input filled v-model.trim="segundoApellido" label="Segundo Apellido" :dense="dense" />

    <q-select
      filled
      v-model="tipoDocumento"
      label="Tipo de documento:"
      :options="tipoDocumentoOptions"
      style="width: 300px"
      class="q-mb-md"
    />

      <q-input filled v-model.trim="identificacion" label="Digite su documento" :dense="dense" />
     
         <q-select
      filled
      v-model="paisExpedicion"
      label="País de Expedición:"
      :options="paisOptions"
      style="width: 300px"
      class="q-mb-md"
    />

<q-select
  filled
  v-model="ciudadExpedicion"
  use-input
  input-debounce="0"
  label="ciudad de Expedicion"
  :options="ubicacionOptions"
  @filter="filterUbicaciones"
  option-label="name"
  option-value="name"
  emit-value
  map-options
  style="width: 250px"
  behavior="menu"
>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>

  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date v-model="fechaExpedicion" />
    </div>
  </div>

         <q-select
      filled
      v-model="paisNacimiento"
      label="País de nacimiento:"
      :options="paisOptions"
      style="width: 300px"
      class="q-mb-md"
    />

<q-select
  filled
  v-model="ciudadNacimiento"
  use-input
  input-debounce="0"
  label="ciudad de Nacimiento"
  :options="ubicacionOptions"
  @filter="filterUbicaciones"
  option-label="name"
  option-value="name"
  emit-value
  map-options
  style="width: 250px"
  behavior="menu"
>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>

  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date v-model="fechaNacimiento" />
    </div>
  </div>

    <q-select
      filled
      v-model="grupoSanguineo"
      label="Grupo sanguíneo:"
      :options="grupoSanguineoOptions"
      style="width: 300px"
      class="q-mb-md"
    />

    <q-select
      filled
      v-model="factorRH"
      label="factor RH:"
      :options="factorRHOptions"
      style="width: 300px"
      class="q-mb-md"
    />

    <q-select
      filled
      v-model="genero"
      label="Género:"
      :options="generoOptions"
      style="width: 300px"
      class="q-mb-md"
    />

    <q-select
      filled
      v-model="contratopiloto"
      label="Contrato:"
      :options="contratoOptions"
      style="width: 300px"
      class="q-mb-md"
    />

        <q-select
      filled
      v-model="estadoCivil"
      label="Estado Civil:"
      :options="estadoCivilOptions"
      style="width: 300px"
      class="q-mb-md"
    />

<q-select
  filled
  v-model="ciudadOrigen"
  use-input
  input-debounce="0"
  label="ciudad de origen"
  :options="ubicacionOptions"
  @filter="filterUbicaciones"
  option-label="name"
  option-value="name"
  emit-value
  map-options
  style="width: 250px"
  behavior="menu"
>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input filled v-model.trim="direccion" label="Dirección" :dense="dense" />
     
      <q-input filled v-model.trim="telefonoMovil" label="Teléfono móvil" :dense="dense" />

  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date v-model="fechaExamen" />
    </div>
  </div>

      <q-input filled v-model.trim="email" label="Email" :dense="dense" />
  

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
      v-for="(archivo, index) in adjuntos"
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
              :loading="usePiloto.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
              <q-btn
              @click="editarPiloto()"
              v-else
              color="red"
              class="text-white"
              :loading="usePiloto.loading"
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

<q-btn
  color="primary"
  :label="'Registrar Piloto'"
  class="q-mt-md"
  @click="abrir" 
/>

<q-btn
  color="primary"
  :label="sideMenuOpen ? 'cerrar Menú' : 'Abrir menú lateral'"
  class="q-mt-md"
  @click="toggleSideMenu" 
/>


  </q-page>
</template>

<script setup>
// import { ref, onMounted } from 'vue'
import { ref, computed, onMounted, watch } from 'vue'
import { ubicacionesBase } from '../composables/ciudades'
import { useStorePilotos } from "../stores/pilotos.js";
import { useQuasar } from 'quasar'
import { TIPOS_FILTRO, CONFIG_FILTROS } from '../composables/filtrospiloto';
import { jsPDF } from 'jspdf'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { Capacitor } from '@capacitor/core'

// import { Toast } from '@capacitor/toast'
// import { Device } from '@capacitor/device'
// import { Permissions } from '@capacitor/core';

// import { AppLauncher } from '@capacitor/app-launcher';

const usePiloto = useStorePilotos();
const alert = ref(false)
const accion = ref(1)
const $q = useQuasar()

const nombreCompleto = ref("")
const primerApellido = ref("")
const segundoApellido = ref("")
const tipoDocumento = ref("")
const identificacion = ref("")
const paisExpedicion = ref("")
const ciudadExpedicion = ref("")
const fechaExpedicion = ref("")
const paisNacimiento = ref("")
const ciudadNacimiento = ref("")
const fechaNacimiento = ref("")
const grupoSanguineo = ref("")
const factorRH = ref("")
const genero = ref("")
const contratopiloto = ref("")
const estadoCivil = ref("")
const ciudadOrigen = ref("")
const direccion = ref("")
const telefonoMovil = ref("")
const fechaExamen = ref("")
const email = ref("")
const adjuntos = ref([]);

const informacion=ref("")

const detallesPiloto = ref(null);
const mostrarDetalles = ref(false);

const valorFiltroTexto = ref(null);
const tipoLista = ref(TIPOS_FILTRO.TODOS);
const ordenActual = ref('desc');
const pilotos = ref([]);

const tipoDocumentoOptions = [
  'CC', 
  'CE', 
  'PT', 
]

const paisOptions = [
  'COLOMBIA', 
  'VENEZUELA', 
  'ECUADOR', 
]

const grupoSanguineoOptions = [
  'O', 
  'A', 
  'AB', 
  'B', 
]

const factorRHOptions = [
  '+', 
  '-', 
]

const generoOptions = [
  'Masculino', 
  'Femenino', 
]

const contratoOptions = [
  'Externo', 
  'Sevicol', 
]

const estadoCivilOptions = [
  'SOLTERO', 
  'UNION LIBRE', 
  'CASADO', 
  'VIUDO', 
]

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
        const existeArchivo = adjuntos.value.some(a => 
          a.name === file.name && a.size === file.size && a.type === file.type
        );
        
        if (!existeArchivo) {
          adjuntos.value.push(file);
        }
      });
    } 
    // Si es un solo archivo
    else if (files instanceof File) {
      const existeArchivo = adjuntos.value.some(a => 
        a.name === files.name && a.size === files.size && a.type === files.type
      );
      
      if (!existeArchivo) {
        adjuntos.value.push(files);
      }
    }
  }
}

function eliminarArchivo(index) {
  adjuntos.value.splice(index, 1);
}

async function guardar() {

  if (await validar()) {
    const formData = new FormData();

    formData.append("nombreCompleto", nombreCompleto.value);
    formData.append("primerApellido", primerApellido.value);
    formData.append("segundoApellido", segundoApellido.value);
    formData.append("tipoDocumento", tipoDocumento.value);
    formData.append("identificacion", identificacion.value);
    formData.append("paisExpedicion", paisExpedicion.value);
    formData.append("ciudadExpedicion", ciudadExpedicion.value);
    formData.append("fechaExpedicion", fechaExpedicion.value);
    formData.append("paisNacimiento", paisNacimiento.value);
    formData.append("ciudadNacimiento", ciudadNacimiento.value);
    formData.append("fechaNacimiento", fechaNacimiento.value);
    formData.append("grupoSanguineo", grupoSanguineo.value);
    formData.append("factorRH", factorRH.value);
    formData.append("genero", genero.value);
    formData.append("estadoCivil", estadoCivil.value);
    formData.append("ciudadOrigen", ciudadOrigen.value);
    formData.append("direccion", direccion.value);
    formData.append("telefonoMovil", telefonoMovil.value);
    formData.append("fechaExamen", fechaExamen.value);
    formData.append("email", email.value);
    formData.append("contratopiloto", contratopiloto.value);

  // Verifica si hay archivos antes de intentar agregarlos
    console.log("Archivos seleccionados:", adjuntos.value);
    
    // Añadir cada archivo al FormData
    if (adjuntos.value.length > 0) {
      adjuntos.value.forEach(archivo => {
        formData.append("archivos", archivo);
      });
    }

    // Muestra el contenido del FormData para depuración
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    try {
      const response = await usePiloto.postPilotos(formData);
      console.log("Respuesta exitosa:", response);
      
      mostrarMensajeExito("piloto agregado correctamente");
      cerrar();
      alert.value = false;
      cargarPilotos();
      adjuntos.value = [];

    } catch (error) {
      console.error("Error completo:", error);
      mostrarMensajeError("Error al guardar el piloto");
    }
  }
}

function editar(piloto){
  accion.value = 2
  alert.value = true

informacion.value=piloto

nombreCompleto.value=piloto.nombreCompleto || '';
primerApellido.value=piloto.primerApellido || '';
segundoApellido.value=piloto.segundoApellido || '';
tipoDocumento.value=piloto.tipoDocumento || '';
identificacion.value=piloto.identificacion || '';
paisExpedicion.value=piloto.paisExpedicion || '';
ciudadExpedicion.value=piloto.ciudadExpedicion || '';
fechaExpedicion.value=piloto.fechaExpedicion || '';
paisNacimiento.value=piloto.paisNacimiento || '';
ciudadNacimiento.value=piloto.ciudadNacimiento || '';
fechaNacimiento.value=piloto.fechaNacimiento || '';
grupoSanguineo.value=piloto.grupoSanguineo || '';
factorRH.value=piloto.factorRH || '';
genero.value=piloto.genero || '';
estadoCivil.value=piloto.estadoCivil || '';
ciudadOrigen.value=piloto.ciudadOrigen || '';
direccion.value=piloto.direccion || '';
telefonoMovil.value=piloto.telefonoMovil || '';
fechaExamen.value=piloto.fechaExamen || '';
email.value=piloto.email || '';
contratopiloto.value=piloto.contratopiloto || '';

      mostrarDetalles.value = false;
}


async function editarPiloto() {
  if (await validar()) {
const formData = new FormData();

    formData.append("nombreCompleto", nombreCompleto.value);
    formData.append("primerApellido", primerApellido.value);
    formData.append("segundoApellido", segundoApellido.value);
    formData.append("tipoDocumento", tipoDocumento.value);
    formData.append("identificacion", identificacion.value);
    formData.append("paisExpedicion", paisExpedicion.value);
    formData.append("ciudadExpedicion", ciudadExpedicion.value);
    formData.append("fechaExpedicion", fechaExpedicion.value);
    formData.append("paisNacimiento", paisNacimiento.value);
    formData.append("ciudadNacimiento", ciudadNacimiento.value);
    formData.append("fechaNacimiento", fechaNacimiento.value);
    formData.append("grupoSanguineo", grupoSanguineo.value);
    formData.append("factorRH", factorRH.value);
    formData.append("genero", genero.value);
    formData.append("estadoCivil", estadoCivil.value);
    formData.append("ciudadOrigen", ciudadOrigen.value);
    formData.append("direccion", direccion.value);
    formData.append("telefonoMovil", telefonoMovil.value);
    formData.append("fechaExamen", fechaExamen.value);
    formData.append("email", email.value);
    formData.append("contratopiloto", contratopiloto.value);

    console.log("Archivos a enviar:", adjuntos.value);
    
    // Añadir cada archivo al FormData
    if (adjuntos.value.length > 0) {
      adjuntos.value.forEach(archivo => {
        formData.append("archivos", archivo);
      });
    }

        for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
     const response = await usePiloto.putPiloto(informacion.value.identificacion, formData);
      console.log("Respuesta exitosa:", response);
      
      cerrar();
      alert.value = false;
      // listartablaPilotos();
      resetearFormulario();
  }catch (error) {
      console.error("Error al actualizar el piloto:", error);
    }
}
}

function resetearFormulario() {
  nombreCompleto.value = '';
  primerApellido.value = '';
  segundoApellido.value = '';
  identificacion.value = '';
  paisExpedicion.value = '';
  tipoDocumento.value = '';
  ciudadExpedicion.value = '';
  accion.value = 1; 
}

    async function validar() {
    let verificado = true;

    if (nombreCompleto.value === "") {
        mostrarMensajeError("Diligencie el nombre");
        verificado = false;
    }
    if (primerApellido.value === "") {
        mostrarMensajeError("Diligencie el primer apellido");
        verificado = false;
    }
    if (tipoDocumento.value === "") {
        mostrarMensajeError("Seleccione el tipo de Documento");
        verificado = false;
    }    
    if (identificacion.value === "") {
        mostrarMensajeError("Diligencie el documento");
        verificado = false;
    }    
    if (ciudadNacimiento.value === "") {
        mostrarMensajeError("Seleccione la ciudad de nacimiento");
        verificado = false;
    }    
    if (fechaNacimiento.value === "") {
        mostrarMensajeError("Seleccione la fecha de nacimiento");
        verificado = false;
    }    
  if (telefonoMovil.value === "" || isNaN(telefonoMovil.value) || telefonoMovil.value < 0 || telefonoMovil.value.length < 10) {
    mostrarMensajeError("El teléfono debe ser un número válido y tener al menos 10 caracteres");
    verificado = false;
  }
    if (email.value === "") {
        mostrarMensajeError("Diligencie el nombre");
        verificado = false;
    }
    return verificado;
}

function mostrarMensajeError(mensaje) {
    $q.notify({
        type: "negative",
        message: mensaje,
        position: "bottom-right",
    });
}

function mostrarMensajeExito(mensaje) {
    $q.notify({
        type: "positive",
        message: mensaje,
        position: "bottom-right",
    });
}

const ubicacionOptions = ref([])

const prepararUbicaciones = () => {
  if (typeof ubicacionesBase[0] === 'object') {
    ubicacionOptions.value = [...ubicacionesBase];
  } 
  // Si tus ubicaciones son strings simples
  else if (typeof ubicacionesBase[0] === 'string') {
    ubicacionOptions.value = ubicacionesBase.map(ub => ({
      name: ub,
      value: ub
    }));
  }
}

const filterUbicaciones = (val, update) => {
  if (val === '') {
    update(() => {
      prepararUbicaciones();
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    
    // Si ubicacionesBase contiene strings
    if (typeof ubicacionesBase[0] === 'string') {
      ubicacionOptions.value = ubicacionesBase
        .filter(ub => ub.toLowerCase().includes(needle))
        .map(ub => ({ name: ub, value: ub }));
    } 
    // Si ubicacionesBase contiene objetos
    else {
      ubicacionOptions.value = ubicacionesBase
        .filter(ub => ub.name.toLowerCase().includes(needle));
    }
  })
}

prepararUbicaciones();

async function verDetalles(identificacion) {
  try {
    const detalle = await usePiloto.obtenerdatospiloto(identificacion);
    console.log("Detalles obtenidos:", detalle);
    
    if (detalle) {
      detallesPiloto.value = {
          nombreCompleto: detalle['nombre completo']|| '',
          primerApellido: detalle['primer apellido']|| '',
          segundoApellido: detalle['segundo apellido']|| '',
          tipoDocumento: detalle['tipo de documento']|| '',
          identificacion: detalle['identificación'] || '', 
          paisExpedicion: detalle['pais de expedición'] || '', 
          ciudadExpedicion: detalle['ciudad de expedición'] || '',
          fechaExpedicion: detalle['fecha de expedición'] || '',
          paisNacimiento: detalle['pais de nacimiento'] || '',
          ciudadNacimiento: detalle['ciudad de nacimiento'] || '',
          fechaNacimiento: detalle['fecha de nacimiento'] || '',
          grupoSanguineo: detalle['grupo sanguíneo'] || '',
          factorRH: detalle['factor rh'] || '',
          genero: detalle['género'] || '',
          estadoCivil: detalle['estado civil'] || '',
          ciudadOrigen: detalle['ciudad de origen'] || '',
          direccion: detalle['dirección'] || '',
          telefonoMovil: detalle['teléfono móvil'] || '',
          fechaExamen: detalle['fecha examen médico'] || '',
          email: detalle['email'] || '',
          contratopiloto: detalle['contratopiloto'] || '',
          link: detalle['archivos'] || '',
          fechacreacion: detalle['fecha creacion'] || '',
          tiempoacumulado: detalle['tiempo acumulado'] || '',
          distanciaacumulada: detalle['distancia acumulada'] || '',
          vuelosrealizados: detalle['vuelos realizados'] || '',
          estado: detalle['estado piloto'] || '',
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
  
 if (tipo === 'estado') {
    valorFiltroTexto.value = 'activo'; 
  } else {
    valorFiltroTexto.value = null;
  }
  
  cargarPilotos();
}

function actualizarValorFiltro(nuevoValor) {
  // console.log(`Cambiando valor del filtro a: ${nuevoValor}`);
  valorFiltroTexto.value = nuevoValor;
  cargarPilotos();
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

async function cargarPilotos() {
  try {
    let response;
    
    if (tipoLista.value === TIPOS_FILTRO.TODOS) {
      response = await usePiloto.listarPilotos();
   } else if (filtroActual.value.esFiltroTexto) {
      // console.log(`Filtrando por: ${tipoLista.value}, valor: ${valorFiltroTexto.value}`);
      
      let tipoBackend = tipoLista.value;
      
      response = await usePiloto.listarPilotosFiltrados(
        tipoBackend, 
        valorFiltroTexto.value
      );
    } else {
      const tipoOrden = filtroActual.value.campoOrden;
      response = await usePiloto.listarPilotosOrdenados(tipoOrden, ordenActual.value);
    }
    
    if (Array.isArray(response)) {
      pilotos.value = response.map(item => {
        const result = {
          identificacion: item['identificación'] || '',
          nombreCompleto: item['nombre completo'] || '',
        };
        
        const campoDatos = filtroActual.value?.campoDatos;
        if (campoDatos && item[campoDatos] !== undefined) {
          result.valorFiltro = item[campoDatos];
        }
        
        return result;
      });
    } else {
      console.error('Error en formato de respuesta:', response);
      pilotos.value = [];
    }
  } catch (error) {
    console.error(`Error al cargar pilotos por ${tipoLista.value}:`, error);
    pilotos.value = [];
  }
}

onMounted(() => {
  cargarPilotos();
});

const isActive = computed({
  get: () => detallesPiloto.value && detallesPiloto.value.estado === 'Activo',
  set: () => {} 
})

const cambiarEstado = async () => {
  try {
    if (detallesPiloto.value.estado === 'Activo') {
      await usePiloto.putDesactivarPiloto(detallesPiloto.value.identificacion)
      detallesPiloto.value.estado = 'Inactivo'
    } else {
      await usePiloto.putActivarPiloto(detallesPiloto.value.identificacion)
      detallesPiloto.value.estado = 'Activo'
    }
  } catch (error) {
    console.error('Error al cambiar estado del piloto:', error)
  }
}

// const descargarPDF = () => {
//   const doc = new jsPDF()
  
//   doc.setFontSize(18)
//   doc.text('Detalles del Piloto', 105, 15, { align: 'center' })
  
//   doc.setFontSize(12)
//   let y = 30
//   Object.entries(detallesPiloto.value).forEach(([key, value]) => {
//     const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
//     doc.text(`${formattedKey}: ${value}`, 20, y)
//     y += 10
//   })
  
//   doc.save(`Piloto_${detallesPiloto.value.identificacion}.pdf`)
// }

// const mostrarToast = async (mensaje, esError = false) => {
//   try {
//     // Intentar usar el plugin de Toast
//     await Toast.show({
//       text: mensaje,
//       duration: 'long',
//       position: 'bottom'
//     });
    
//     // También llamamos a tus funciones existentes de mensaje
//     if (esError) {
//       mostrarMensajeError(mensaje);
//     } else {
//       mostrarMensajeExito(mensaje);
//     }
//   } catch (toastError) {
//     console.error('Error al mostrar Toast, usando método alternativo:', toastError);
//     // Si falla, usamos solo tus funciones existentes
//     if (esError) {
//       mostrarMensajeError(mensaje);
//     } else {
//       mostrarMensajeExito(mensaje);
//     }
//   }
// };

// const solicitarPermisos = async () => {
//   if (Capacitor.getPlatform() === 'android') {
//     try {
//       // Para Capacitor v3+, debemos importar el plugin de permisos correctamente
//       const { Permissions } = await import('@capacitor/core');
      
//       if (Permissions) {
//         // Para Android < 10
//         try {
//           const permResult = await Permissions.query({
//             name: 'storage'
//           });
          
//           if (permResult.state !== 'granted') {
//             await Permissions.request({
//               name: 'storage'
//             });
//           }
//         } catch (permError) {
//           console.warn('Error al solicitar permisos de almacenamiento:', permError);
//           // Continuamos a pesar del error de permisos
//         }
//       }
      
//       return true;
//     } catch (err) {
//       console.error('Error al solicitar permisos:', err);
//       return false;
//     }
//   }
  
//   return true; // En plataformas no Android, devolvemos true directamente
// };

const arrayBufferToBase64 = (buffer) => {
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
};

// esta funcion sigue sin servir en la app movil 
// Función de descarga de PDF actualizada para Capacitor v3+
const descargarPDF = async () => {
  try {
    console.log('Iniciando descarga de PDF...');
    console.log('Plataforma actual:', Capacitor.getPlatform());
    
    const doc = new jsPDF();

    // Configurar el PDF
    doc.setFontSize(18);
    doc.text('Detalles del Piloto', 105, 15, { align: 'center' });

    // Aquí asumimos que detallesPiloto está definido en tu componente
    if (typeof detallesPiloto.value !== 'undefined' && detallesPiloto.value) {
      doc.setFontSize(12);
      let y = 30;
      Object.entries(detallesPiloto.value).forEach(([key, value]) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        doc.text(`${formattedKey}: ${value}`, 20, y);
        y += 10;
      });
    } else {
      // Datos de ejemplo si detallesPiloto no está disponible
      doc.setFontSize(12);
      doc.text('No se encontraron detalles del piloto', 20, 30);
    }

    // Para navegador web
    if (Capacitor.getPlatform() === 'web') {
      doc.save(`Piloto_Detalle.pdf`);
      mostrarMensajeExito("PDF generado correctamente");
      return;
    }

    // Para dispositivos móviles (Android/iOS)
    const pdfOutput = doc.output('arraybuffer');
    const base64Data = arrayBufferToBase64(pdfOutput);
    const fileName = `Piloto_Detalle.pdf`;
    
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
        text: 'Detalles del piloto',
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

// const mostrarToast = async (mensaje) => {
//   try {
//     await Toast.show({
//       text: mensaje,
//       duration: 'long',
//       position: 'bottom'
//     });
//   } catch (error) {
//     console.error('Error al mostrar toast:', error);
//     // Fallback a console.log si el toast falla
//     console.log(mensaje);
//   }
// };

// Función para solicitar permisos (para Android < 11)
// const solicitarPermisos = async () => {
//   if (Capacitor.getPlatform() !== 'android') return true;
  
//   try {
//     // En Android 11+ (API 30+) no se usa este enfoque, sino el sistema de archivos específico de la app
//     const androidInfo = await Device.getInfo();
//     if (parseInt(androidInfo.androidSDKVersion, 10) >= 30) {
//       return true; // En Android 11+ usamos scoped storage
//     }
    
//     const permissionStatus = await Permissions.query({ name: 'storage' });
    
//     if (permissionStatus.state === 'granted') {
//       return true;
//     }
    
//     const requestResult = await Permissions.request({ name: 'storage' });
//     return requestResult.state === 'granted';
//   } catch (error) {
//     console.error('Error al solicitar permisos:', error);
//     return false;
//   }
// };

// // Convertir ArrayBuffer a Base64
// const arrayBufferToBase64 = (buffer) => {
//   const uint8Array = new Uint8Array(buffer);
//   let binary = '';
//   for (let i = 0; i < uint8Array.byteLength; i++) {
//     binary += String.fromCharCode(uint8Array[i]);
//   }
//   return btoa(binary);
// };


// tampoco funcionó en la app movil.
// Función principal para descargar PDF
// const descargarPDF = async () => {
//   try {
//     // Crear PDF
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text('Detalles del Piloto', 105, 15, { align: 'center' });
//     doc.setFontSize(12);
//     doc.text('Datos del piloto...', 20, 30);
    
//     // Para navegador web
//     if (Capacitor.getPlatform() === 'web') {
//       doc.save('Piloto_Detalle.pdf');
//       return;
//     }
    
//     // Para Android
//     const pdfBase64 = doc.output('datauristring').split(',')[1];
//     const fileName = `piloto_${Date.now()}.pdf`;
    
//     // Guardar archivo sin usar la variable result
//     await Filesystem.writeFile({
//       path: fileName,
//       data: pdfBase64,
//       directory: Directory.Documents
//     });
    
//     const uriResult = await Filesystem.getUri({
//       path: fileName,
//       directory: Directory.Data
//     });
    
//     await Share.share({
//       title: 'Detalles del Piloto',
//       text: 'PDF con detalles del piloto',
//       url: uriResult.uri
//     });
    
//     await mostrarToast('PDF generado correctamente');
    
//   } catch (error) {
//     console.error('Error:', error.message);
//     await mostrarToast('Error al generar PDF: ' + error.message);
//   }
// };

// const descargarPDF = async () => {
//   try {
//     // Crear PDF
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text('Detalles del Piloto', 105, 15, { align: 'center' });
//     doc.setFontSize(12);
//     doc.text('Datos del piloto...', 20, 30);
    
//     // Web: Descarga directa
//     if (Capacitor.getPlatform() === 'web') {
//       doc.save('Piloto_Detalle.pdf');
//       return;
//     }
    
//     // Android: Usa FileOpener alternativo
//     const base64Data = doc.output('datauristring');
    
//     // Método alternativo: usa Share directamente con data URI
//     await Share.share({
//       title: 'Detalles del Piloto',
//       text: 'PDF con detalles del piloto',
//       url: base64Data // Enviar el PDF directamente como URI de datos
//     });
    
//     console.log('PDF compartido directamente');
    
//   } catch (error) {
//     console.error('Error:', error.message);
//     // Usa alert en lugar de Toast
//     alert('Error al generar PDF: ' + error.message);
//   }
// };

defineOptions({
  name: 'PilotosPage'
})

</script>
