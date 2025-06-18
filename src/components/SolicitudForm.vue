<template>
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-md row">

        <div class="col-12 col-sm-6" v-if="perfilUsuario.toLowerCase() !== 'cliente'">
          <q-select
            filled
            v-model="formulario.pilotoarealizarvuelo"
            label="Usted realizará el vuelo?"
            :options="realizarvueloOptions"
          />
        </div>

          <q-select
            filled
            v-model="formulario.tipodeoperacionaerea"
            label="Propósito"
            :options="tipodeoperacionaereaOptions"
          />
        
         <q-input
          v-model="formulario.empresa"
          label="Empresa"
          filled
          style="width: 300px"
        />

              <div class="q-pa-md">
                <div class="q-gutter-md row items-start">
                  <q-date v-model="formulario.fecha_inicio" />
                </div>
              </div>

              <div class="q-pa-md">
                <div class="q-gutter-md row items-start">
                  <q-date v-model="formulario.fecha_fin" />
                </div>
              </div>

              <div class="q-pa-md">
                <div class="q-gutter-md">
                  <q-time v-model="formulario.hora_inicio" />
                </div>
              </div>

              <div class="q-pa-md">
                <div class="q-gutter-md">
                  <q-time v-model="formulario.hora_fin" />
                </div>
              </div>

              <q-input
                filled
                v-model="formulario.detalles_cronograma"
                label="Otros Detalles del Cronograma de Operación:"
              />

           <div class="col-12 col-sm-6" v-if="perfilUsuario.toLowerCase() !== 'cliente'">
              <q-input
                filled
                type="number"
                v-model="formulario.peso_maximo"
                label="Peso (Masa) Bruto Máximo de Operación (KG):"
                :dense="dense"
              />
           </div>

              <q-select
                filled
                v-model="formulario.departamento"
                use-input
                input-debounce="0"
                label="Departamento"
                :options="departamentoOptions"
                @filter="filterdepartamentos"
                option-label="name"
                option-value="name"
                emit-value
                map-options
                style="width: 250px"
                behavior="menu"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> No results </q-item-section>
                  </q-item>
                </template>
              </q-select>

                            <q-select
                filled
                v-model="formulario.municipio"
                use-input
                input-debounce="0"
                label="Municipio"
                :options="municipioOptions"
                @filter="filtermunicipios"
                option-label="name"
                option-value="name"
                emit-value
                map-options
                style="width: 250px"
                behavior="menu"
                :disable="!formulario.departamento"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> No results </q-item-section>
                  </q-item>
                </template>
              </q-select>

        <div class="col-12 col-sm-6" v-if="perfilUsuario.toLowerCase() !== 'cliente'">
             <q-select
                filled
                v-model="formulario.tipodecontactovisualconlaua"
                label="tipo de contacto visual con la UA"
                :options="contactovisualOptions"
                style="width: 300px"
                class="q-mb-md"
              />
        </div>

        <div class="col-12 col-sm-6" v-if="perfilUsuario.toLowerCase() !== 'cliente'">
              <q-select
                filled
                v-model="formulario.vueloespecial"
                label="tipo de vuelo especial"
                :options="vueloespecialOptions"
                style="width: 300px"
                class="q-mb-md"
              />
        </div>

        <div class="col-12 col-sm-6" v-if="perfilUsuario.toLowerCase() !== 'cliente'">
              <q-input filled v-model="formulario.justificacionvueloespecial" label="Justificación:" />
        </div>

        <div class="col-12 col-sm-6" v-if="perfilUsuario.toLowerCase() !== 'cliente'">
              <q-select
                filled
                v-model="formulario.tipoOperacion"
                label="tipo de Operacion"
                :options="tipoOperacionOptions"
                style="width: 300px"
                class="q-mb-md"
              />

              <q-input
                class="input"
                filled
                v-model="formulario.poligononombre"
                label="Nombre del Polígono"
                :dense="dense"
              />
              <q-input
                class="input"
                filled
                v-model="formulario.altura_poligono"
                label="Altura solicitada: (metros / pies)"
                :dense="dense"
              />

               <div class="q-pa-md">
                <!-- Selector de tipo de operación -->
                <q-select
                  filled
                  v-model="formulario.tipoOperacion"
                  :options="opcionesOperacion"
                  label="Selecciona tipo de operación"
                  @update:model-value="mostrarFormulario"
                />

                <!-- Formulario: Polígono -->
                <div v-if="formulario.tipoOperacion === 'poligono'" class="q-mt-md">
                  <q-input filled v-model="formulario.nombrePoligono" label="Polígono (Nombre)" />
                  <q-input
                    filled
                    v-model="formulario.alturaPoligono"
                    label="Altura solicitada (metros / pies)"
                  />

               <q-table
                    flat
                    bordered
                    :rows="filasPoligono"
                    :columns="columnas"
                    row-key="item"
                    hide-bottom
                  >
                    <template #body-cell-latitud="props">
                      <q-td>
                        <q-input dense v-model="props.row.latitud" />
                      </q-td>
                    </template>
                    <template #body-cell-longitud="props">
                      <q-td>
                        <q-input dense v-model="props.row.longitud" />
                      </q-td>
                    </template>
                    <template #body-cell-item="props">
                      <q-td>
                        {{ props.row.item }}
                        <q-btn
                          v-if="props.row.item === filasPoligono.length && filasPoligono.length < 5"
                          size="sm"
                          flat
                          icon="add"
                          color="primary"
                          @click="agregarFilaPoligono"
                        />
                      </q-td>
                    </template>
                  </q-table>

                  <div class="text-caption text-grey q-mt-sm">
                    * La última coordenada debe coincidir con la primera para cerrar el polígono.
                  </div>
                </div>

                <!-- Formulario: Tramo -->
                <div v-if="formulario.tipoOperacion === 'tramo'" class="q-mt-md">
                  <q-input filled v-model="formulario.nombreTramo" label="Tramo Lineal (Nombre)" />
                  <q-input filled v-model="formulario.direccionTramo" label="Dirección" />

                  <q-table
                    flat
                    bordered
                    :rows="filasTramo"
                    :columns="columnas"
                    row-key="item"
                    hide-bottom
                  >
                    <template #body-cell-latitud="props">
                      <q-td><q-input dense v-model="props.row.latitud" /></q-td>
                    </template>
                    <template #body-cell-longitud="props">
                      <q-td><q-input dense v-model="props.row.longitud" /></q-td>
                    </template>
                    <template #body-cell-item="props">
                      <q-td>
                        {{ props.row.item }}
                        <q-btn
                          v-if="props.row.item === filasTramo.length && filasTramo.length < 5"
                          size="sm"
                          flat
                          icon="add"
                          color="primary"
                          @click="agregarFilaTramo"
                        />
                      </q-td>
                    </template>
                  </q-table>
                </div>

                <!-- Formulario: Circunferencia -->
                <div v-if="formulario.tipoOperacion === 'circunferencia'" class="q-mt-md">
                  <q-input filled v-model="formulario.nombreCircunferencia" label="Circunferencia (Nombre)" />
                  <q-input
                    filled
                    v-model="formulario.alturaCircunferencia"
                    label="Altura solicitada (metros / pies)"
                  />

                  <q-table
                    flat
                    bordered
                    :rows="filasCircunferencia"
                    :columns="columnas"
                    row-key="item"
                    hide-bottom
                  >
                    <template #body-cell-latitud="props">
                      <q-td><q-input dense v-model="props.row.latitud" /></q-td>
                    </template>
                    <template #body-cell-longitud="props">
                      <q-td><q-input dense v-model="props.row.longitud" /></q-td>
                    </template>
                  </q-table>
                </div>
              </div>
        </div>


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
      v-for="(archivo, index) in formulario.file_kmz"
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
        :loading="useSolicitud.loading"
      >
        {{ esEdicion ? 'Actualizar' : 'Agregar' }}
                <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
      </q-btn>
      <q-btn label="Cerrar" color="black" outline @click="$emit('cancelar')" />
    </q-card-actions>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useStoreSolicitudes } from '../stores/solicitudes.js'
import { departamentosBase } from '../composables/departamentos'
import { useStoreUsuarios } from '../stores/usuarios';

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
const useSolicitud = useStoreSolicitudes();
const useUsuario = useStoreUsuarios();

const perfilUsuario = computed(() => {
  return useUsuario.perfile || '';
});

const cargando = ref(false);
const formulario = ref({
pilotoarealizarvuelo: '',
 tipodeoperacionaerea: '',
 fecha_inicio: '',
 fecha_fin: '',
 hora_inicio: '',
 hora_fin: '',
 empresa: '',
 peso_maximo: '',
 detalles_cronograma: '',
 departamento: '',
 municipio: '',
 tipodecontactovisualconlaua: '',
 vueloespecial: '',
 justificacionvueloespecial: '',
 tipoOperacion: null,
 nombreTramo: '',
 direccionTramo: '',
 nombrePoligono: '',
 alturaPoligono: '',
 nombreCircunferencia: '',
 alturaCircunferencia: '',
 file_kmz: []
});

const tipodeoperacionaereaOptions = [
  'SIMPLE CAPTURA DE IMÁGENES O DATOS',
  'CAPTURA DE IMÁGENES O DATOS, PARA MEDIOS MASIVOS DE COMUNICACIÓN',
  'DISPERSIÓN',
  'TRANSPORTE DE CARGA ("DRONE DELIVERY")',
  'ACTIVIDADES MISIONALES DE ENTIDADES PÚBLICAS',
  'CAPTURA DE IMÁGENES O DATOS CON FINES DE VIGILANCIA Y SEGURIDAD PRIVADA',
  'ASPERSIÓN',
  'ENJAMBRE',
  'INSTRUCCIÓN',
]
const realizarvueloOptions = [
  'Si',
  'No'
]

const contactovisualOptions = ['vlos', 'evlos', 'bvlos']
const vueloespecialOptions = [
  'VUELO NOCTURNO',
  'VUELO AUTÓNOMO',
  'VUELO DE UA CAUTIVA',
  'VUELO EN ZONA URBANA',
  'VUELOS PARA DEMOSTRACIONES COMERCIALES O DE CAPACIDAD TECNOLÓGICA DE UAS',
  'VUELOS EN COMPETENCIAS Y ACTIVIDADES DEPORTIVAS Y RECREATIVAS AL AIRE LIBRE',
]

const departamentoOptions = ref([])
const municipioOptions = ref([])

const prepararDepartamentos = () => {
  departamentoOptions.value = Object.keys(departamentosBase).map((dep) => ({
    name: dep,
    value: dep,
  }))
}

// Actualizar municipios cuando cambia el departamento
watch(formulario.value.departamento, (newDep) => {
  formulario.value.municipio = ''
  if (newDep && departamentosBase[newDep]) {
    municipioOptions.value = departamentosBase[newDep].map((mun) => ({
      name: mun,
      value: mun,
    }))
  } else {
    municipioOptions.value = []
  }
})

// Filtrar departamentos
const filterdepartamentos = (val, update) => {
  if (val === '') {
    prepararDepartamentos()
  } else {
    const needle = val.toLowerCase()
    departamentoOptions.value = Object.keys(departamentosBase)
      .filter((v) => v.toLowerCase().indexOf(needle) > -1)
      .map((dep) => ({ name: dep, value: dep }))
  }
  update()
}

// Filtrar municipios
const filtermunicipios = (val, update) => {
  if (!formulario.value.departamento) return

  if (val === '') {
    municipioOptions.value = departamentosBase[formulario.value.departamento].map((mun) => ({
      name: mun,
      value: mun,
    }))
  } else {
    const needle = val.toLowerCase()
    municipioOptions.value = departamentosBase[formulario.value.departamento]
      .filter((v) => v.toLowerCase().indexOf(needle) > -1)
      .map((mun) => ({ name: mun, value: mun }))
  }
  update()
}

prepararDepartamentos()

function manejarSeleccionArchivos(files) {
  if (files) {
    // Si es array de archivos
    if (Array.isArray(files)) {
      files.forEach(file => {
        // Verificar si el archivo ya existe en la lista (evitar duplicados)
        const existeArchivo = formulario.value.file_kmz.some(a => 
          a.name === file.name && a.size === file.size && a.type === file.type
        );
        
        if (!existeArchivo) {
          formulario.value.file_kmz.push(file);
        }
      });
    } 
    // Si es un solo archivo
    else if (files instanceof File) {
      const existeArchivo = formulario.value.file_kmz.some(a => 
        a.name === files.name && a.size === files.size && a.type === files.type
      );
      
      if (!existeArchivo) {
        formulario.value.file_kmz.push(files);
      }
    }
  }
}

function eliminarArchivo(index) {
  formulario.value.file_kmz.splice(index, 1);
}

// Cargar datos si es edición
onMounted(() => {
  if (props.esEdicion && props.datos) {
    formulario.value = { ...props.datos };
  }
});

watch(() => perfilUsuario.value, (newPerfil) => {
  if (newPerfil.toLowerCase() === 'cliente' && !props.esEdicion) {
    formulario.value.pilotoarealizarvuelo = 'No';
    formulario.value.peso_maximo = '';
    formulario.value.tipodecontactovisualconlaua = '';
    formulario.value.vueloespecial = '';
    formulario.value.justificacionvueloespecial = '';
    formulario.value.tipoOperacion = '';
    formulario.value.nombrePoligono = '';
    formulario.value.alturaPoligono = '';
    formulario.value.direccionTramo = '';
    formulario.value.nombreCircunferencia = '';
    formulario.value.alturaCircunferencia = '';
  }
}, { immediate: true });

onMounted(() => {
  if (props.esEdicion && props.datos) {
    // Populate form with existing data
    for (const key in props.datos) {
      if (key in formulario.value) {
        formulario.value[key] = props.datos[key];
      }
    }
  } else if (perfilUsuario.value.toLowerCase() === 'cliente') {
    // Set default values for new form for cliente
    formulario.value.pilotoarealizarvuelo = 'No';
    formulario.value.tipodeoperacionaerea = '';
  }
});

async function guardar() {
  cargando.value = true;
  try {
    const formData = new FormData();
    
    for (const key in formulario.value) {
      if (key === 'peso_maximo' && perfilUsuario.value.toLowerCase() === 'cliente') {
        continue;
      }
      if (key === 'alturaPoligono' && perfilUsuario.value.toLowerCase() === 'cliente') {
        continue;
      }
    if (key === 'direccionTramo' && perfilUsuario.value.toLowerCase() === 'cliente') {
        continue;
      }
      if (key === 'nombreCircunferencia' && perfilUsuario.value.toLowerCase() === 'cliente') {
        continue;
      }
       if (key === 'alturaCircunferencia' && perfilUsuario.value.toLowerCase() === 'cliente') {
        continue;
      }
      if (key !== 'file_kmz') {
        formData.append(key, formulario.value[key]);
      }
    }
    
    if (formulario.value.file_kmz && formulario.value.file_kmz.length > 0) {
      formulario.value.file_kmz.forEach((file, index) => {
        formData.append('archivos', file);
        console.log(`index de filekmz ${index}`);
      });
    }
    
        if (props.esEdicion) {
      // Make sure we're passing the correct consecutivo value from the formulario object
      const consecutivo = formulario.value.consecutivo;
      formData.append('id', formulario.value.id);
      await useSolicitud.putSolicitud(consecutivo, formData);
    } else {
      await useSolicitud.postSolicitud(formData);
    }
    
    
    emit('guardar', {
      ...formulario.value,
      tipoRegistro: 'solicitudes',
      accion: props.esEdicion ? 'editar' : 'crear'
    });
  } catch (error) {
    console.error('Error al guardar:', error);
  } finally {
    cargando.value = false;
  }
}



const opcionesOperacion = [
  { label: 'Polígono', value: 'poligono' },
  { label: 'Tramo Lineal', value: 'tramo' },
  { label: 'Circunferencia', value: 'circunferencia' },
]

const columnas = [
  { name: 'item', label: 'ITEM', field: 'item', align: 'left' },
  { name: 'latitud', label: 'LATITUD (N/S)', field: 'latitud' },
  { name: 'longitud', label: 'LONGITUD (W)', field: 'longitud' },
]

// Polígono
const filasPoligono = ref([{ item: 1, latitud: '', longitud: '' }])
const agregarFilaPoligono = () => {
  if (filasPoligono.value.length < 5) {
    filasPoligono.value.push({
      item: filasPoligono.value.length + 1,
      latitud: '',
      longitud: '',
    })
  }
}

// Tramo
const filasTramo = ref([{ item: 1, latitud: '', longitud: '' }])
const agregarFilaTramo = () => {
  if (filasTramo.value.length < 5) {
    filasTramo.value.push({
      item: filasTramo.value.length + 1,
      latitud: '',
      longitud: '',
    })
  }
}

// Circunferencia
const filasCircunferencia = ref([{ item: 1, latitud: '', longitud: '' }])

const mostrarFormulario = () => {
  // Opcional: resetear datos si cambias de tipo
}

</script>