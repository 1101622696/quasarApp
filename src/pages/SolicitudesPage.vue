<template>
  <q-page padding>

    <h1>Solicitudes</h1>
    
    <div v-if="esPiloto">
      <h5>Mis solicitudes</h5>
      <q-list bordered padding>
        <q-item
          v-for="solicitud in solicitudesPorEmail"
          :key="solicitud.consecutivo"
          clickable
          @click="verDetalles(solicitud)"
        >
          <q-item-section>
            <q-item-label>{{ solicitud.empresa }}</q-item-label>
            <q-item-label caption>Consecutivo: {{ solicitud.consecutivo }}</q-item-label>
            <q-item-label caption>Estado: {{ solicitud.estadoProceso }}</q-item-label>
          </q-item-section>
          
          <q-item-section side>
            <AccionesRegistro 
              :registro="solicitud" 
              tipoRegistro="solicitudes"
              :perfilUsuario="perfilUsuario"
              @ver-detalles="verDetalles(solicitud)"
              @editar="editarSolicitud"
              @aprobar="aprobarSolicitud"
              @ir-prevuelo="crearPrevuelo"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    
    <div v-if="esCoordinador || esJefePiloto">
      <h5>Mis solicitudes</h5>
      <q-list bordered padding>
        <q-item
          v-for="solicitud in solicitudesPorEmail"
          :key="solicitud.consecutivo"
          clickable
          @click="verDetalles(solicitud)"
        >
          <q-item-section>
            <q-item-label>{{ solicitud.empresa }}</q-item-label>
            <q-item-label caption>Consecutivo: {{ solicitud.consecutivo }}</q-item-label>
            <q-item-label caption>Estado: {{ solicitud.estadoProceso }}</q-item-label>
          </q-item-section>
          
          <q-item-section side>
            <AccionesRegistro 
              :registro="solicitud" 
              tipoRegistro="solicitudes"
              :perfilUsuario="perfilUsuario"
              @ver-detalles="verDetalles(solicitud)"
              @editar="editarSolicitud"
              @aprobar="aprobarSolicitud"
              @ir-prevuelo="crearPrevuelo"
            />
          </q-item-section>
        </q-item>
      </q-list>
      
      <h5 class="q-mt-md">Solicitudes No Piloteadas</h5>
      <q-list bordered padding>
        <q-item
          v-for="solicitud in solicitudesNoHechas"
          :key="solicitud.consecutivo"
          clickable
          @click="verDetalles(solicitud)"
        >
          <q-item-section>
            <q-item-label>{{ solicitud.empresa }}</q-item-label>
            <q-item-label caption>Consecutivo: {{ solicitud.consecutivo }}</q-item-label>
            <q-item-label caption>Estado: {{ solicitud.estadoProceso }}</q-item-label>
          </q-item-section>
          
          <q-item-section side>
            <AccionesRegistro 
              :registro="solicitud" 
              tipoRegistro="solicitudes"
              :perfilUsuario="perfilUsuario"
              @ver-detalles="verDetalles(solicitud)"
              @editar="editarSolicitud"
              @aprobar="aprobarSolicitud"
              @ir-prevuelo="crearPrevuelo"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    
    <div v-if="esCliente">
      <q-list bordered padding>
        <q-item
          v-for="solicitud in solicitudesNoHechas"
          :key="solicitud.consecutivo"
          clickable
          @click="verDetalles(solicitud)"
        >
          <q-item-section>
            <q-item-label>{{ solicitud.empresa }}</q-item-label>
            <q-item-label caption>Consecutivo: {{ solicitud.consecutivo }}</q-item-label>
            <q-item-label caption>Estado: {{ solicitud.estadoProceso }}</q-item-label>
          </q-item-section>
          
          <q-item-section side>
            <AccionesRegistro 
              :registro="solicitud" 
              tipoRegistro="solicitudes"
              :perfilUsuario="perfilUsuario"
              @ver-detalles="verDetalles(solicitud)"
              @editar="editarSolicitud"
              @aprobar="aprobarSolicitud"
              @ir-prevuelo="crearPrevuelo"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    
    <q-btn color="primary" label="Crear solicitud" @click="mostrarFormulario = true" class="q-mt-md" />
    
    <q-dialog v-model="mostrarDetalles">
      <q-card style="width: 700px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Detalles de Solicitud</div>
        </q-card-section>
        
        <q-card-section>
          <VistaDetalle 
          v-model:mostrar="mostrarDetalles"
            :registro="solicitudSeleccionada" 
            tipoRegistro="solicitudes"
            @editar="editarSolicitud"
            @aprobar="aprobarSolicitud"
            @ir-prevuelo="crearPrevuelo"
          />
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
    <q-dialog v-model="mostrarFormulario">
      <q-card style="width: 700px">
        <q-card-section>
          <div class="text-h6">{{ esEdicion ? 'Editar' : 'Crear' }} Solicitud</div>
        </q-card-section>
        
        <SolicitudForm 
          :datos="datosSolicitud" 
          :esEdicion="esEdicion"
          @guardar="guardarCompletado"
          @cancelar="mostrarFormulario = false"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStoreSolicitudes } from '../stores/solicitudes';
import { useStoreUsuarios } from '../stores/usuarios'
import AccionesRegistro from '../components/AccionesRegistro.vue';
import VistaDetalle from '../components/VistaDetalle.vue';
import SolicitudForm from '../components/SolicitudForm.vue';

defineProps({
  registro: Object,
  tipoRegistro: String
})

const useSolicitud = useStoreSolicitudes();
const useUsuario = useStoreUsuarios()

// const solicitudes = ref([]);
const solicitudesPorEmail = ref([]);
const solicitudesNoHechas = ref([]);
const solicitudSeleccionada = ref(null);
const mostrarDetalles = ref(false);
const mostrarFormulario = ref(false);
const esEdicion = ref(false);
const datosSolicitud = ref({});

const perfilUsuario = computed(() => useUsuario.perfile || '');
const esCliente = computed(() => perfilUsuario.value.toLowerCase() === 'cliente');
const esPiloto = computed(() => perfilUsuario.value.toLowerCase() === 'piloto');
const esCoordinador = computed(() => perfilUsuario.value.toLowerCase() === 'coordinador');
const esJefePiloto = computed(() => perfilUsuario.value.toLowerCase() === 'jefepiloto');

onMounted(async () => {
  await cargarSolicitudes();
});

async function cargarSolicitudes() {
  const email = useUsuario.correo || localStorage.getItem('email');
  
  try {
    if (esPiloto.value || esCoordinador.value || esJefePiloto.value) {
      solicitudesPorEmail.value = await useSolicitud.listarSolicitudesEmail(email);
    }
    
    if (esCoordinador.value || esJefePiloto.value || esCliente.value) {
      solicitudesNoHechas.value = await useSolicitud.listarSolicitudesPorUltimoEmail(email);
    }
  } catch (error) {
    console.error('Error al cargar solicitudes:', error);
  } 
}

function verDetalles(solicitud) {
 solicitudSeleccionada.value = solicitud;
  mostrarDetalles.value = true;
}

function editarSolicitud(solicitud) {
  esEdicion.value = true;
  datosSolicitud.value = solicitud;
  mostrarFormulario.value = true;
}

async function aprobarSolicitud(id) {
  await useSolicitud.putAprobarSolicitud(id);
  await cargarSolicitudes();
}

function crearPrevuelo(solicitudId) {
 console.log(`solicitudid en crearpevuelo ${solicitudId}`);
}

async function guardarCompletado() {
  mostrarFormulario.value = false;
  await cargarSolicitudes();
}

</script>