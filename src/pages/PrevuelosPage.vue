<template>
  <q-page padding>
 <span class="text-h1"> Prevuelos </span>
    
    <q-list bordered padding>
      <q-item
        v-for="prevuelo in prevuelos"
        :key="prevuelo.consecutivo"
        clickable
        @click="verDetalles(prevuelo)"
      >
        <q-item-section>
          <q-item-label>{{ prevuelo.autorizacion }}</q-item-label>
          <q-item-label caption>Consecutivo: {{ prevuelo.solicitudesaprobadas }}</q-item-label>
        </q-item-section>
        
        <q-item-section side>
          <AccionesRegistro 
            :registro="prevuelo" 
            tipoRegistro="prevuelos"
            @editar="editarPrevuelo"
            @aprobar="aprobarPrevuelo"
            @ir-postvuelo="crearPostvuelo"
          />
        </q-item-section>
      </q-item>
    </q-list>
    
    <q-btn color="primary" label="Crear prevuelo" @click="mostrarFormulario = true" />
    
    <q-dialog v-model="mostrarDetalles">
      <VistaDetalle 
        :registro="prevueloSeleccionado" 
        tipoRegistro="prevuelos"
        @editar="editarPrevuelo"
        @aprobar="aprobarPrevuelo"
        @ir-postvuelo="crearPostvuelo"
      />
    </q-dialog>
    
    <q-dialog v-model="mostrarFormulario">
      <q-card style="width: 700px">
        <q-card-section>
          <div class="text-h6">{{ esEdicion ? 'Editar' : 'Crear' }} Prevuelo</div>
        </q-card-section>
        
        <PrevueloForm 
          :datos="datosPevuelo" 
          :esEdicion="esEdicion"
          @guardar="guardarCompletado"
          @cancelar="mostrarFormulario = false"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStorePrevuelos } from '../stores/prevuelos';
import { useStoreUsuarios } from '../stores/usuarios'
import AccionesRegistro from '../components/AccionesRegistro.vue';
import VistaDetalle from '../components/VistaDetalle.vue';
import PrevueloForm from '../components/PrevueloForm.vue';

const usePrevuelo = useStorePrevuelos()
const useUsuario = useStoreUsuarios()

const prevuelos = ref([]);
const prevueloSeleccionado = ref(null);
const mostrarDetalles = ref(false);
const mostrarFormulario = ref(false);
const esEdicion = ref(false);
const datosPrevuelo = ref({});

onMounted(async () => {
  await cargarPrevuelos();
});

async function cargarPrevuelos() {
  const email = useUsuario.correo || localStorage.getItem('email')

  prevuelos.value = await usePrevuelo.listarPrevuelosEmail(email);
}

function verDetalles(prevuelo) {
  prevueloSeleccionado.value = prevuelo;
  mostrarDetalles.value = true;
}

function editarPrevuelo(prevuelo) {
  esEdicion.value = true;
  datosPrevuelo.value = prevuelo;
  mostrarFormulario.value = true;
}

async function aprobarPrevuelo(id) {
  await usePrevuelo.putAprobarPrevuelo(id);
  await cargarPrevuelos();
}

// Crear postvuelo desde prevuelo
function crearPostvuelo(prevueloId) {
 console.log(`prevueloid en crearPostvuelo ${prevueloId}`);
}

// Cuando se guarda el formulario
async function guardarCompletado() {
  mostrarFormulario.value = false;
  await cargarPrevuelos();
}


defineOptions({
  name: 'PrevuelosPage',
})
</script>
