<template>
  <q-page class="flex flex-center">

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
            @update:model-value="cargarMantenimientos"
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
          v-for="mantenimiento in mantenimientos" 
          :key="mantenimiento.codigomantenimiento"
          clickable
          @click="verDetalles(mantenimiento.codigomantenimiento)"
        >
          <q-item-section>
            <q-item-label>{{ mantenimiento.codigodron }} - {{ mantenimiento.codigomantenimiento }}</q-item-label>
            <q-item-label caption v-if="mantenimiento.valorFiltro !== undefined">
              {{ obtenerEtiquetaValor(mantenimiento.valorFiltro) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <div>
      <q-dialog v-model="mostrarDetalles" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Detalles del Mantenimiento</div>
          </q-card-section>

          <q-card-section class="q-pt-none" v-if="detallesMantenimiento">
            <div class="q-pa-md">
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">Código del mantenimiento:</div>
                <div class="col-8">{{ detallesMantenimiento.codigomantenimiento }}</div>
              </div>
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">Dron al que pertenece:</div>
                <div class="col-8">{{ detallesMantenimiento.codigodron }}</div>
              </div>
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">fecha del mantenimiento:</div>
                <div class="col-8">{{ detallesMantenimiento.fechaMantenimiento }}</div>
              </div>
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">valor:</div>
                <div class="col-8">{{ detallesMantenimiento.valor }}</div>
              </div>
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">Empresa responsable:</div>
                <div class="col-8">{{ detallesMantenimiento.empresaresponsable }}</div>
              </div>
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">Piloto encargado:</div>
                <div class="col-8">{{ detallesMantenimiento.pilotoresponsable }}</div>
              </div>
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">descripcion:</div>
                <div class="col-8">{{ detallesMantenimiento.descripcion }}</div>
              </div>
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">observaciones:</div>
                <div class="col-8">{{ detallesMantenimiento.observaciones }}</div>
              </div>
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">Pruebas superadas luego del mantenimiento:</div>
                <div class="col-8">{{ detallesMantenimiento.pruebas }}</div>
              </div>
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">link:</div>
                <div class="col-8">{{ detallesMantenimiento.archivos }}</div>
              </div>
              <div class="row q-mb-md">
                <div class="col-4 text-weight-bold">Fecha de registro:</div>
                <div class="col-8">{{ detallesMantenimiento.fechacreacion }}</div>
              </div>
            </div>
                  <q-card-actions align="right">
            <q-btn class="option-button" @click="editar(detallesMantenimiento)"> ✏️ </q-btn>
        <q-btn color="secondary" icon="download" label="Descargar PDF" @click="descargarPDF" />
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
              {{ accion == 1 ? 'Agregar Mantenimiento' : 'Editar Mantenimiento' }}
            </div>
          </q-card-section>

          <div class="q-pa-md">
            <div class="q-gutter-md row">
           
      <q-select 
        standout 
        v-model="numeroserie" 
        :options="organizarDrones" 
        option-value="valor" 
        option-label="label" 
        label="Seleccione el dron" 
        style="background-color: #grey; margin-bottom: 20px" 
      />

              <div class="q-pa-md">
                <div class="q-gutter-md row items-start">
                  <q-date v-model="fechaMantenimiento" />
                </div>
              </div>

              <q-input
                filled
                v-model="valor"
                label="Valor"
                :dense="dense"
              />

              <q-input
                filled
                v-model.trim="empresaresponsable"
                label="Empresa responsable"
                :dense="dense"
              />

          <q-select 
        standout 
        v-model="idPiloto" 
        :options="organizarPilotos" 
        option-value="valor" 
        option-label="label" 
        label="Seleccione un Piloto" 
        style="background-color: #grey; margin-bottom: 20px" 
      />

              <q-input
                filled
                v-model.trim="descripcion"
                label="Descripción"
                :dense="dense"
              />

              <q-input
                filled
                v-model.trim="observaciones"
                label="observaciones"
                :dense="dense"
              />

              <q-select
                filled
                v-model="pruebas"
                label="Superó las pruebas?:"
                :options="pruebasOptions"
                style="width: 300px"
                class="q-mb-md"
              />

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
                    v-for="(archivo, index) in archivos"
                    :key="index"
                    removable
                    @remove="eliminarArchivo(index)"
                    class="q-ma-xs"
                  >
                    {{ archivo.name }}
                    <q-tooltip
                      >{{ archivo.type }} - {{ (archivo.size / 1024).toFixed(2) }} KB</q-tooltip
                    >
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
              :loading="useMantenimiento.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn
              @click="editarMantenimiento()"
              v-else
              color="red"
              class="text-white"
              :loading="useMantenimiento.loading"
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

    <q-btn color="primary" :label="'Registrar Mantenimiento'" class="q-mt-md" @click="abrir" />

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useStoreMantenimiento } from '../stores/mantenimientos.js'
import { useQuasar } from 'quasar'
import { useStoreDrones } from '../stores/drones';
import { useStorePilotos } from '../stores/pilotos';
import { TIPOS_FILTRO, CONFIG_FILTROS } from '../composables/filtrosm';
import { jsPDF } from 'jspdf'

const useMantenimiento = useStoreMantenimiento()
const alert = ref(false)
const accion = ref(1)
const $q = useQuasar()
const usePiloto = useStorePilotos();
const useDron = useStoreDrones();

const numeroserie = ref(null)
const fechaMantenimiento = ref('')
const valor = ref('')
const empresaresponsable = ref('')
const idPiloto = ref(null)
const descripcion = ref('')
const observaciones = ref('')
const pruebas = ref('')

const archivos = ref([])
const dronesTodo = ref([]);
const pilotosTodo = ref([]);

const informacion = ref('')

const detallesMantenimiento = ref(null)
const mostrarDetalles = ref(false)

const pruebasOptions = ['si', 'no']

const tipoLista = ref(TIPOS_FILTRO.TODOS);
const ordenActual = ref('desc');
const mantenimientos = ref([]);
const valorFiltroTexto = ref(null);

// Funciones para el diálogo
function abrir() {
  accion.value = 1
  alert.value = true
}

function cerrar() {
  alert.value = false
}

onMounted(async () => {
  await listarDrones();
  await listarPilotos();
});

async function listarDrones() {
  try {
    const res = await useDron.listarDrones();
    console.log("Drones obtenidos:", res);
    
if (Array.isArray(res)) {
  dronesTodo.value = res;
} else {
  console.error("El formato de los drones no es el esperado:", res);
  dronesTodo.value = [];
}

  } catch (error) {
    console.error("Error al listar drones no ocupados:", error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar drones disponibles',
    });
    dronesTodo.value = [];
  }
}

const organizarDrones = computed(() => {
  if (!dronesTodo.value || !Array.isArray(dronesTodo.value)) {
    console.error("dronesTodo no es un array:", dronesTodo.value);
    return [];
  }
  
  return dronesTodo.value.map((element) => {
    console.log("Procesando dron:", element);
    return {
      label: `${element._numeroserie || element.numeroserie || 'Sin número'} - ${element.marca || 'Sin marca'} - ${element["ubicación_dron"] || 'Sin ubicación'}`,
      valor: `${element._numeroserie || element.numeroserie || ''}`,
      nombre: `${element.numeroserie || element._numeroserie || ''}`,
    };
  });
});

async function listarPilotos() {
  try {
    const res = await usePiloto.listarPilotos();
    console.log("Pilotos obtenidos:", res);
    
if (Array.isArray(res)) {
  pilotosTodo.value = res;
} else {
  console.error("El formato de los pilotos no es el esperado:", res);
  pilotosTodo.value = [];
}

  } catch (error) {
    console.error("Error al listar pilotos:", error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar pilotos ',
    });
    pilotosTodo.value = [];
  }
}

const organizarPilotos = computed(() => {
  if (!pilotosTodo.value || !Array.isArray(pilotosTodo.value)) {
    console.error("pilotosTodo no es un array:", pilotosTodo.value);
    return [];
  }
  
  return pilotosTodo.value.map((element) => {
    console.log("Procesando piloto:", element);
    return {
      label: `${element["nombre completo"] || element.nombre || 'Sin nombre'} ${element.primerApellido || ''} - ${element._identificacion || element.identificación || 'Sin ID'}`,
      valor: `${element.identificación || element.identificacion || ''}`,
      nombre: `${element["nombre completo"] || element.nombre || ''}`,
    };
  });
});

function manejarSeleccionArchivos(files) {
  if (files) {
    // Si es array de archivos
    if (Array.isArray(files)) {
      files.forEach((file) => {
        // Verificar si el archivo ya existe en la lista (evitar duplicados)
        const existeArchivo = archivos.value.some(
          (a) => a.name === file.name && a.size === file.size && a.type === file.type,
        )

        if (!existeArchivo) {
          archivos.value.push(file)
        }
      })
    }
    // Si es un solo archivo
    else if (files instanceof File) {
      const existeArchivo = archivos.value.some(
        (a) => a.name === files.name && a.size === files.size && a.type === files.type,
      )

      if (!existeArchivo) {
        archivos.value.push(files)
      }
    }
  }
}

function eliminarArchivo(index) {
  archivos.value.splice(index, 1)
}

async function guardar() {
  if (await validar()) {
    const formData = new FormData()

    const numeroSerieValor = typeof numeroserie.value === 'object' && numeroserie.value !== null 
      ? numeroserie.value.valor || numeroserie.value.label || JSON.stringify(numeroserie.value)
      : numeroserie.value;

    const pilotoValor = typeof idPiloto.value === 'object' && idPiloto.value !== null
      ? idPiloto.value.valor || idPiloto.value.label || JSON.stringify(idPiloto.value)
      : idPiloto.value;

    formData.append('numeroserie', numeroSerieValor)
    formData.append('fechaMantenimiento', fechaMantenimiento.value)
    formData.append('valor', valor.value)
    formData.append('empresaresponsable', empresaresponsable.value)
    formData.append('idPiloto', pilotoValor)
    formData.append('descripcion', descripcion.value)
    formData.append('observaciones', observaciones.value)
    formData.append('pruebas', pruebas.value)
    // Verifica si hay archivos antes de intentar agregarlos
    console.log('Archivos seleccionados:', archivos.value)

    // Añadir cada archivo al FormData
    if (archivos.value.length > 0) {
      archivos.value.forEach((archivo) => {
        formData.append('archivos', archivo)
      })
    }

    // Muestra el contenido del FormData para depuración
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }

    try {
      const response = await useMantenimiento.postMantenimiento(formData)
      console.log('Respuesta exitosa:', response)

      mostrarMensajeExito('mantenimiento agregado correctamente')
      cerrar()
      cargarMantenimientos();
      alert.value = false
      archivos.value = []
    } catch (error) {
      console.error('Error completo:', error)
      mostrarMensajeError('Error al guardar el mantenimiento')
    }
  }
}

function editar(mantenimiento) {
  accion.value = 2
  alert.value = true

  informacion.value = mantenimiento

  numeroserie.value = mantenimiento.numeroserie || ''
  fechaMantenimiento.value = mantenimiento.fechaMantenimiento || ''
  valor.value = mantenimiento.valor || ''
  empresaresponsable.value = mantenimiento.empresaresponsable || ''
  idPiloto.value = mantenimiento.idPiloto || ''
  descripcion.value = mantenimiento.descripcion || ''
  observaciones.value = mantenimiento.observaciones || ''
  pruebas.value = mantenimiento.pruebas || ''

  mostrarDetalles.value = false
}

async function editarMantenimiento() {
  if (await validar()) {
    const formData = new FormData()

    const numeroSerieValor = typeof numeroserie.value === 'object' && numeroserie.value !== null 
      ? numeroserie.value.valor || numeroserie.value.label || JSON.stringify(numeroserie.value)
      : numeroserie.value;

    const pilotoValor = typeof idPiloto.value === 'object' && idPiloto.value !== null
      ? idPiloto.value.valor || idPiloto.value.label || JSON.stringify(idPiloto.value)
      : idPiloto.value;

    formData.append('numeroserie', numeroSerieValor)
    formData.append('fechaMantenimiento', fechaMantenimiento.value)
    formData.append('valor', valor.value)
    formData.append('empresaresponsable', empresaresponsable.value)
    formData.append('idPiloto', pilotoValor)
    formData.append('descripcion', descripcion.value)
    formData.append('observaciones', observaciones.value)
    formData.append('pruebas', pruebas.value)
    
    console.log('Archivos a enviar:', archivos.value)

    // Añadir cada archivo al FormData
    if (archivos.value.length > 0) {
      archivos.value.forEach((archivo) => {
        formData.append('archivos', archivo)
      })
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }

    try {
      const response = await useMantenimiento.putMantenimiento(informacion.value.codigomantenimiento, formData)
      console.log('Respuesta exitosa:', response)

      cerrar()
      alert.value = false
      resetearFormulario()
      cargarMantenimientos();
    } catch (error) {
      console.error('Error al actualizar el mantenimiento:', error)
    }
  }
}

function resetearFormulario() {
  numeroserie.value = ''
  fechaMantenimiento.value = ''
  valor.value = ''
  empresaresponsable.value = ''
  idPiloto.value = ''
  descripcion.value = ''
  observaciones.value = ''
  pruebas.value = 1
}

async function validar() {
  let verificado = true

  if (numeroserie.value === '') {
    mostrarMensajeError('Seleccione el dron que se realizará el mantenimiento')
    verificado = false
  }
  if (fechaMantenimiento.value === '') {
    mostrarMensajeError('Seleccione la fecha de mantenimiento')
    verificado = false
  }
  if (valor.value === '') {
    mostrarMensajeError('Diligencie el valor del mantenimiento')
    verificado = false
  }
  if (empresaresponsable.value === '') {
    mostrarMensajeError('Diligencie la empresa responsable')
    verificado = false
  }
  if (idPiloto.value === '') {
    mostrarMensajeError('Seleccione el piloto encargado')
    verificado = false
  }
  if (descripcion.value === '') {
    mostrarMensajeError('Diligencie una descripción del mantenimiento')
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

async function verDetalles(codigomantenimiento) {
  try {
    const detalle = await useMantenimiento.obtenerdatodemantenimiento(codigomantenimiento)
    console.log('Detalles obtenidos:', detalle)

    if (detalle) {
      detallesMantenimiento.value = {
          codigomantenimiento: detalle['codigomantenimiento'] || '',
          codigodron: detalle['codigodron'] || '',
          fechaMantenimiento: detalle['fecha de mantenimiento'] || '',
          valor: detalle['valor'] || '',
          empresaresponsable: detalle['empresa responsable'] || '',
          pilotoresponsable: detalle['piloto responsable'] || '',
          descripcion: detalle['descripcion'] || '',
          observaciones: detalle['observaciones-mantenimiento'] || '',
          pruebas: detalle['superó pruebas'] || '',
          archivos: detalle['archivos-mantenimiento'] || '',
          fechacreacion: detalle['fecha del registro'] || '',
      }
      mostrarDetalles.value = true
    } else {
      console.error('No se pudieron obtener los detalles')
    }
  } catch (error) {
    console.error('Error al obtener detalles:', error)
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
  
  // Obtener el filtro actual basado en el tipo
  const filtro = CONFIG_FILTROS[tipo];
  
  // Asegurarnos de que hay un valor por defecto válido
  if (filtro.esFiltroTexto && filtro.opcionesFiltro?.length > 0) {
    // Usar el primer valor como valor por defecto
    valorFiltroTexto.value = filtro.opcionesFiltro[0].valor;
    console.log(`Tipo cambiado a ${tipo}, valor por defecto: ${valorFiltroTexto.value}`);
  } else {
    valorFiltroTexto.value = null;
    console.log(`Tipo cambiado a ${tipo}, sin valor por defecto`);
  }
  
  cargarMantenimientos();
}
function actualizarValorFiltro(nuevoValor) {
  console.log(`Cambiando valor del filtro a: ${nuevoValor}`);
  valorFiltroTexto.value = nuevoValor;
  cargarMantenimientos();
}

function obtenerEtiquetaValor(valor) {
  if (tipoLista.value === TIPOS_FILTRO.FECHA) {
    return new Date(valor).toLocaleDateString();
  } else if (tipoLista.value === TIPOS_FILTRO.COSTO) {
    return `$ ${valor}`;
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

async function cargarMantenimientos() {
  try {
    let response;
    
    if (tipoLista.value === TIPOS_FILTRO.TODOS) {
      response = await useMantenimiento.listarMantenimientos();
    } else if (filtroActual.value.esFiltroTexto) {
      console.log(`Filtrando por: ${tipoLista.value}, valor: ${valorFiltroTexto.value}`);
      
      let tipoBackend = tipoLista.value;
      
      response = await useMantenimiento.listarMantenimientosFiltrados(
        tipoBackend, 
        valorFiltroTexto.value
      );
    } else {
      const tipoOrden = filtroActual.value.campoOrden;
      response = await useMantenimiento.listarMantenimientosOrdenados(tipoOrden, ordenActual.value);
    }
    
    if (Array.isArray(response)) {
      mantenimientos.value = response.map(item => {
        const result = {
          codigomantenimiento: item['codigomantenimiento'] || '',
          codigodron: item['codigodron'] || '',
        };
        
        const campoDatos = filtroActual.value?.campoDatos;
        if (campoDatos && item[campoDatos] !== undefined) {
          result.valorFiltro = item[campoDatos];
        }
        
        return result;
      });
    } else {
      console.error('Error en formato de respuesta:', response);
      mantenimientos.value = [];
    }
  } catch (error) {
    console.error(`Error al cargar mantenimientos por ${tipoLista.value}:`, error);
    mantenimientos.value = [];
  }
}

const descargarPDF = () => {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text('Detalles del mantenimiento', 105, 15, { align: 'center' })
  
  doc.setFontSize(12)
  let y = 30
  Object.entries(detallesMantenimiento.value).forEach(([key, value]) => {
    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
    doc.text(`${formattedKey}: ${value}`, 20, y)
    y += 10
  })
  
  doc.save(`mantenimiento_${detallesMantenimiento.value.codigomantenimiento}.pdf`)
}

onMounted(() => {
  cargarMantenimientos();
});


defineOptions({
  name: 'MantenimientoPage',
})
</script>
