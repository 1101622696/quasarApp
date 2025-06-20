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
    <div class="q-pa-md">
  <q-select
    filled
    v-model="formulario.tipoOperacion"
    :options="opcionesOperacion"
    label="Selecciona tipo de operación"
    @update:model-value="mostrarFormulario"
    style="width: 300px"
    class="q-mb-md"
    emit-value
    map-options
    option-label="label"
    option-value="value"
  />

      <!-- Formulario para Polígono -->
      <div v-if="formulario.tipoOperacion === 'poligono'" class="q-mt-md">
        <q-input 
          class="input q-mb-md"
          filled 
          v-model="formulario.poligononombre" 
          label="Polígono (Nombre)"
        />
        <q-input
          class="input q-mb-md"
          filled
          v-model="formulario.altura_poligono"
          label="Altura solicitada (metros / pies)"
        />

        <q-table
          flat
          bordered
          :rows="filasPoligono"
          :columns="columnas"
          row-key="item"
          hide-bottom
          class="q-mb-md"
        >
<template #body-cell-latitud="props">
  <q-td>
    <q-input dense v-model="formulario[`latitud_poligono_${props.row.item}`]" />
  </q-td>
</template>
<template #body-cell-longitud="props">
  <q-td>
    <q-input dense v-model="formulario[`longitud_poligono_${props.row.item}`]" />
  </q-td>
</template>
          <template #body-cell-item="props">
            <q-td>
              {{ props.row.item }}
              <q-btn
                v-if="props.row.item === filasPoligono.length && props.row.item < 5"
                size="sm"
                flat
                icon="add"
                color="primary"
                @click="agregarFilaPoligono"
                class="q-ml-sm"
              />
            </q-td>
          </template>
        </q-table>

        <div class="text-caption text-grey q-mt-sm">
          * La última coordenada debe coincidir con la primera para cerrar el polígono.
        </div>
      </div>

      <!-- Formulario para Tramo -->
      <div v-if="formulario.tipoOperacion === 'tramo'" class="q-mt-md">
        <q-input 
          class="input q-mb-md"
          filled 
          v-model="formulario.tramolinealnombre" 
          label="Tramo Lineal (Nombre)"
        />
        <q-input 
          class="input q-mb-md"
          filled 
          v-model="formulario.altura_tramo" 
          label="Dirección"
        />

        <q-table
          flat
          bordered
          :rows="filasTramo"
          :columns="columnas"
          row-key="item"
          hide-bottom
          class="q-mb-md"
        >
         <template #body-cell-latitud="props">
  <q-td>
    <q-input dense v-model="formulario[`latitud_tramo_${props.row.item}`]" />
  </q-td>
</template>
<template #body-cell-longitud="props">
  <q-td>
    <q-input dense v-model="formulario[`longitud_tramo_${props.row.item}`]" />
  </q-td>
</template>
          <template #body-cell-item="props">
            <q-td>
              {{ props.row.item }}
              <q-btn
                v-if="props.row.item === filasTramo.length && props.row.item < 5"
                size="sm"
                flat
                icon="add"
                color="primary"
                @click="agregarFilaTramo"
                class="q-ml-sm"
              />
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Formulario para Circunferencia -->
      <div v-if="formulario.tipoOperacion === 'circunferencia'" class="q-mt-md">
        <q-input 
          class="input q-mb-md"
          filled 
          v-model="formulario.circuferenciaencoordenadayradionombre" 
          label="Circunferencia (Nombre)"
        />
        <q-input
          class="input q-mb-md"
          filled
          v-model="formulario.altura_circunferencia"
          label="Altura solicitada (metros / pies)"
        />

        <q-table
          flat
          bordered
          :rows="filasCircunferencia"
          :columns="columnas"
          row-key="item"
          hide-bottom
          class="q-mb-md"
        >
          <template #body-cell-latitud="props">
  <q-td>
    <q-input dense v-model="formulario[`latitud_circunferencia_${props.row.item}`]" />
  </q-td>
</template>
<template #body-cell-longitud="props">
  <q-td>
    <q-input dense v-model="formulario[`longitud_circunferencia_${props.row.item}`]" />
  </q-td>
</template>
          <template #body-cell-item="props">
            <q-td>
              {{ props.row.item }}
              <q-btn
                v-if="props.row.item === filasCircunferencia.length && props.row.item < 2"
                size="sm"
                flat
                icon="add"
                color="primary"
                @click="agregarFilaCircunferencia"
                class="q-ml-sm"
              />
            </q-td>
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
import { useQuasar } from 'quasar'

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
const dense = ref(false);
const perfilUsuario = computed(() => {
  return useUsuario.perfile || '';
});

const cargando = ref(false);
const $q = useQuasar();

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
 poligononombre: '',
  altura_poligono: '',
  latitud_poligono_1: '',
  longitud_poligono_1: '',
  latitud_poligono_2: '',
  longitud_poligono_2: '',
  latitud_poligono_3: '',
  longitud_poligono_3: '',
  latitud_poligono_4: '',
  longitud_poligono_4: '',
  latitud_poligono_5: '',
  longitud_poligono_5: '',
  
  tramolinealnombre: '',
  altura_tramo: '',
  latitud_tramo_1: '',
  longitud_tramo_1: '',
  latitud_tramo_2: '',
  longitud_tramo_2: '',
  latitud_tramo_3: '',
  longitud_tramo_3: '',
  latitud_tramo_4: '',
  longitud_tramo_4: '',
  latitud_tramo_5: '',
  longitud_tramo_5: '',
  
  circuferenciaencoordenadayradionombre: '',
  altura_circunferencia: '',
  latitud_circunferencia_1: '',
  longitud_circunferencia_1: '',
  latitud_circunferencia_2: '',
  longitud_circunferencia_2: '',
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

onMounted(() => {
  if (props.esEdicion && props.datos) {
    formulario.value = { ...props.datos };
  }
});

watch(() => perfilUsuario.value, (newPerfil) => {
  // Solo resetear si es cliente
  if (newPerfil.toLowerCase() === 'cliente' && !props.esEdicion) {
    formulario.value.pilotoarealizarvuelo = 'No';
    formulario.value.peso_maximo = '';
    formulario.value.tipodecontactovisualconlaua = '';
    formulario.value.vueloespecial = '';
    formulario.value.justificacionvueloespecial = '';
    formulario.value.tipoOperacion = null;
    formulario.value.nombrePoligono = '';
    formulario.value.altura_poligono = '';
    formulario.value.direccionTramo = '';
    formulario.value.nombreCircunferencia = '';
    formulario.value.altura_circunferencia = '';
  }
  // Si NO es cliente, no tocar tipoOperacion
}, { immediate: true });
watch(() => formulario.value.tipoOperacion, (newValue, oldValue) => {
  console.log('tipoOperacion cambió de:', oldValue, 'a:', newValue);
});
onMounted(() => {
  if (props.esEdicion && props.datos) {
    for (const key in props.datos) {
      if (key in formulario.value) {
        formulario.value[key] = props.datos[key];
      }
    }
  } else if (perfilUsuario.value.toLowerCase() === 'cliente') {
    formulario.value.pilotoarealizarvuelo = 'No';
    formulario.value.tipodeoperacionaerea = '';
  }
});

async function guardar() {
  cargando.value = true;

    if (!validarFechasYHoras()) {
    return;
  }

  try {
    const formData = new FormData();
    
    for (const key in formulario.value) {
      if (key === 'peso_maximo' && perfilUsuario.value.toLowerCase() === 'cliente') {
        continue;
      }
      if (key === 'altura_poligono' && perfilUsuario.value.toLowerCase() === 'cliente') {
        continue;
      }
    if (key === 'direccionTramo' && perfilUsuario.value.toLowerCase() === 'cliente') {
        continue;
      }
      if (key === 'nombreCircunferencia' && perfilUsuario.value.toLowerCase() === 'cliente') {
        continue;
      }
       if (key === 'altura_circunferencia' && perfilUsuario.value.toLowerCase() === 'cliente') {
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
];

const columnas = [
  { name: 'item', label: 'ITEM', field: 'item', align: 'left' },
  { name: 'latitud', label: 'LATITUD (N/S)', field: 'latitud' },
  { name: 'longitud', label: 'LONGITUD (W)', field: 'longitud' },
];

const filasPoligono = computed(() => {
  const filas = [];
  for (let i = 1; i <= 5; i++) {
    // Solo mostrar fila si es la primera o si tiene contenido
    if (i === 1 || formulario.value[`latitud_poligono_${i}`] || formulario.value[`longitud_poligono_${i}`]) {
      filas.push({ item: i });
    }
  }
  return filas;
});

const filasTramo = computed(() => {
  const filas = [];
  for (let i = 1; i <= 5; i++) {
    if (i === 1 || formulario.value[`latitud_tramo_${i}`] || formulario.value[`longitud_tramo_${i}`]) {
      filas.push({ item: i });
    }
  }
  return filas;
});

const filasCircunferencia = computed(() => {
  const filas = [];
  for (let i = 1; i <= 2; i++) {
    if (i === 1 || formulario.value[`latitud_circunferencia_${i}`] || formulario.value[`longitud_circunferencia_${i}`]) {
      filas.push({ item: i });
    }
  }
  return filas;
});
// Funciones para agregar filas
const agregarFilaPoligono = () => {
  const siguienteIndice = filasPoligono.value.length + 1;
  if (siguienteIndice <= 5) {
    formulario.value[`latitud_poligono_${siguienteIndice}`] = ' '; // Espacio en lugar de string vacío
    formulario.value[`longitud_poligono_${siguienteIndice}`] = ' ';
  }
};

const agregarFilaTramo = () => {
  const siguienteIndice = filasTramo.value.length + 1;
  if (siguienteIndice <= 5) {
    formulario.value[`latitud_tramo_${siguienteIndice}`] = ' ';
    formulario.value[`longitud_tramo_${siguienteIndice}`] = ' ';
  }
};

const agregarFilaCircunferencia = () => {
  const siguienteIndice = filasCircunferencia.value.length + 1;
  if (siguienteIndice <= 2) {
    formulario.value[`latitud_circunferencia_${siguienteIndice}`] = ' ';
    formulario.value[`longitud_circunferencia_${siguienteIndice}`] = ' ';
  }
};

const mostrarFormulario = () => {
  console.log('Tipo de operación seleccionado (solo valor):', formulario.value.tipoOperacion);
  
  formulario.value.nombrePoligono = '';
  formulario.value.altura_poligono = '';
  formulario.value.nombreTramo = '';
  formulario.value.direccionTramo = '';
  formulario.value.nombreCircunferencia = '';
  formulario.value.altura_circunferencia = '';
  
// Resetear coordenadas a estado inicial
for (let i = 2; i <= 5; i++) {
  formulario.value[`latitud_poligono_${i}`] = '';
  formulario.value[`longitud_poligono_${i}`] = '';
  formulario.value[`latitud_tramo_${i}`] = '';
  formulario.value[`longitud_tramo_${i}`] = '';
}
formulario.value[`latitud_circunferencia_2`] = '';
formulario.value[`longitud_circunferencia_2`] = '';
};

watch(() => formulario.value.tipoOperacion, (newValue) => {
  console.log('Cambió tipo de operación a:', newValue);
});

function validarFechasYHoras() {
  const { fecha_inicio, fecha_fin, hora_inicio, hora_fin } = formulario.value;
  
  // Validar que todos los campos estén completos
  if (!fecha_inicio || !fecha_fin || !hora_inicio || !hora_fin) {
    $q.notify({
      type: "negative",
      message: "Todos los campos de fecha y hora son obligatorios",
      position: "bottom-right",
    });
    return false;
  }
  
  // Convertir fechas a objetos Date para comparación
  const fechaInicioObj = new Date(fecha_inicio);
  const fechaFinObj = new Date(fecha_fin);
  
  // Validar que la fecha fin sea mayor o igual que la fecha inicio
  if (fechaFinObj < fechaInicioObj) {
    $q.notify({
      type: "negative",
      message: "La fecha fin debe ser mayor o igual que la fecha inicio",
      position: "bottom-right",
    });
    return false;
  }
  
    // Convertir horas a minutos para comparación más fácil
    const [horaInicioHoras, horaInicioMinutos] = hora_inicio.split(':').map(Number);
    const [horaFinHoras, horaFinMinutos] = hora_fin.split(':').map(Number);
    
    const minutosInicio = horaInicioHoras * 60 + horaInicioMinutos;
    const minutosFin = horaFinHoras * 60 + horaFinMinutos;
    
    if (minutosFin <= minutosInicio) {
      $q.notify({
        type: "negative",
        message: "La hora fin debe ser mayor que la hora inicio",
        position: "bottom-right",
      });
      return false;
    }
  
  return true;
}

</script>