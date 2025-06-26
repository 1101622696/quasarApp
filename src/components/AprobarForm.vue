<template>
  <div class="botones-acciones">
    <q-page padding>
      
      <q-select 
        standout 
        v-model="dronavolar" 
        :options="organizarDrones" 
        option-value="valor" 
        option-label="label" 
        label="Seleccione el dron" 
        style="background-color: #grey; margin-bottom: 20px" 
      />
      
<q-select 
  standout 
  v-model="pilotoavolar" 
  :options="organizarPilotos" 
  option-value="valor" 
  option-label="label" 
  label="Seleccione un Piloto" 
  style="background-color: #grey; margin-bottom: 20px" 
/>
      
      <q-input
        v-model="notas"
        label="Notas (opcional)"
        type="textarea"
        standout
        rows="3"
        style="margin-bottom: 20px"
        hint="Notas adicionales para la aprobación"
      />
      
      <div class="row justify-end q-mt-md">
        <q-btn 
          color="negative" 
          label="Cancelar" 
          class="q-mr-md" 
          @click="$emit('cancelar')" 
        />
<q-btn 
  color="primary" 
  label="Aprobar" 
  @click="aprobarSolicitud" 
  :loading="loading" 
  :disable="!esFormularioValido"
/>
          <q-btn 
          color="primary" 
          label="Denegar" 
          @click="denegarSolicitud" 
          :loading="loading" 
        />
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, defineEmits } from 'vue';
import { useStorePilotos } from '../stores/pilotos';
import { useStoreDrones } from '../stores/drones';
import { useStoreSolicitudes } from '../stores/solicitudes';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const usePiloto = useStorePilotos();
const useDron = useStoreDrones();
const useSolicitud = useStoreSolicitudes();

const props = defineProps({
  consecutivo: {
    type: String,
    required: true
  },
  registroSolicitud: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['cancelar', 'aprobacion-completada', 'solicitud-denegada']);

const dronavolar = ref(null);
const pilotoavolar = ref(null);
const notas = ref('');
const dronesTodo = ref([]);
const pilotosTodo = ref([]);
const loading = ref(false);

onMounted(async () => {
  await listarDrones();
  await listarPilotos();
  
  const datos = props.registroSolicitud.datosOriginales || props.registroSolicitud;
  
  if (datos.dronAsignado) {
    dronavolar.value = datos.dronAsignado;
  }
  
  // Asignar el piloto si existe
  if (datos.pilotoAsignado) {
    pilotoavolar.value = datos.pilotoAsignado;
  }
  // Debug - mostrar la estructura completa para diagnóstico
  // console.log("Datos de la solicitud:", JSON.stringify(datos, null, 2));
  // console.log("¿Tiene usuario?", tienePilotoAsignado.value);
});

async function listarDrones() {
  try {
    const res = await useDron.listarDronesActivosNoOcupados();
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
    // console.log("Procesando dron:", element);
    return {
      label: `${element.numeroserie || 'Sin número'} - ${element.marca || 'Sin marca'} - ${element["ubicación_dron"] || 'Sin ubicación'}`,
      valor: `${element._numeroserie || element.numeroserie || ''}`,
      nombre: `${element.numeroserie || element._numeroserie || ''}`,
    };
  });
});

async function listarPilotos() {
  try {
    const res = await usePiloto.listarPilotosActivos();
    
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
      message: 'Error al cargar pilotos activos',
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
    // console.log("Procesando piloto:", element);
    return {
      label: `${element["nombre completo"] || element.nombre || 'Sin nombre'} ${element.primerApellido || ''} - ${element._identificacion || element.identificación || 'Sin ID'}`,
      valor: `${element.identificación || element.identificacion || ''}`,
      nombre: `${element["nombre completo"] || element.nombre || ''}`,
    };
  });
});

const tienePilotoAsignado = computed(() => {
  if (!props.registroSolicitud) {
    console.log("No hay registroSolicitud");
    return false;
  }
  
  const datos = props.registroSolicitud.datosOriginales || props.registroSolicitud;
  
  // console.log("Valor de usuario:", datos.usuario);
  // console.log("Tipo de usuario:", typeof datos.usuario);
  
  // Usamos la propiedad "in" para verificar la existencia y luego comprobamos si no está vacía
  const tieneUsuario = 'usuario' in datos && 
                      datos.usuario !== null && 
                      datos.usuario !== undefined && 
                      datos.usuario.trim() !== '';
  
  // console.log("¿Tiene usuario asignado?", tieneUsuario);
  return tieneUsuario;
});


const esFormularioValido = computed(() => {
  console.log("Estado de validación:", {
    tienePilotoAsignado: tienePilotoAsignado.value,
    dronSeleccionado: !!dronavolar.value,
    pilotoSeleccionado: !!pilotoavolar.value
  });
  
  if (!tienePilotoAsignado.value) {
    return dronavolar.value && pilotoavolar.value;
  } else {
    // Hay piloto asignado, solo requerir dron (piloto es opcional)
    return !!dronavolar.value;
  }
});

async function aprobarSolicitud() {
  try {
    if (!esFormularioValido.value) {
const mensaje = !dronavolar.value 
  ? 'Por favor seleccione un dron' 
  : 'Por favor seleccione un piloto';
      
      $q.notify({
        type: 'warning',
        message: mensaje
      });
      return;
    }
    
    loading.value = true;
    
    const numeroserie = dronavolar.value;
    // const piloto = tienePilotoAsignado.value ? null : pilotoavolar.value;
    const piloto = pilotoavolar.value || null;
    
    console.log("Enviando aprobación:", {
      consecutivo: props.consecutivo,
      dron: numeroserie,
      piloto: piloto,
      notas: notas.value,
      tienePilotoAsignado: tienePilotoAsignado.value
    });
    
    const response = await useSolicitud.putAprobarSolicitud(
      props.consecutivo,
      numeroserie,
      piloto,
      notas.value
    );
    
    if (response.status === 200) {
      $q.notify({
        type: 'positive',
        message: 'Solicitud aprobada correctamente'
      });
      
      emit('aprobacion-completada', {
        consecutivo: props.consecutivo,
        codigo: response.data.codigo,
      });
    }
  } catch (error) {
    console.error("Error al aprobar solicitud:", error);
    $q.notify({
      type: 'negative',
      message: `Error al aprobar la solicitud: ${error.message || 'Error desconocido'}`
    });
  } finally {
    loading.value = false;
  }
}

async function denegarSolicitud() {
  try {
    
    loading.value = true;
    
    let piloto;
    
        console.log("Enviando denego:", {
      consecutivo: props.consecutivo,
      piloto: piloto,
      notas: notas.value,
      tienePilotoAsignado: tienePilotoAsignado.value
    });

    const response = await useSolicitud.putDenegarSolicitud(
      props.consecutivo,
      "",
      piloto,
      notas.value
    );
    
    if (response.status === 200) {
      emit('solicitud-denegada', {
        consecutivo: props.consecutivo,
        codigo: response.data.codigo,
      });
    }
  } catch (error) {
    console.error("Error al denegar solicitud:", error);
    $q.notify({
      type: 'negative',
      message: 'Error al denegar la solicitud',
    });
  } finally {
    loading.value = false;
  }
}
</script>